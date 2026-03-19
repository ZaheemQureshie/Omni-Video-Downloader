from fastapi import APIRouter, HTTPException
from schemas.download import InfoRequest, InfoResponse
from services.ytdlp_service import fetch_info

router = APIRouter(prefix="/api", tags=["info"])


@router.post("/info", response_model=InfoResponse)
async def get_video_info(request: InfoRequest):
    """Fetch video metadata and available formats without downloading."""
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        info = fetch_info(request.url.strip())
        return info
    except ValueError as e:
        raise HTTPException(status_code=400, detail={
            "error_code": "EXTRACTION_ERROR",
            "message": str(e),
            "suggestion": "Make sure the URL is valid and the video is publicly available."
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "error_code": "INTERNAL_ERROR",
            "message": f"Failed to fetch video info: {str(e)}",
            "suggestion": "Please try again later."
        })
