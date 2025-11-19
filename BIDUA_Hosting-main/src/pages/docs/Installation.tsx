import { DocLayout } from '../../components/docs/DocLayout';
import { Terminal, Database, GitBranch, Package, Check, AlertCircle } from 'lucide-react';

export function Installation() {
  return (
    <DocLayout
      title="Installation Guide"
      description="Complete step-by-step installation instructions for BIDUA Hosting platform."
      breadcrumbs={[{ label: 'Getting Started' }, { label: 'Installation' }]}
      prevPage={{ title: 'Quick Start', path: '/docs/quick-start' }}
      nextPage={{ title: 'Architecture', path: '/docs/architecture' }}
    >
      <div className="space-y-8">
        {/* System Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">System Requirements</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Minimum Requirements</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>4GB RAM</strong> for development, 16GB+ recommended for production</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>20GB free disk space</strong> minimum</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>Linux, macOS, or Windows</strong> with WSL2 for Windows</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Software Requirements</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>Node.js 18.x or higher</strong> with npm or yarn</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>Python 3.11 or higher</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>PostgreSQL 14 or higher</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-3">•</span>
                  <span><strong>Git</strong> for version control</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clone Repository */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <GitBranch className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Clone Repository</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Clone the Main Repository</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">git clone https://github.com/biduatech/bidua-hosting.git</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Navigate to Project Directory</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">cd bidua-hosting</code>
              </div>
            </div>
          </div>
        </section>

        {/* Backend Installation */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Backend Installation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Setup Python Virtual Environment</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-3">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Navigate to backend:</div>
                  <code className="text-green-400 block">cd backend_template</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Create virtual environment:</div>
                  <code className="text-green-400 block">python3 -m venv venv</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Activate virtual environment (macOS/Linux):</div>
                  <code className="text-green-400 block">source venv/bin/activate</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Activate virtual environment (Windows):</div>
                  <code className="text-green-400 block">venv\Scripts\activate</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Install Python Dependencies</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">pip install -r requirements.txt</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">This installs FastAPI, SQLAlchemy, Alembic, and all dependencies</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Configure Environment Variables</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-3">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Copy example configuration:</div>
                  <code className="text-green-400 block">cp .env.example .env</code>
                </div>
              </div>
              <p className="text-slate-600 mt-2 text-sm">Edit <code className="bg-slate-100 px-2 py-1 rounded">.env</code> with your settings:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mt-2">
                <pre className="text-green-400 text-sm font-mono">{`# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/bidua_hosting

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Razorpay Payment Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# API Configuration
API_V1_STR=/api/v1
DEBUG=True
VERSION=1.0.0`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Initialize Database</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-3">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Create database (if not exists):</div>
                  <code className="text-green-400 block">createdb bidua_hosting</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Run database migrations:</div>
                  <code className="text-green-400 block">alembic upgrade head</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Seed initial data:</div>
                  <code className="text-green-400 block">python seed_countries.py</code>
                </div>
                <div>
                  <code className="text-green-400 block">python seed_pricing_data.py</code>
                </div>
                <div>
                  <code className="text-green-400 block">python seed_addons_data.py</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Start Backend Server</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">uvicorn app.main:app --reload --host 0.0.0.0 --port 8000</code>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                <p className="text-green-800 flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Backend running at <code className="bg-green-100 px-2 py-1 rounded ml-1">http://localhost:8000</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frontend Installation */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Frontend Installation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Navigate to Frontend Directory</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">cd BIDUA_Hosting-main</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Install Node Dependencies</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-2">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Using npm:</div>
                  <code className="text-green-400 block">npm install</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Or using yarn:</div>
                  <code className="text-green-400 block">yarn install</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Configure Environment (Optional)</h3>
              <p className="text-slate-600 mb-2 text-sm">Create <code className="bg-slate-100 px-2 py-1 rounded">.env</code> for custom API URL:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">{`VITE_API_URL=http://localhost:8000
VITE_APP_NAME=BIDUA Hosting
VITE_APP_VERSION=1.0.0`}</pre>
              </div>
              <p className="text-slate-600 mt-2 text-sm">If not configured, defaults to backend at <code className="bg-slate-100 px-2 py-1 rounded">localhost:8000</code></p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Start Development Server</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-2">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Using npm:</div>
                  <code className="text-green-400 block">npm run dev</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Or using yarn:</div>
                  <code className="text-green-400 block">yarn dev</code>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-blue-800 flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Frontend running at <code className="bg-blue-100 px-2 py-1 rounded ml-1">http://localhost:4333</code>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Build for Production</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-2">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Build the project:</div>
                  <code className="text-green-400 block">npm run build</code>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Preview production build:</div>
                  <code className="text-green-400 block">npm run preview</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Terminal className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verify Installation</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Backend API Documentation</h3>
              <p className="text-slate-700 mb-3">Visit the interactive API documentation:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">http://localhost:8000/swagger</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">You should see the Scalar API documentation with all endpoints</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Health Check</h3>
              <p className="text-slate-700 mb-3">Verify backend is running:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">curl http://localhost:8000/health</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">Should return a JSON response with status: healthy</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Frontend Access</h3>
              <p className="text-slate-700 mb-3">Open in your browser:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">http://localhost:4333</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">You should see the BIDUA Hosting homepage</p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Database Connection Error
              </h3>
              <p className="text-yellow-800 mb-2">If you see connection errors:</p>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Ensure PostgreSQL is running: <code className="bg-yellow-100 px-2 py-1 rounded">brew services start postgresql</code></li>
                <li>• Verify DATABASE_URL in .env matches your PostgreSQL credentials</li>
                <li>• Check database exists: <code className="bg-yellow-100 px-2 py-1 rounded">psql -l</code></li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Port Already in Use
              </h3>
              <p className="text-yellow-800 mb-2">If port 8000 or 4333 is already in use:</p>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Find process: <code className="bg-yellow-100 px-2 py-1 rounded">lsof -i :8000</code></li>
                <li>• Kill process: <code className="bg-yellow-100 px-2 py-1 rounded">kill -9 PID</code></li>
                <li>• Or use different port: <code className="bg-yellow-100 px-2 py-1 rounded">--port 9000</code></li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Dependencies Installation Issues
              </h3>
              <p className="text-yellow-800 mb-2">If dependencies fail to install:</p>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Clear pip cache: <code className="bg-yellow-100 px-2 py-1 rounded">pip cache purge</code></li>
                <li>• Update pip: <code className="bg-yellow-100 px-2 py-1 rounded">pip install --upgrade pip</code></li>
                <li>• Clear npm cache: <code className="bg-yellow-100 px-2 py-1 rounded">npm cache clean --force</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Installation Complete!</h2>
          <p className="text-slate-700 mb-6">
            Your BIDUA Hosting platform is now installed and running. Continue exploring the documentation to understand the architecture and API.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/architecture"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Architecture Overview →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
