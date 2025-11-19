import { DocLayout } from '../../../components/docs/DocLayout';
import { Settings, Code, Database, Cloud } from 'lucide-react';

export function DeployEnvironment() {
  return (
    <DocLayout
      title="Environment Setup"
      description="Setting up development, staging, and production environments"
      breadcrumbs={[
        { label: 'Deployment', path: '/docs/deploy' },
        { label: 'Environment Setup' }
      ]}
      nextPage={{ title: 'Backend Deployment', path: '/docs/deploy/backend' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting uses multiple environments for development, testing, and production.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Types</h2>
          <div className="space-y-4 mb-6">
            {[
              {
                env: 'Development',
                purpose: 'Local development and testing',
                url: 'http://localhost:3000',
                db: 'Local SQLite'
              },
              {
                env: 'Staging',
                purpose: 'Pre-production testing',
                url: 'https://staging.biduahosting.com',
                db: 'PostgreSQL (staging)'
              },
              {
                env: 'Production',
                purpose: 'Live customer environment',
                url: 'https://biduahosting.com',
                db: 'PostgreSQL (production)'
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900">{item.env}</p>
                <div className="space-y-1 text-slate-600 text-sm mt-2">
                  <p>Purpose: {item.purpose}</p>
                  <p>URL: {item.url}</p>
                  <p>Database: {item.db}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Prerequisites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { name: 'Node.js', version: '18.0+', use: 'Backend runtime' },
              { name: 'Python', version: '3.10+', use: 'Backend services' },
              { name: 'PostgreSQL', version: '14+', use: 'Database' },
              { name: 'Docker', version: 'Latest', use: 'Containerization' },
              { name: 'Git', version: '2.30+', use: 'Version control' },
              { name: 'Docker Compose', version: '2.0+', use: 'Multi-container' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-slate-600 text-sm">Version: {item.version}</p>
                <p className="text-slate-600 text-sm">Use: {item.use}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Initial Setup</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Clone Repository</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1 overflow-x-auto">
                  git clone https://github.com/biduahosting/main.git
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Install Dependencies</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1 overflow-x-auto">
                  npm install && pip install -r requirements.txt
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Setup Environment Variables</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1 overflow-x-auto">
                  cp .env.example .env
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Initialize Database</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1 overflow-x-auto">
                  python manage.py migrate
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Variables</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Key Environment Variables:</h3>
            <div className="space-y-2 text-sm font-mono text-slate-600">
              <p>DATABASE_URL=postgresql://user:pass@localhost/bidua</p>
              <p>REDIS_URL=redis://localhost:6379/0</p>
              <p>SECRET_KEY=your-secret-key-here</p>
              <p>DEBUG=False (production)</p>
              <p>ALLOWED_HOSTS=.biduahosting.com</p>
              <p>EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend</p>
              <p>STRIPE_KEY=sk_live_...</p>
              <p>RAZORPAY_KEY_ID=key_id_here</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Docker Setup</h2>
          <p className="text-slate-600 mb-4">Use Docker for consistent environments:</p>
          <ol className="space-y-3 text-slate-600">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span>Build Docker image: <code className="bg-slate-100 px-2 py-1 rounded">docker build -t bidua:latest .</code></span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span>Run containers: <code className="bg-slate-100 px-2 py-1 rounded">docker-compose up</code></span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span>Access application at localhost:8000</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Development</h3>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li>4GB+ RAM</li>
                <li>2GB+ disk space</li>
                <li>Multi-core CPU</li>
                <li>Unix/Linux/Mac/WSL</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Production</h3>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li>16GB+ RAM</li>
                <li>100GB+ SSD</li>
                <li>4+ CPU cores</li>
                <li>Linux (CentOS/Ubuntu)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Checks</h2>
          <p className="text-slate-600 mb-4">Verify environment is ready:</p>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm space-y-2 overflow-x-auto">
            <p># Check Node.js</p>
            <p>node --version</p>
            <p className="mt-2"># Check Python</p>
            <p>python --version</p>
            <p className="mt-2"># Check PostgreSQL</p>
            <p>psql --version</p>
            <p className="mt-2"># Check Docker</p>
            <p>docker --version</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Keep environment variables in .env file (never commit)</li>
              <li>• Use different keys for dev/staging/production</li>
              <li>• Test environments before deploying</li>
              <li>• Document all environment-specific changes</li>
              <li>• Keep development separate from production</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
