import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Film, Facebook, Ghost, Globe, Download, Zap, Shield, MonitorPlay, ArrowRight } from 'lucide-react';

const platforms = [
  { path: '/youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', text: 'text-red-400', desc: 'Videos, Shorts, Playlists' },
  { path: '/instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', text: 'text-pink-400', desc: 'Reels, Posts, Stories' },
  { path: '/tiktok', label: 'TikTok', icon: Film, color: 'from-cyan-400 to-teal-600', text: 'text-cyan-400', desc: 'Videos, Slideshows' },
  { path: '/facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700', text: 'text-blue-400', desc: 'Videos, Reels' },
  { path: '/snapchat', label: 'Snapchat', icon: Ghost, color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400', desc: 'Spotlight, Stories' },
  { path: '/youtube', label: 'Any Platform', icon: Globe, color: 'from-gray-500 to-gray-700', text: 'text-gray-400', desc: '1000+ Sites Supported' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="hero-gradient min-h-[85vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-10 tracking-tighter text-white">
            <span className="gradient-text">Download</span> anything.
          </h1>
          <p className="text-xl text-gray-400 mb-14">Download videos from every platform, effortlessly.</p>
          <Link to="/youtube" className="bg-white text-indigo-600 font-black px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all btn-glow text-lg">Start Now</Link>
        </motion.div>
      </section>
      {/* ... (Full Home content pushed) */}
    </div>
  );
}
