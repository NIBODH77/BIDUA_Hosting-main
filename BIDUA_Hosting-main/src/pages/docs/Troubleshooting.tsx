import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle, RefreshCw, Database } from 'lucide-react';

export function Troubleshooting() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <Link to="/" className="hover:text-cyan-500">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/docs" className="hover:text-cyan-500">Documentation</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Troubleshooting</span>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Troubleshooting Guide</h1>
        <p className="text-lg text-slate-600">
          Common issues and solutions for BIDUA Hosting development.
        </p>
      </div>

      {/* Cache Issues */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <RefreshCw className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Cache & Stale UI Issues</h2>
            <p className="text-slate-600 mb-4">
              If you need to hard reload every time to see changes, or the UI shows old content:
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">Solution 1: Clear Cache Script</h3>
              <p className="text-sm text-slate-600 mb-3">
                Use the built-in cache clearing script to remove all cached files:
              </p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <div className="mb-2"># From frontend directory:</div>
                <div>npm run dev:fresh</div>
                <div className="mt-2"># Or use the shell script:</div>
                <div>./clear-cache.sh</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">Solution 2: Manual Cache Clearing</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <div># Stop all servers</div>
                <div className="mb-2">lsof -ti:4333 | xargs kill -9 2&gt;/dev/null</div>
                <div className="mb-2">lsof -ti:8000 | xargs kill -9 2&gt;/dev/null</div>
                <div className="mt-3"># Clear Vite cache</div>
                <div className="mb-2">rm -rf .vite node_modules/.vite dist</div>
                <div className="mt-3"># Restart dev server</div>
                <div>npm run dev</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Prevention: Updated vite.config.ts</h3>
              <p className="text-sm text-blue-800">
                The vite.config.ts has been updated with force: true for better HMR (Hot Module Replacement) and automatic cache clearing during development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Offline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <Database className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Backend Server Offline</h2>
            <p className="text-slate-600 mb-4">
              If you see "Failed to fetch" errors or "Backend Server Offline" banner:
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">Check Backend Status</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <div className="mb-2"># Check if backend is running on port 8000:</div>
                <div>lsof -i :8000</div>
                <div className="mt-3"># Or try to ping health endpoint:</div>
                <div>curl http://localhost:8000/api/v1/health</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">Start Backend Server</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                <div className="mb-2">cd backend_template</div>
                <div className="mb-2">source venv/bin/activate</div>
                <div>uvicorn app.main:app --reload --port 8000</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">New Feature: Backend Status Banner</h3>
              <p className="text-sm text-green-800 mb-2">
                The app now includes a live backend status banner that:
              </p>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Automatically detects when backend is offline</li>
                <li>Shows a warning banner at the top of the page</li>
                <li>Provides a "Retry" button to check connection</li>
                <li>Checks status every 10 seconds automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Error Boundaries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-purple-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Boundaries & Crash Recovery</h2>
            <p className="text-slate-600 mb-4">
              The app now includes error boundaries to gracefully handle unexpected crashes:
            </p>

            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Features</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">✓</span>
                  <span>Catches JavaScript errors anywhere in the app</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">✓</span>
                  <span>Shows user-friendly error page instead of blank screen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">✓</span>
                  <span>Provides "Reload Page" button for easy recovery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">✓</span>
                  <span>Shows detailed error stack in development mode</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Issues & Solutions</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-cyan-500 pl-4">
            <h3 className="font-semibold text-slate-900 mb-1">Port Already in Use</h3>
            <p className="text-sm text-slate-600 mb-2">Error: "Address already in use ::4333" or "::8000"</p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400">
              <div># Kill process on port 4333 (frontend):</div>
              <div className="mb-2">lsof -ti:4333 | xargs kill -9</div>
              <div># Kill process on port 8000 (backend):</div>
              <div>lsof -ti:8000 | xargs kill -9</div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-slate-900 mb-1">Database Connection Failed</h3>
            <p className="text-sm text-slate-600 mb-2">Check PostgreSQL is running and credentials are correct</p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400">
              <div># Check PostgreSQL status (macOS):</div>
              <div className="mb-2">brew services list | grep postgresql</div>
              <div># Start PostgreSQL:</div>
              <div>brew services start postgresql@14</div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-slate-900 mb-1">Module Not Found Errors</h3>
            <p className="text-sm text-slate-600 mb-2">Missing dependencies or corrupted node_modules</p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400">
              <div># Reinstall dependencies:</div>
              <div className="mb-2">rm -rf node_modules package-lock.json</div>
              <div>npm install</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Quick Reference Commands</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Frontend</h3>
            <div className="space-y-2 text-sm font-mono bg-cyan-900/30 rounded p-3">
              <div>npm run dev</div>
              <div>npm run dev:fresh</div>
              <div>npm run build</div>
              <div>npm run preview</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Backend</h3>
            <div className="space-y-2 text-sm font-mono bg-cyan-900/30 rounded p-3">
              <div>uvicorn app.main:app --reload</div>
              <div>alembic upgrade head</div>
              <div>python seed_all_pricing.py</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
