#!/bin/bash

# Navigate to project root
cd "$(dirname "$0")"

# Print status helper
echo "🚀 Starting Video Downloader Services..."

# Ensure dependencies are installed if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --prefix frontend
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies (concurrently)..."
    npm install
fi

# Start services using the root package.json script
npm run dev
