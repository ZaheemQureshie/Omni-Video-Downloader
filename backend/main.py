import os
import time
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models.download import init_db
from routers import info, download, history
from services.progress import manager
from services.ytdlp_service import DOWNLOADS_DIR


async def cleanup_old_files():
    """Delete downloaded files older than 1 hour."""
    while True:
        await asyncio.sleep(300)  # Check every 5 minutes
        try:
            now = time.time()
            cutoff = now - 3600  # 1 hour
            if os.path.exists(DOWNLOADS_DIR):
                for filename in os.listdir(DOWNLOADS_DIR):
                    filepath = os.path.join(DOWNLOADS_DIR, filename)
                    if os.path.isfile(filepath) and os.path.getmtime(filepath) < cutoff:
                        try:
                            os.remove(filepath)
                        except OSError:
                            pass
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    cleanup_task = asyncio.create_task(cleanup_old_files())
    yield
    cleanup_task.cancel()


app = FastAPI(
    title="Video Downloader API",
    description="All-in-One Video Downloader powered by yt-dlp",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(info.router)
app.include_router(download.router)
app.include_router(history.router)


@app.websocket("/ws/progress/{download_id}")
async def websocket_progress(websocket: WebSocket, download_id: str):
    await manager.connect(download_id, websocket)
    try:
        while True:
            # Keep connection alive; client can send pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(download_id, websocket)
    except Exception:
        manager.disconnect(download_id, websocket)


@app.get("/")
async def root():
    return {
        "name": "Video Downloader API",
        "version": "1.0.0",
        "docs": "/docs",
    }
