#!/bin/bash

# Automated Local Backend Deployment with ngrok
# This script starts your backend and exposes it to the internet

echo "🚀 Starting Local Backend Deployment..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    brew install ngrok
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start ngrok
echo "🌐 Exposing backend with ngrok..."
echo ""
echo "⚠️  IMPORTANT: Copy the HTTPS URL that appears below!"
echo "   It will look like: https://abc123.ngrok.io"
echo ""
echo "📝 Then update docs/assets/js/config.js with:"
echo "   baseURL: 'https://YOUR-NGROK-URL/api'"
echo ""
echo "Press Ctrl+C to stop both backend and ngrok"
echo ""

# Start ngrok (this will block)
ngrok http 3000

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
