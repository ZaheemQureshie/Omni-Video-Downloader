import os
import asyncio
import threading
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.download import Download, get_session
from schemas.download import DownloadRequest, DownloadResponse, DownloadStatus
from services.ytdlp_service import download_video, DOWNLOADS_DIR
from services.progress import manager

router = APIRouter(prefix="/api", tags=["download"])

# Track active download threads so we can signal cancellation
_cancel_flags: dict[str, threading.Event] = {}


def _run_download_sync(
    url: str,
    quality: str,
    fmt: str,
    download_id: str,
    loop: asyncio.AbstractEventLoop,
):
    """Run the blocking yt-dlp download in a thread, pushing progress via the event loop."""
    from models.download import async_session

    def progress_callback(data: dict):
        asyncio.run_coroutine_threadsafe(
            _update_progress(download_id, data), loop
        )

    result = download_video(url, quality, fmt, download_id, progress_callback)

    # Update DB with final state
    async def _finalize():
        async with async_session() as session:
            dl = await session.get(Download, download_id)
            if dl:
                if result.get("status") == "finished":
                    dl.status = "finished"
                    dl.progress = 100
                    dl.filename = result.get("filename", "")
                    dl.file_path = result.get("filepath", "")
                    dl.speed = ""
                    dl.eta = 0
                else:
                    dl.status = "error"
                    dl.error_message = result.get("error", "Unknown error")
                await session.commit()

    asyncio.run_coroutine_threadsafe(_finalize(), loop).result(timeout=10)
    _cancel_flags.pop(download_id, None)


async def _update_progress(download_id: str, data: dict):
    """Update DB + broadcast to WebSocket."""
    from models.download import async_session

    async with async_session() as session:
        dl = await session.get(Download, download_id)
        if dl:
            dl.status = data.get("status", dl.status)
            dl.progress = data.get("percent", dl.progress)
            dl.speed = data.get("speed", dl.speed)
            dl.eta = data.get("eta", dl.eta)
            dl.filesize = data.get("total_bytes", dl.filesize) or dl.filesize
            if data.get("filename"):
                dl.filename = data["filename"]
            await session.commit()

    await manager.send_progress(download_id, data)


@router.post("/download", response_model=DownloadResponse)
async def start_download(
    request: DownloadRequest,
    session: AsyncSession = Depends(get_session),
):
    """Start a video download as a background task."""
    dl = Download(
        download_id=request.download_id,
        url=request.url,
        quality=request.quality,
        format=request.format,
        status="pending",
    )
    session.add(dl)
    await session.commit()

    loop = asyncio.get_event_loop()
    cancel_event = threading.Event()
    _cancel_flags[request.download_id] = cancel_event

    thread = threading.Thread(
        target=_run_download_sync,
        args=(request.url, request.quality, request.format, request.download_id, loop),
        daemon=True,
    )
    thread.start()

    return DownloadResponse(download_id=request.download_id, status="started")


@router.get("/download/{download_id}/file")
async def get_download_file(
    download_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Stream the downloaded file to the browser."""
    dl = await session.get(Download, download_id)
    if not dl:
        raise HTTPException(status_code=404, detail="Download not found")
    if dl.status != "finished":
        raise HTTPException(status_code=400, detail="Download not finished yet")

    filepath = dl.file_path
    if not filepath or not os.path.exists(filepath):
        # Try to find the file
        for f in os.listdir(DOWNLOADS_DIR):
            if f.startswith(download_id):
                filepath = os.path.join(DOWNLOADS_DIR, f)
                break
        else:
            raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=filepath,
        filename=dl.filename or os.path.basename(filepath),
        media_type="application/octet-stream",
    )


@router.delete("/download/{download_id}")
async def cancel_download(
    download_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Cancel an active download or remove a completed one."""
    dl = await session.get(Download, download_id)
    if not dl:
        raise HTTPException(status_code=404, detail="Download not found")

    # Signal cancel
    if download_id in _cancel_flags:
        _cancel_flags[download_id].set()

    # Remove file
    if dl.file_path and os.path.exists(dl.file_path):
        try:
            os.remove(dl.file_path)
        except OSError:
            pass

    # Also try to find by prefix
    for f in os.listdir(DOWNLOADS_DIR):
        if f.startswith(download_id):
            try:
                os.remove(os.path.join(DOWNLOADS_DIR, f))
            except OSError:
                pass

    dl.status = "cancelled"
    await session.commit()

    return {"status": "cancelled", "download_id": download_id}


@router.get("/downloads", response_model=list[DownloadStatus])
async def list_downloads(session: AsyncSession = Depends(get_session)):
    """Get all downloads with current status."""
    result = await session.execute(
        select(Download).order_by(Download.created_at.desc())
    )
    downloads = result.scalars().all()
    return [DownloadStatus.model_validate(d) for d in downloads]
