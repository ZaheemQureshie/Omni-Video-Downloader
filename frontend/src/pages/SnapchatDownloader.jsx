import { Ghost } from 'lucide-react';
import PlatformDownloader from './PlatformDownloader';

export default function SnapchatDownloader() {
  return (
    <PlatformDownloader
      platformName="Snapchat"
      platformColor="yellow"
      platformIcon={Ghost}
      accentGradient="from-yellow-400 to-yellow-600"
    />
  );
}
