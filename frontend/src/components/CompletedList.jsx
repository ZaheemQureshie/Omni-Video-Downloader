import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, RotateCcw, CheckCircle2, XCircle, Ban } from 'lucide-react';

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

const statusConfig = {
  finished: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  cancelled: { icon: Ban, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function CompletedList({ downloads, onSave, onRemove, onRetry, onClearCompleted, platformColor }) {
  const completed = downloads.filter(d => ['finished', 'error', 'cancelled'].includes(d.status));

  if (completed.length === 0) return null;

  const finishedCount = completed.filter(d => d.status === 'finished').length;
  const failedCount = completed.filter(d => d.status === 'error').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Completed ({completed.length})
        </h3>
        <div className="flex gap-2">
          {failedCount > 0 && (
            <button
              onClick={() => completed.filter(d => d.status === 'error').forEach(d => onRetry?.(d))}
              className="text-xs px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
            >
              Retry Failed
            </button>
          )}
          <button
            onClick={onClearCompleted}
            className="text-xs px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {completed.map(dl => {
            const cfg = statusConfig[dl.status] || statusConfig.finished;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={dl.download_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`glass rounded-xl p-4 ${cfg.bg}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${cfg.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {dl.title || dl.filename || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {dl.status === 'finished' && formatSize(dl.filesize)}
                      {dl.status === 'error' && (dl.error_message || 'Download failed')}
                      {dl.status === 'cancelled' && 'Cancelled by user'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {dl.status === 'finished' && (
                      <button
                        onClick={() => onSave(dl.download_id, dl.filename)}
                        className="p-2 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition"
                        title="Download to your device"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {dl.status === 'error' && (
                      <button
                        onClick={() => onRetry?.(dl)}
                        className="p-2 rounded-lg hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 transition"
                        title="Retry"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onRemove(dl.download_id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
