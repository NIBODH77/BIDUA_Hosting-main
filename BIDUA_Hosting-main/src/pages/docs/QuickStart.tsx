import { DocLayout } from '../../components/docs/DocLayout';
import { Terminal, Database, Play, CheckCircle } from 'lucide-react';

export function QuickStart() {
  return (
    <DocLayout
      title="Quick Start Guide"
      description="Get BIDUA Hosting up and running in minutes with this step-by-step guide."
      breadcrumbs={[{ label: 'Getting Started' }, { label: 'Quick Start' }]}
      prevPage={{ title: 'Introduction', path: '/docs/introduction' }}
      nextPage={{ title: 'Installation', path: '/docs/installation' }}
    >
      <div className="space-y-8">
        {/* Prerequisites */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Prerequisites</h2>
          <p className="text-slate-700 mb-4">Before you begin, ensure you have the following installed:</p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Node.js 18+</strong> and <strong>npm</strong> (for frontend)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Python 3.11+</strong> (for backend)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>PostgreSQL 14+</strong> (for database)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Git</strong> (for version control)</span>
            </li>
          </ul>
        </section>

        {/* Backend Setup */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Terminal className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Backend Setup</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Navigate to Backend Directory</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">cd backend_template</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Create Virtual Environment</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">python3 -m venv venv</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Activate Virtual Environment</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-2">
                <div>
                  <div className="text-slate-400 text-sm mb-1"># macOS/Linux:</div>
                  <code className="text-green-400">source venv/bin/activate</code>
                </div>
                <div className="mt-3">
                  <div className="text-slate-400 text-sm mb-1"># Windows:</div>
                  <code className="text-green-400">venv\Scripts\activate</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Install Dependencies</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">pip install -r requirements.txt</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Create Environment File</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">cp .env.example .env</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">Edit <code className="bg-slate-100 px-2 py-1 rounded">.env</code> with your configuration:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mt-2">
                <pre className="text-green-400 text-sm">{`DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/bidua_hosting
SECRET_KEY=your-super-secret-jwt-key-change-this
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">6. Initialize Database</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto space-y-2">
                <code className="text-green-400 block">python seed_countries.py</code>
                <code className="text-green-400 block">python seed_pricing_data.py</code>
                <code className="text-green-400 block">python seed_addons_data.py</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">7. Start Backend Server</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">uvicorn app.main:app --reload --host 0.0.0.0 --port 8000</code>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                <p className="text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Backend running at <code className="bg-green-100 px-2 py-1 rounded ml-1">http://localhost:8000</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frontend Setup */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Play className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Frontend Setup</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Navigate to Frontend Directory</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">cd BIDUA_Hosting-main</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Install Dependencies</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">npm install</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Configure Environment (Optional)</h3>
              <p className="text-slate-600 mb-2 text-sm">Create <code className="bg-slate-100 px-2 py-1 rounded">.env</code> if you need custom API URL:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">VITE_API_URL=http://localhost:8000</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Start Development Server</h3>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">npm run dev</code>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-blue-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Frontend running at <code className="bg-blue-100 px-2 py-1 rounded ml-1">http://localhost:4333</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verify Installation */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Database className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verify Installation</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Test Backend API</h3>
              <p className="text-slate-700 mb-3">Open in your browser or use curl:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">http://localhost:8000/docs</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">You should see the interactive API documentation (Swagger UI)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Test Frontend</h3>
              <p className="text-slate-700 mb-3">Navigate to:</p>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400">http://localhost:4333</code>
              </div>
              <p className="text-slate-600 mt-2 text-sm">You should see the BIDUA Hosting homepage</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Next Steps</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <a href="/docs/architecture" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Explore the Architecture
                </a>
                <p className="text-slate-600 text-sm">Understand how the platform is structured</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <a href="/docs/api/auth" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Read API Documentation
                </a>
                <p className="text-slate-600 text-sm">Learn about available API endpoints</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <a href="/docs/deploy/environment" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Deploy to Production
                </a>
                <p className="text-slate-600 text-sm">Deploy your instance to a production environment</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </DocLayout>
  );
}
