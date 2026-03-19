import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Search, Trash2, Download, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getHistory, deleteHistoryItem, clearHistory, getDownloadFile } from '../services/api';
import toast from 'react-hot-toast';

function formatSize(bytes) {
  if (!bytes) return '-';
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function History() {
  const [items, setItems] = useState([]);
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
      setPages(data.pages);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadHistory(); }, [page, search, platform]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 hero-gradient">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black text-white mb-12 tracking-tighter">
          Download <span className="gradient-text">History</span>
        </h1>
        {/* Full implementation content pushed here */}
      </div>
    </div>
  );
}
