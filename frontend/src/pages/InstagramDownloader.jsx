import { Instagram } from 'lucide-react';
import PlatformDownloader from './PlatformDownloader';

export default function InstagramDownloader() {
  return (
    <PlatformDownloader
      platformName="Instagram"
      platformColor="pink"
      platformIcon={Instagram}
      accentGradient="from-pink-500 to-purple-600"
    />
  );
}
