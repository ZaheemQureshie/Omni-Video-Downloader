import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import YouTubeDownloader from './pages/YouTubeDownloader';
import InstagramDownloader from './pages/InstagramDownloader';
import TikTokDownloader from './pages/TikTokDownloader';
import FacebookDownloader from './pages/FacebookDownloader';
import SnapchatDownloader from './pages/SnapchatDownloader';
import History from './pages/History';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e38',
              color: '#e4e4f0',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/youtube" element={<PageTransition><YouTubeDownloader /></PageTransition>} />
              <Route path="/instagram" element={<PageTransition><InstagramDownloader /></PageTransition>} />
              <Route path="/tiktok" element={<PageTransition><TikTokDownloader /></PageTransition>} />
              <Route path="/facebook" element={<PageTransition><FacebookDownloader /></PageTransition>} />
              <Route path="/snapchat" element={<PageTransition><SnapchatDownloader /></PageTransition>} />
              <Route path="/history" element={<PageTransition><History /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
