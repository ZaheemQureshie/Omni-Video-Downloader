import { motion } from 'framer-motion';
import { Clock, User, Eye, Calendar, Play, Film } from 'lucide-react';

function Skeleton() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-72 h-44 bg-surface-3 rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-3/4 bg-surface-3 rounded" />
          <div className="h-4 w-1/2 bg-surface-3 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function VideoPreview({ info, loading }) {
  if (loading) return <Skeleton />;
  if (!info) return null;

  const badgeColors = {
    youtube: 'bg-red-500/20 text-red-400',
    instagram: 'bg-pink-500/20 text-pink-400',
    tiktok: 'bg-cyan-500/20 text-cyan-400',
    facebook: 'bg-blue-500/20 text-blue-400',
    snapchat: 'bg-yellow-500/20 text-yellow-300',
    other: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="relative w-full sm:w-72 shrink-0">
          {info.thumbnail ? (
            <img src={info.thumbnail} alt={info.title} className="w-full h-44 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-44 bg-surface-3 rounded-xl flex items-center justify-center">
              <Film className="w-10 h-10 text-gray-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-3">{info.title}</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
             {info.uploader && <span>{info.uploader}</span>}
             {info.duration_string && <span>{info.duration_string}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
