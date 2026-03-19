import { useState, useCallback } from 'react';
import { fetchVideoInfo, startDownload, cancelDownload as apiCancel, getDownloadFile } from '../services/api';
import toast from 'react-hot-toast';

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function useDownload() {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState([]);

  const fetchInfo = useCallback(async (url) => {
    setLoading(true);
    setVideoInfo(null);
    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
      toast.success('Video info fetched!');
      return info;
    } catch (err) {
      const msg = err.response?.data?.detail?.message || err.response?.data?.detail || 'Failed to fetch video info';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(async (url, quality = 'best', format = 'mp4') => {
    const downloadId = generateId();
    const newDl = {
      download_id: downloadId,
      url,
      quality,
      format,
      status: 'pending',
      progress: 0,
      speed: '',
      eta: 0,
      title: videoInfo?.title || 'Unknown',
    };
    setDownloads(prev => [newDl, ...prev]);

    try {
      await startDownload({ url, quality, format, download_id: downloadId });
      setDownloads(prev =>
        prev.map(d => d.download_id === downloadId ? { ...d, status: 'downloading' } : d)
      );
      toast.success('Download started!');
      return downloadId;
    } catch (err) {
      setDownloads(prev =>
        prev.map(d => d.download_id === downloadId ? { ...d, status: 'error' } : d)
      );
      toast.error('Failed to start download');
      throw err;
    }
  }, [videoInfo]);

  const updateProgress = useCallback((downloadId, data) => {
    setDownloads(prev =>
      prev.map(d => {
        if (d.download_id !== downloadId) return d;
        return {
          ...d,
          status: data.status,
          progress: data.percent,
          speed: data.speed,
          eta: data.eta,
          filename: data.filename || d.filename,
          title: data.filename?.replace(/^[^_]+_/, '').replace(/\.[^.]+$/, '') || d.title,
        };
      })
    );
  }, []);

  const cancelDl = useCallback(async (downloadId) => {
    try {
      await apiCancel(downloadId);
      setDownloads(prev =>
        prev.map(d => d.download_id === downloadId ? { ...d, status: 'cancelled' } : d)
      );
      toast.success('Download cancelled');
    } catch {
      toast.error('Failed to cancel download');
    }
  }, []);

  const saveFile = useCallback(async (downloadId, filename) => {
    try {
      const response = await getDownloadFile(downloadId);
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      toast.success('File saved!');
    } catch {
      toast.error('Failed to download file');
    }
  }, []);

  const removeFromList = useCallback((downloadId) => {
    setDownloads(prev => prev.filter(d => d.download_id !== downloadId));
  }, []);

  const clearCompleted = useCallback(() => {
    setDownloads(prev => prev.filter(d => !['finished', 'error', 'cancelled'].includes(d.status)));
  }, []);

  return {
    videoInfo,
    loading,
    downloads,
    fetchInfo,
    download,
    updateProgress,
    cancelDl,
    saveFile,
    removeFromList,
    clearCompleted,
    setVideoInfo,
  };
}
