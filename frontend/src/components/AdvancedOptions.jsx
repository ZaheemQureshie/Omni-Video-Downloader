import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings } from 'lucide-react';

export default function AdvancedOptions({ options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        <Settings className="w-4 h-4" />
        Advanced Options
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-4 mt-3 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Auto-start download</span>
                <div
                  onClick={() => onChange({ ...options, autoStart: !options.autoStart })}
                  className={`w-10 h-5 rounded-full transition flex items-center px-0.5 cursor-pointer ${
                    options.autoStart ? 'bg-indigo-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full"
                    animate={{ x: options.autoStart ? 20 : 0 }}
                  />
                </div>
              </label>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Custom filename prefix</label>
                <input
                  type="text"
                  value={options.filenamePrefix || ''}
                  onChange={(e) => onChange({ ...options, filenamePrefix: e.target.value })}
                  placeholder="e.g., my_video_"
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Playlist mode (download all)</span>
                <div
                  onClick={() => onChange({ ...options, playlistMode: !options.playlistMode })}
                  className={`w-10 h-5 rounded-full transition flex items-center px-0.5 cursor-pointer ${
                    options.playlistMode ? 'bg-indigo-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full"
                    animate={{ x: options.playlistMode ? 20 : 0 }}
                  />
                </div>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
