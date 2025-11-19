#!/bin/bash

# BIDUA Hosting - Clear Cache & Restart Dev Server
# This script clears all caches and restarts the development server

echo "🧹 Clearing BIDUA Hosting caches..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Stop any running servers
echo "📡 Stopping servers..."
lsof -ti:4333 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
sleep 1

# Clear Vite cache
echo "🗑️  Clearing Vite cache..."
rm -rf .vite
rm -rf node_modules/.vite

# Clear browser cache files
echo "🗑️  Clearing build artifacts..."
rm -rf dist

# Clear npm cache (optional - uncomment if needed)
# npm cache clean --force

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting fresh development server..."
npm run dev

