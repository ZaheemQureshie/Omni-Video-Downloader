import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import URLInput from '../components/URLInput';
import VideoPreview from '../components/VideoPreview';
import FormatSelector from '../components/FormatSelector';
import DownloadQueue from '../components/DownloadQueue';
import CompletedList from '../components/CompletedList';
import AdvancedOptions from '../components/AdvancedOptions';
import useDownload from '../hooks/useDownload';

export default function PlatformDownloader({
  platformName,
  platformColor,
  platformIcon: PlatformIcon,
  accentGradient,
}) {
  const {
    videoInfo, loading, downloads,
    fetchInfo, download, updateProgress,
    cancelDl, saveFile, removeFromList, clearCompleted,
  } = useDownload();

  const [quality, setQuality] = useState('best');
  const [format, setFormat] = useState('mp4');
  const [advancedOpts, setAdvancedOpts] = useState({
    autoStart: false,
    filenamePrefix: '',
    playlistMode: false,
  });

  const handleFetch = async (url) => {
    await fetchInfo(url);
  };

  const handleDownload = async () => {
    if (!videoInfo) return;
    const url = document.querySelector('input[type="url"]')?.value;
    if (url) {
      await download(url, quality, format);
    }
  };

  const colorMap = {
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-purple-600',
    cyan: 'from-cyan-400 to-teal-500',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-400 to-yellow-500',
    indigo: 'from-indigo-500 to-purple-600',
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 overflow-hidden hero-gradient">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${accentGradient || colorMap[platformColor] || colorMap.indigo} mb-6 shadow-2xl ring-4 ring-white/5`}>
            {PlatformIcon && <PlatformIcon className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter">
            {platformName} <span className="opacity-50 font-medium">Omni Downloader +</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            High-speed video extraction for {platformName}
          </p>
        </motion.div>


        {/* URL Input */}
        <URLInput
          onSubmit={handleFetch}
          loading={loading}
          platformColor={platformColor}
          platformIcon={PlatformIcon}
        />

        {/* Video Preview */}
        <VideoPreview info={videoInfo} loading={loading} />

        {/* Download Controls */}
        {videoInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 space-y-5"
          >
            <FormatSelector
              quality={quality}
              format={format}
              onQualityChange={setQuality}
              onFormatChange={setFormat}
              platformColor={platformColor}
            />

            <AdvancedOptions options={advancedOpts} onChange={setAdvancedOpts} />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className={`w-full bg-gradient-to-r ${colorMap[platformColor] || colorMap.indigo} text-white font-bold py-3.5 rounded-xl
                flex items-center justify-center gap-2 shadow-lg btn-glow text-lg`}
            >
              <Download className="w-5 h-5" />
              Download Now
            </motion.button>
          </motion.div>
        )}

        {/* Download Queue */}
        <DownloadQueue
          downloads={downloads}
          onCancel={cancelDl}
          onProgress={updateProgress}
          platformColor={platformColor}
        />

        {/* Completed List */}
        <CompletedList
          downloads={downloads}
          onSave={saveFile}
          onRemove={removeFromList}
          onClearCompleted={clearCompleted}
          platformColor={platformColor}
        />
      </div>
    </div>
  );
}
