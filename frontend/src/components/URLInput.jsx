import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, Clipboard, Search, Loader2 } from 'lucide-react';

export default function URLInput({ onSubmit, loading, platformColor = 'indigo', platformIcon: PlatformIcon }) {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      inputRef.current?.focus();
    } catch {
      // Clipboard access denied
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-purple-600',
    cyan: 'from-cyan-400 to-teal-500',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-400 to-yellow-500',
  };

  const btnGradient = colorMap[platformColor] || colorMap.indigo;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3">
          {PlatformIcon ? (
            <PlatformIcon className="w-5 h-5 text-gray-400 shrink-0" />
          ) : (
            <Link2 className="w-5 h-5 text-gray-400 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-base py-3"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Paste from clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !url.trim()}
          className={`bg-gradient-to-r ${btnGradient} text-white font-semibold px-6 py-3 rounded-xl
            flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
            transition shadow-lg btn-glow min-w-[160px]`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Fetch Video Info
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
