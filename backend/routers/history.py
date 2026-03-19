from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from models.download import Download, get_session
from schemas.download import DownloadStatus
import os

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history", response_model=dict)
async def get_history(
    search: str = Query("", description="Search by title or URL"),
    platform: str = Query("", description="Filter by platform"),
    status: str = Query("", description="Filter by status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    """Get paginated download history with optional filters."""
    query = select(Download).order_by(Download.created_at.desc())

    if search:
        query = query.where(
            or_(
                Download.title.ilike(f"%{search}%"),
                Download.url.ilike(f"%{search}%"),
            )
        )
    if platform:
        query = query.where(Download.platform == platform)
    if status:
        query = query.where(Download.status == status)

    # Count total
    count_q = select(func.count()).select_from(query.subquery())
    total = (await session.execute(count_q)).scalar() or 0

    # Paginate
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    result = await session.execute(query)
    downloads = result.scalars().all()

    return {
        "items": [DownloadStatus.model_validate(d) for d in downloads],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if total > 0 else 0,
    }


@router.delete("/history/{download_id}")
async def delete_history_item(
    download_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Delete a single history record and its file."""
    dl = await session.get(Download, download_id)
    if not dl:
        raise HTTPException(status_code=404, detail="Record not found")

    if dl.file_path and os.path.exists(dl.file_path):
        try:
            os.remove(dl.file_path)
        except OSError:
            pass

    await session.delete(dl)
    await session.commit()
    return {"status": "deleted"}


@router.delete("/history")
async def clear_history(
    session: AsyncSession = Depends(get_session),
):
    """Clear all history records."""
    result = await session.execute(select(Download))
    downloads = result.scalars().all()
    for dl in downloads:
        if dl.file_path and os.path.exists(dl.file_path):
            try:
                os.remove(dl.file_path)
            except OSError:
                pass
        await session.delete(dl)
    await session.commit()
    return {"status": "cleared"}
