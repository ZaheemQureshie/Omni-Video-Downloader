import { Youtube } from 'lucide-react';
import PlatformDownloader from './PlatformDownloader';

export default function YouTubeDownloader() {
  return (
    <PlatformDownloader
      platformName="YouTube"
      platformColor="red"
      platformIcon={Youtube}
      accentGradient="from-red-500 to-red-700"
    />
  );
}
