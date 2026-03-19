# Omni Video Downloader + 🚀

> **Download videos from every platform, effortlessly.**

Omni Video Downloader + is a powerful, self-hosted, all-in-one media extraction tool. Built for the modern web, it provides a seamless and high-performance experience for downloading content from YouTube, Instagram, TikTok, Facebook, Snapchat, and over 1000+ other supported platforms—completely free and directly to your local machine.

![Omni Video Downloader + Interface](https://raw.githubusercontent.com/placeholder-path/screenshot.png) *(Note: Add your own screenshot here)*

## ✨ Key Features

- **Multi-Platform Support**: YouTube (Shorts, Playlists), Instagram (Reels), TikTok (Slideshows), Facebook, Snapchat, and more.
- **High-End Performance**: Powered by the industry-standard `yt-dlp` engine for maximum speed and reliability.
- **Crystal Clear Quality**: Download in up to 4K resolution with perfect audio-video synchronization.
- **Privacy First**: Everything runs locally on your machine. No accounts, no tracking, no cloud storage.
- **Premium UI/UX**: A beautiful, dark-themed interface built with React and Framer Motion for smooth micro-interactions.
- **Advanced Options**: Custom quality selection, audio extraction, and playlist support.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Engine**: [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **Database**: SQLite (for download history)

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (3.10+)
- [FFmpeg](https://ffmpeg.org/) (for high-quality merges)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/omni-video-downloader.git
   cd omni-video-downloader
   ```

2. **Run the automated setup & start script:**
   This script will install all dependencies for both frontend and backend and launch the services.
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Open the app:**
   Navigate to `http://localhost:5173` in your browser.

## 🧠 Core Logic

The application follows a modern decoupled architecture:
1. **Frontend**: Manages the state of active downloads and provides a real-time progress UI via WebSockets.
2. **Backend**: A FastAPI server that interfaces with `yt-dlp` to extract metadata and stream download events.
3. **Queue System**: Handles multiple concurrent downloads with real-time speed monitoring and ETA calculation.
4. **Auto-Cleanup**: A background task automatically removes temporary files to ensure your storage remains clean.

## 📜 License
This project is for educational purposes only. Please respect the terms of service of the platforms you download from.

---
Built with ❤️ for the open-web community.
