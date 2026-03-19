import { motion } from 'framer-motion';
import { Clock, User, Eye, Calendar, Play, Film } from 'lucide-react';

function Skeleton() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="skeleton w-full sm:w-72 h-44 rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="flex gap-4 mt-4">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
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

  const formatViews = (n) => {
    if (!n) return '';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-72 shrink-0">
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              className="w-full h-44 object-cover rounded-xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-44 bg-surface-3 rounded-xl flex items-center justify-center">
              <Film className="w-10 h-10 text-gray-600" />
            </div>
          )}
          {info.duration_string && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <Play className="w-3 h-3" />
              {info.duration_string}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${badgeColors[info.platform] || badgeColors.other}`}>
              {info.platform}
            </span>
            {info.is_playlist && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                Playlist {info.playlist_count ? `• ${info.playlist_count} videos` : ''}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-3">
            {info.title}
          </h3>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
            {info.uploader && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {info.uploader}
              </span>
            )}
            {info.view_count !== null && info.view_count !== undefined && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {formatViews(info.view_count)} views
              </span>
            )}
            {info.upload_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {info.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
              </span>
            )}
            {info.duration_string && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {info.duration_string}
              </span>
            )}
          </div>

          {info.description && (
            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
              {info.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
