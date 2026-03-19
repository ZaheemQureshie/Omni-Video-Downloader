import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
});

export async function fetchVideoInfo(url) {
  const { data } = await api.post('/info', { url });
  return data;
}

export async function startDownload({ url, quality, format, download_id }) {
  const { data } = await api.post('/download', { url, quality, format, download_id });
  return data;
}

export async function getDownloads() {
  const { data } = await api.get('/downloads');
  return data;
}

export async function getDownloadFile(downloadId) {
  const response = await api.get(`/download/${downloadId}/file`, {
    responseType: 'blob',
  });
  return response;
}

export async function cancelDownload(downloadId) {
  const { data } = await api.delete(`/download/${downloadId}`);
  return data;
}

export async function getHistory(params = {}) {
  const { data } = await api.get('/history', { params });
  return data;
}

export async function deleteHistoryItem(downloadId) {
  const { data } = await api.delete(`/history/${downloadId}`);
  return data;
}

export async function clearHistory() {
  const { data } = await api.delete('/history');
  return data;
}

export function getWebSocketURL(downloadId) {
  const wsBase = API_BASE
    ? API_BASE.replace(/^http/, 'ws')
    : `ws://${window.location.host}`;
  return `${wsBase}/ws/progress/${downloadId}`;
}

export default api;
