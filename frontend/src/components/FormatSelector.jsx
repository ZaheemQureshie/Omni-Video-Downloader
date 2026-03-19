import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';

const QUALITY_OPTIONS = [
  { value: 'best', label: 'Best Quality' },
  { value: '1080p', label: '1080p HD' },
  { value: '720p', label: '720p HD' },
  { value: '480p', label: '480p SD' },
  { value: '360p', label: '360p' },
  { value: 'audio', label: '🎵 Audio Only' },
];

const FORMAT_OPTIONS = [
  { value: 'mp4', label: 'MP4' },
  { value: 'webm', label: 'WebM' },
  { value: 'mkv', label: 'MKV' },
  { value: 'mp3', label: 'MP3 (Audio)' },
  { value: 'aac', label: 'AAC (Audio)' },
];

export default function FormatSelector({ quality, format, onQualityChange, onFormatChange, platformColor = 'indigo' }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          <Settings2 className="w-3.5 h-3.5 inline mr-1" />
          Quality
        </label>
        <select
          value={quality}
          onChange={(e) => onQualityChange(e.target.value)}
          className="w-full glass rounded-xl px-4 py-2.5 bg-transparent text-white outline-none
            focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        >
          {QUALITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#16162a] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Format
        </label>
        <select
          value={format}
          onChange={(e) => onFormatChange(e.target.value)}
          className="w-full glass rounded-xl px-4 py-2.5 bg-transparent text-white outline-none
            focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        >
          {FORMAT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#16162a] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
