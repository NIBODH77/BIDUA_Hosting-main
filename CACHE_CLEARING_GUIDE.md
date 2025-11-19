# 🧹 Cache Clearing Guide

## Quick Cache Clear

Run this command from the project root:
```bash
./clear_cache.sh
```

This will:
- ✅ Clear Vite cache (`.vite`, `node_modules/.vite`, `dist`)
- ✅ Clear Python cache (`__pycache__`, `*.pyc`)
- ✅ Stop all running servers

---

## Manual Cache Clearing

### Frontend (Vite) Cache
```bash
cd BIDUA_Hosting-main
rm -rf node_modules/.vite dist .vite
```

### Backend (Python) Cache
```bash
cd backend_template
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
```

### Browser Cache
- **Chrome/Edge**: `Cmd+Shift+Delete` → Clear browsing data
- **Or just**: `Cmd+Shift+R` (Hard reload)
- **Or**: Open DevTools → Right-click refresh → "Empty Cache and Hard Reload"

---

## Auto-Reload Features (Already Configured)

### ✅ Backend Auto-Reload
- FastAPI uses `--reload` flag
- Automatically detects Python file changes
- No cache headers added via middleware

### ✅ Frontend Auto-Reload
- Vite HMR (Hot Module Replacement) enabled
- File watching with polling enabled
- No cache headers in HTML

### ✅ Browser Cache Disabled
- HTTP headers: `Cache-Control: no-cache, no-store, must-revalidate`
- Backend middleware sends no-cache headers
- HTML meta tags prevent browser caching

---

## Starting Servers

### Backend
```bash
cd backend_template
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd BIDUA_Hosting-main
npm run dev
```

---

## If You Still Need Hard Reload

### In Browser:
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### Or Use DevTools:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

## Troubleshooting

### Changes Not Showing Up?

1. **Clear cache**: `./clear_cache.sh`
2. **Hard reload browser**: `Cmd+Shift+R`
3. **Restart servers**:
   ```bash
   # Kill processes
   lsof -ti:8000 | xargs kill -9
   lsof -ti:4333 | xargs kill -9
   
   # Restart both servers
   ```

### Port Already in Use?
```bash
# Kill specific port
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:4333 | xargs kill -9  # Frontend
```

---

## What's Been Configured

✅ **Vite Config** (`vite.config.ts`):
- HMR enabled
- File watching with polling
- Cache directory configured

✅ **Backend** (`app/main.py`):
- No-cache middleware added
- Sends cache-control headers on all responses

✅ **HTML** (`index.html`):
- Meta tags prevent browser caching
- Only for development (remove in production!)

✅ **Cache Clear Script** (`clear_cache.sh`):
- One-command cache clearing
- Stops servers automatically

---

## Production Notes

⚠️ **Before deploying to production:**
1. Remove no-cache meta tags from `index.html`
2. Consider disabling `NoCacheMiddleware` in `app/main.py`
3. Enable proper caching for static assets
4. Use CDN with appropriate cache headers

---

**Your servers should now auto-reload without needing hard refresh! 🎉**
