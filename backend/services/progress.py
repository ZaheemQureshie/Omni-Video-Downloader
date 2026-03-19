import asyncio
import json
from fastapi import WebSocket
from typing import Dict, Set


class ConnectionManager:
    """Manages WebSocket connections for real-time progress updates."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, download_id: str, websocket: WebSocket):
        await websocket.accept()
        if download_id not in self.active_connections:
            self.active_connections[download_id] = set()
        self.active_connections[download_id].add(websocket)

    def disconnect(self, download_id: str, websocket: WebSocket):
        if download_id in self.active_connections:
            self.active_connections[download_id].discard(websocket)
            if not self.active_connections[download_id]:
                del self.active_connections[download_id]

    async def send_progress(self, download_id: str, data: dict):
        if download_id not in self.active_connections:
            return
        dead = set()
        for ws in self.active_connections[download_id]:
            try:
                await ws.send_json(data)
            except Exception:
                dead.add(ws)
        for ws in dead:
            self.active_connections[download_id].discard(ws)

    def has_connections(self, download_id: str) -> bool:
        return bool(self.active_connections.get(download_id))


manager = ConnectionManager()
