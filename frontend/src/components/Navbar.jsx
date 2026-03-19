import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Youtube, Instagram, Film, Facebook, Ghost,
  Download, History, Sun, Moon, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ activeDownloads = 0 }) {
  const location = useLocation();

  return (
    <nav className="glass-strong sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20"> {/* Reduced height slightly */}
          {/* Logo - Center for a clean look */}
          <div className="flex items-center justify-center w-full">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300 ring-2 ring-white/10 group-hover:ring-white/20">
                <Download className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter gradient-text">
                Omni Video Downloader +
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
