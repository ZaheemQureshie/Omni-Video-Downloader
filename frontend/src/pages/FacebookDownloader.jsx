import { Facebook } from 'lucide-react';
import PlatformDownloader from './PlatformDownloader';

export default function FacebookDownloader() {
  return (
    <PlatformDownloader
      platformName="Facebook"
      platformColor="blue"
      platformIcon={Facebook}
      accentGradient="from-blue-500 to-blue-700"
    />
  );
}
