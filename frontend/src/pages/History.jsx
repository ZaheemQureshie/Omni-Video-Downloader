import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History as HistoryIcon, Search, Trash2, Download,
  CheckCircle2, XCircle, Clock, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getHistory, deleteHistoryItem, clearHistory, getDownloadFile } from '../services/api';
import toast from 'react-hot-toast';

function formatSize(bytes) {
  if (!bytes) return '-';
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

const statusIcon = {
  finished: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
  downloading: <Clock className="w-4 h-4 text-yellow-400 animate-spin" />,
  pending: <Clock className="w-4 h-4 text-gray-400" />,
  cancelled: <XCircle className="w-4 h-4 text-yellow-400" />,
};

export default function History() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory({ search, platform, page, per_page: 15 });
      setItems(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, [page, search, platform]);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success('Removed');
      loadHistory();
    } catch { toast.error('Failed to delete'); }
  };

  const handleClear = async () => {
    if (!confirm('Clear all download history?')) return;
    try {
      await clearHistory();
      toast.success('History cleared');
      loadHistory();
    } catch { toast.error('Failed to clear'); }
  };

  const handleSave = async (id, filename) => {
    try {
      const response = await getDownloadFile(id);
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch { toast.error('File not available'); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 hero-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-6xl font-black text-white mb-3 tracking-tighter"
            >
              Download <span className="gradient-text">History</span>
            </motion.h1>
            <p className="text-gray-400 text-lg font-medium">
              Manage and access your downloaded videos
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search downloads..."
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-600"
            />
          </div>
          <select
            value={platform}
            onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
            className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
          >
            <option value="">All platforms</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="snapchat">Snapchat</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <HistoryIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No downloads yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.download_id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-xl p-4 flex items-center gap-3"
                >
                  {statusIcon[item.status] || statusIcon.pending}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:block px-2 py-1 rounded-full bg-white/5 capitalize">
                    {item.platform}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">{formatSize(item.filesize)}</span>
                  <div className="flex gap-1">
                    {item.status === 'finished' && (
                      <button onClick={() => handleSave(item.download_id, item.filename)}
                        className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.download_id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-2 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
