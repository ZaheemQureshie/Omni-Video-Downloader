import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Youtube, Instagram, Film, Facebook, Ghost, Globe,
  Download, Zap, Shield, MonitorPlay, ArrowRight
} from 'lucide-react';

const platforms = [
  { path: '/youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', text: 'text-red-400', desc: 'Videos, Shorts, Playlists, Live' },
  { path: '/instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', text: 'text-pink-400', desc: 'Reels, Posts, Stories' },
  { path: '/tiktok', label: 'TikTok', icon: Film, color: 'from-cyan-400 to-teal-600', text: 'text-cyan-400', desc: 'Videos, Slideshows' },
  { path: '/facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700', text: 'text-blue-400', desc: 'Videos, Reels, Watch' },
  { path: '/snapchat', label: 'Snapchat', icon: Ghost, color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400', desc: 'Spotlight, Public Stories' },
  { path: '/youtube', label: 'Any Platform', icon: Globe, color: 'from-gray-500 to-gray-700', text: 'text-gray-400', desc: '1000+ Sites Supported' },
];

const features = [
  { icon: Globe, title: '1000+ Sites', desc: 'Download from YouTube, Instagram, TikTok, and hundreds more' },
  { icon: MonitorPlay, title: 'HD Quality', desc: 'Up to 4K resolution with perfect audio sync' },
  { icon: Zap, title: 'Fast Downloads', desc: 'Optimized download speeds with real-time progress' },
  { icon: Shield, title: 'No Registration', desc: 'Start downloading instantly, no signup required' },
];

const steps = [
  { num: '01', title: 'Paste URL', desc: 'Copy any video link and paste it into the input field' },
  { num: '02', title: 'Choose Quality', desc: 'Select your preferred resolution and output format' },
  { num: '03', title: 'Download', desc: 'Hit download and save the video to your device' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient min-h-[85vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-bold mb-10 border border-indigo-500/20 shadow-xl shadow-indigo-500/10 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 fill-indigo-400/20" />
            <span className="tracking-widest uppercase">Powered by yt-dlp engine</span>
          </motion.div>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter text-white">
            <span className="gradient-text drop-shadow-2xl">Download</span>
            <br />
            <span className="opacity-90">anything.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Download videos from every platform, effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              to="/youtube"
              className="inline-flex items-center gap-3 bg-white text-indigo-600 font-black px-12 py-5 rounded-2xl shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300 btn-glow text-lg"
            >
              <Download className="w-6 h-6" />
              <span>Start Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 text-gray-500 text-sm font-bold uppercase tracking-widest">
              <Shield className="w-5 h-5 text-indigo-500/50" />
              <span>No signup required</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Platform Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {platforms.map((p) => (
            <motion.div key={p.label} variants={item}>
              <Link
                to={p.path}
                className="platform-card block glass rounded-2xl p-5 sm:p-6 text-center group h-full flex flex-col items-center justify-center hover:bg-white/5"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-${p.text.split('-')[1]}-500/20`}>
                  <p.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`font-bold text-sm sm:text-base ${p.text}`}>{p.label}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 max-w-[120px]">{p.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-white mb-4"
          >
            Why choose <span className="gradient-text">Omni Video Downloader +</span>?
          </motion.h2>
          <p className="text-gray-500 max-w-lg">
            Experience the most powerful video downloader on the web with premium features unlocked for everyone.
          </p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass rounded-3xl p-8 text-center hover:border-indigo-500/40 transition-all duration-300 group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <f.icon className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 pb-24 sm:pb-32">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-16"
        >
          How it works
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-10 md:gap-16 relative"
        >
          {steps.map((s, idx) => (
            <motion.div key={s.num} variants={item} className="text-center group relative">
              <div className="text-5xl font-black gradient-text mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{s.num}</div>
              <h3 className="font-bold text-white text-xl mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 px-4">{s.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute top-6 -right-8 md:-right-12 w-8 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Download className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black tracking-tight text-white uppercase text-sm">Omni Video Downloader +</span>
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-[0.2em] font-bold">
            Powered by yt-dlp engine — For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
