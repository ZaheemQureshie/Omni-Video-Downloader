import { Film } from 'lucide-react';
import PlatformDownloader from './PlatformDownloader';

export default function TikTokDownloader() {
  return (
    <PlatformDownloader
      platformName="TikTok"
      platformColor="cyan"
      platformIcon={Film}
      accentGradient="from-cyan-400 to-teal-600"
    />
  );
}
