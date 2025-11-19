#!/bin/bash

echo "🧹 Clearing all caches..."

# Clear frontend cache
echo "🗑️  Clearing Vite cache..."
cd "BIDUA_Hosting-main"
rm -rf node_modules/.vite dist .vite 2>/dev/null
echo "✅ Vite cache cleared"

# Clear backend cache
echo "🗑️  Clearing Python cache..."
cd "../backend_template"
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
echo "✅ Python cache cleared"

# Kill existing servers
echo "🔄 Stopping existing servers..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:4333 | xargs kill -9 2>/dev/null
echo "✅ Servers stopped"

echo ""
echo "🎉 All caches cleared!"
echo ""
echo "To start servers:"
echo "  Backend:  cd backend_template && source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
echo "  Frontend: cd BIDUA_Hosting-main && npm run dev"
