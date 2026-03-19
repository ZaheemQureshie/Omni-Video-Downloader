from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InfoRequest(BaseModel):
    url: str


class FormatInfo(BaseModel):
    format_id: str
    resolution: str
    ext: str
    filesize: Optional[int] = None
    note: Optional[str] = ""
    has_video: bool = True
    has_audio: bool = True


class InfoResponse(BaseModel):
    title: str
    thumbnail: str = ""
    duration_string: str = ""
    duration: float = 0.0
    uploader: str = ""
    view_count: Optional[int] = None
    upload_date: str = ""
    description: str = ""
    formats: list[FormatInfo] = []
    platform: str = "other"
    is_playlist: bool = False
    playlist_count: Optional[int] = None


class DownloadRequest(BaseModel):
    url: str
    quality: str = "best"  # best, 1080p, 720p, 480p, 360p, audio
    format: str = "mp4"  # mp4, mp3, webm, mkv, any
    download_id: str


class DownloadResponse(BaseModel):
    download_id: str
    status: str = "started"


class ProgressUpdate(BaseModel):
    download_id: str
    status: str  # downloading, finished, error
    percent: float = 0.0
    speed: str = ""
    eta: int = 0
    filename: str = ""
    total_bytes: int = 0


class DownloadStatus(BaseModel):
    download_id: str
    url: str
    title: str
    filename: str
    status: str
    progress: float
    speed: str
    eta: int
    filesize: int
    platform: str
    quality: str
    format: str
    error_message: str = ""
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HistoryFilter(BaseModel):
    search: str = ""
    platform: str = ""
    status: str = ""
    page: int = 1
    per_page: int = 20
