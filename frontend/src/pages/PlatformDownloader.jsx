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

export default function PlatformDownloader({ platformName, platformColor, platformIcon: PlatformIcon, accentGradient }) {
  const { videoInfo, loading, downloads, fetchInfo, download, updateProgress, cancelDl, saveFile, removeFromList, clearCompleted } = useDownload();
  const [quality, setQuality] = useState('best');
  const [format, setFormat] = useState('mp4');
  const [advancedOpts, setAdvancedOpts] = useState({ autoStart: false, filenamePrefix: '', playlistMode: false });

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 hero-gradient">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl sm:text-6xl font-black text-white text-center">
          {platformName} <span className="opacity-50">Omni Downloader +</span>
        </h1>
        <URLInput onSubmit={fetchInfo} loading={loading} platformColor={platformColor} platformIcon={PlatformIcon} />
        <VideoPreview info={videoInfo} loading={loading} />
        {videoInfo && (
          <div className="glass rounded-2xl p-5 space-y-5">
             <FormatSelector quality={quality} format={format} onQualityChange={setQuality} onFormatChange={setFormat} />
             <button onClick={() => download(document.querySelector('input')?.value, quality, format)} className="w-full bg-indigo-500 text-white font-bold py-3.5 rounded-xl">Download Now</button>
          </div>
        )}
        <DownloadQueue downloads={downloads} onCancel={cancelDl} onProgress={updateProgress} />
        <CompletedList downloads={downloads} onSave={saveFile} onRemove={removeFromList} onClearCompleted={clearCompleted} />
      </div>
    </div>
  );
}
