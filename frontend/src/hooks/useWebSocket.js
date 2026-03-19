import { useState, useEffect, useRef, useCallback } from 'react';
import { getWebSocketURL } from '../services/api';

export default function useWebSocket(downloadId) {
  const [progress, setProgress] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (!downloadId) return;
    try {
      const ws = new WebSocket(getWebSocketURL(downloadId));
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setProgress(data);
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        // Auto-reconnect after 2s unless status is terminal
        reconnectTimer.current = setTimeout(() => {
          connect();
        }, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {}
  }, [downloadId]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { progress, connected };
}
