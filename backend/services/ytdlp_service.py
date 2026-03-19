import os
import re
import asyncio
from typing import Callable, Optional
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError, ExtractorError
from schemas.download import InfoResponse, FormatInfo

DOWNLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "downloads")
os.makedirs(DOWNLOADS_DIR, exist_ok=True)


PLATFORM_PATTERNS = {
    "youtube": [r"(youtube\.com|youtu\.be)"],
    "instagram": [r"instagram\.com"],
    "tiktok": [r"tiktok\.com"],
    "facebook": [r"(facebook\.com|fb\.watch)"],
    "snapchat": [r"snapchat\.com"],
    "twitter": [r"(twitter\.com|x\.com)"],
    "reddit": [r"reddit\.com"],
}


def detect_platform(url: str) -> str:
    for platform, patterns in PLATFORM_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return platform
    return "other"


QUALITY_MAP = {
    "best": "bestvideo+bestaudio/best",
    "1080p": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "720p": "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best[height<=720]",
    "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]",
    "360p": "bestvideo[height<=360]+bestaudio/best[height<=360]",
    "audio": "bestaudio/best",
}


def _fmt_duration(seconds: Optional[int]) -> str:
    if not seconds:
        return ""
    h, r = divmod(int(seconds), 3600)
    m, s = divmod(r, 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def _parse_formats(raw_formats: list) -> list[FormatInfo]:
    seen = set()
    result = []
    for f in raw_formats:
        height = f.get("height")
        ext = f.get("ext", "")
        if not height and f.get("acodec") != "none":
            fid = f.get("format_id", "")
            if f"audio-{ext}" not in seen:
                seen.add(f"audio-{ext}")
                result.append(FormatInfo(
                    format_id=fid,
                    resolution="Audio Only",
                    ext=ext,
                    filesize=f.get("filesize") or f.get("filesize_approx"),
                    note=f.get("format_note") or "",
                    has_video=False,
                    has_audio=True,
                ))
            continue
        if height:
            res_label = f"{height}p"
            key = f"{res_label}-{ext}"
            if key not in seen:
                seen.add(key)
                result.append(FormatInfo(
                    format_id=f.get("format_id", ""),
                    resolution=res_label,
                    ext=ext,
                    filesize=f.get("filesize") or f.get("filesize_approx"),
                    note=f.get("format_note") or "",
                    has_video=True,
                    has_audio=f.get("acodec", "none") != "none",
                ))
    result.sort(key=lambda x: (
        0 if x.has_video else 1,
        -int(x.resolution.replace("p", "").replace("Audio Only", "0")),
    ))
    return result


def fetch_info(url: str) -> InfoResponse:
    """Fetch video metadata without downloading."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "no_color": True,
        "nocheckcertificate": True,
        "ignoreerrors": True,
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Fetch-Mode": "navigate",
        },
    }
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except (DownloadError, ExtractorError) as e:
        raise ValueError(str(e))

    if not info:
        raise ValueError("Could not extract video information")

    is_playlist = info.get("_type") == "playlist" or "entries" in info
    playlist_count = None
    if is_playlist:
        entries = info.get("entries")
        if entries:
            playlist_count = len(list(entries)) if hasattr(entries, '__len__') else None
        first_entry = None
        if entries:
            for entry in entries:
                first_entry = entry
                break
        if first_entry:
            info = {**info, **first_entry, "_type": "playlist"}
            info["entries"] = entries

    raw_formats = info.get("formats") or []
    formats = _parse_formats(raw_formats) if raw_formats else []

    platform = detect_platform(url)

    return InfoResponse(
        title=info.get("title", "Unknown"),
        thumbnail=info.get("thumbnail", ""),
        duration_string=_fmt_duration(info.get("duration")),
        duration=info.get("duration") or 0,
        uploader=info.get("uploader") or info.get("channel") or "",
        view_count=info.get("view_count"),
        upload_date=info.get("upload_date") or "",
        description=(info.get("description") or "")[:500],
        formats=formats,
        platform=platform,
        is_playlist=is_playlist,
        playlist_count=playlist_count,
    )


def download_video(
    url: str,
    quality: str,
    fmt: str,
    download_id: str,
    progress_callback: Callable,
) -> dict:
    """Download a video using yt-dlp and report progress via callback."""
    format_str = QUALITY_MAP.get(quality, QUALITY_MAP["best"])

    ydl_opts = {
        "format": format_str,
        "outtmpl": os.path.join(DOWNLOADS_DIR, f"{download_id}_%(title)s.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "no_color": True,
        "nocheckcertificate": True,
        "ignoreerrors": True,
        "merge_output_format": "mp4" if quality != "audio" else None,
        "progress_hooks": [],
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        },
    }

    if fmt == "webm":
        ydl_opts["merge_output_format"] = "webm"
    elif fmt == "mkv":
        ydl_opts["merge_output_format"] = "mkv"

    if quality == "audio" or fmt in ("mp3", "aac"):
        codec = "mp3" if fmt != "aac" else "aac"
        ydl_opts["format"] = "bestaudio/best"
        ydl_opts["merge_output_format"] = None
        ydl_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": codec,
            "preferredquality": "192",
        }]

    # Remove None values
    ydl_opts = {k: v for k, v in ydl_opts.items() if v is not None}

    result = {"filename": "", "filepath": "", "status": "error"}

    def progress_hook(d):
        status = d.get("status", "")
        if status == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            downloaded = d.get("downloaded_bytes", 0)
            percent = (downloaded / total * 100) if total > 0 else 0
            speed_bps = d.get("speed") or 0
            if speed_bps > 1_000_000:
                speed_str = f"{speed_bps / 1_000_000:.1f} MB/s"
            elif speed_bps > 1_000:
                speed_str = f"{speed_bps / 1_000:.1f} KB/s"
            else:
                speed_str = f"{speed_bps:.0f} B/s" if speed_bps else ""

            progress_callback({
                "download_id": download_id,
                "status": "downloading",
                "percent": round(percent, 1),
                "speed": speed_str,
                "eta": d.get("eta") or 0,
                "filename": os.path.basename(d.get("filename", "")),
                "total_bytes": total,
            })
        elif status == "finished":
            filepath = d.get("filename", "")
            result["filename"] = os.path.basename(filepath)
            result["filepath"] = filepath
            result["status"] = "finished"
            progress_callback({
                "download_id": download_id,
                "status": "finished",
                "percent": 100,
                "speed": "",
                "eta": 0,
                "filename": os.path.basename(filepath),
                "total_bytes": d.get("total_bytes") or 0,
            })

    ydl_opts["progress_hooks"] = [progress_hook]

    try:
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except (DownloadError, ExtractorError) as e:
        result["status"] = "error"
        result["error"] = str(e)
        progress_callback({
            "download_id": download_id,
            "status": "error",
            "percent": 0,
            "speed": "",
            "eta": 0,
            "filename": "",
            "total_bytes": 0,
        })
        return result

    # Find the actual output file (yt-dlp may change extension after merging/postprocessing)
    if not os.path.exists(result.get("filepath", "")):
        for f in os.listdir(DOWNLOADS_DIR):
            if f.startswith(download_id):
                result["filepath"] = os.path.join(DOWNLOADS_DIR, f)
                result["filename"] = f
                break

    return result
