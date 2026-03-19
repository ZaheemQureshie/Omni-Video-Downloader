import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import useWebSocket from '../hooks/useWebSocket';
import { useEffect } from 'react';

function DownloadItem({ download, onCancel, onProgress, platformColor }) {
  const { progress } = useWebSocket(
    ['pending', 'downloading'].includes(download.status) ? download.download_id : null
  );

  useEffect(() => {
    if (progress) {
      onProgress(download.download_id, progress);
    }
  }, [progress]);

  const statusText = {
    pending: 'Waiting...',
    downloading: `${download.progress?.toFixed(1) || 0}%`,
    finished: 'Complete',
    error: 'Failed',
    cancelled: 'Cancelled',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {download.title || download.filename || 'Starting download...'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{statusText[download.status] || download.status}</span>
            {download.speed && <span>{download.speed}</span>}
            {download.eta > 0 && <span>ETA: {download.eta}s</span>}
          </div>
          <div className="mt-2">
            <ProgressBar percent={download.progress || 0} color={platformColor} />
          </div>
        </div>

        {['pending', 'downloading'].includes(download.status) && (
          <button
            onClick={() => onCancel(download.download_id)}
            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function DownloadQueue({ downloads, onCancel, onProgress, platformColor = 'indigo' }) {
  const active = downloads.filter(d => ['pending', 'downloading'].includes(d.status));

  if (active.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Downloading ({active.length})
        </h3>
      </div>
      <div className="space-y-2">
        {active.map(dl => (
          <DownloadItem
            key={dl.download_id}
            download={dl}
            onCancel={onCancel}
            onProgress={onProgress}
            platformColor={platformColor}
          />
        ))}
      </div>
    </div>
  );
}
