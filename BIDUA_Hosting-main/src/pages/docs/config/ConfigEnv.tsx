import { DocLayout } from '../../../components/docs/DocLayout';
import { Settings, Lock, Code } from 'lucide-react';

export function ConfigEnv() {
  return (
    <DocLayout
      title="Environment Variables"
      description="Configure environment variables for all environments"
      breadcrumbs={[
        { label: 'Configuration', path: '/docs/config' },
        { label: 'Environment Variables' }
      ]}
      nextPage={{ title: 'Payment Gateway Setup', path: '/docs/config/payment' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Variables</h2>
          <p className="text-slate-600 mb-4">Configure your application using environment variables.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">File Structure</h2>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm space-y-1 mb-6 overflow-x-auto">
            <p>.env                  # Local development</p>
            <p>.env.staging          # Staging environment</p>
            <p>.env.production       # Production environment</p>
            <p>.env.example          # Template (commit to git)</p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-slate-700"><strong>Never commit:</strong> .env files with real secrets. Only commit .env.example</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Core Configuration</h2>
          <div className="space-y-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Application</h3>
              <div className="space-y-1 text-slate-600 text-sm font-mono">
                <p>NODE_ENV=production</p>
                <p>DEBUG=false</p>
                <p>PORT=8000</p>
                <p>APP_NAME=BIDUA Hosting</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Database</h3>
              <div className="space-y-1 text-slate-600 text-sm font-mono">
                <p>DATABASE_URL=postgresql://user:pass@localhost/db</p>
                <p>DB_POOL_SIZE=20</p>
                <p>DB_TIMEOUT=5000</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Cache/Redis</h3>
              <div className="space-y-1 text-slate-600 text-sm font-mono">
                <p>REDIS_URL=redis://localhost:6379/0</p>
                <p>CACHE_TTL=3600</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
              <div className="space-y-1 text-slate-600 text-sm font-mono">
                <p>SECRET_KEY=[generate-random-key]</p>
                <p>ALLOWED_HOSTS=biduahosting.com</p>
                <p>CSRF_TRUSTED_ORIGINS=https://biduahosting.com</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frontend Configuration</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Frontend Env Vars</h3>
            <div className="space-y-1 text-slate-600 text-sm font-mono">
              <p>VITE_API_URL=https://api.biduahosting.com</p>
              <p>VITE_CDN_URL=https://cdn.biduahosting.com</p>
              <p>VITE_APP_NAME=BIDUA Hosting</p>
              <p>VITE_ANALYTICS_ID=UA-xxxxx</p>
              <p>VITE_STRIPE_KEY=pk_live_xxxxx</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Configuration</h2>
          <div className="border border-slate-200 rounded-lg p-4 mb-6">
            <div className="space-y-1 text-slate-600 text-sm font-mono">
              <p>EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend</p>
              <p>EMAIL_HOST=smtp.sendgrid.net</p>
              <p>EMAIL_PORT=587</p>
              <p>EMAIL_HOST_USER=apikey</p>
              <p>EMAIL_HOST_PASSWORD=[sendgrid-api-key]</p>
              <p>DEFAULT_FROM_EMAIL=noreply@biduahosting.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment-Specific Values</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-2 text-left font-semibold">Variable</th>
                  <th className="px-4 py-2 text-left font-semibold">Development</th>
                  <th className="px-4 py-2 text-left font-semibold">Production</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="px-4 py-2 font-mono">DEBUG</td>
                  <td className="px-4 py-2">true</td>
                  <td className="px-4 py-2">false</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">ALLOWED_HOSTS</td>
                  <td className="px-4 py-2">*</td>
                  <td className="px-4 py-2">.biduahosting.com</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">LOG_LEVEL</td>
                  <td className="px-4 py-2">DEBUG</td>
                  <td className="px-4 py-2">INFO</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">SECURE_SSL_REDIRECT</td>
                  <td className="px-4 py-2">false</td>
                  <td className="px-4 py-2">true</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Example .env File</h2>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs space-y-1 overflow-x-auto mb-6">
            <p># Environment</p>
            <p>NODE_ENV=production</p>
            <p>DEBUG=false</p>
            <p></p>
            <p># Database</p>
            <p>DATABASE_URL=postgresql://bidua:password@db.example.com:5432/bidua_prod</p>
            <p></p>
            <p># Redis</p>
            <p>REDIS_URL=redis://redis.example.com:6379/0</p>
            <p></p>
            <p># Security</p>
            <p>SECRET_KEY=your-secret-key-here</p>
            <p>ALLOWED_HOSTS=biduahosting.com,api.biduahosting.com</p>
            <p></p>
            <p># Email</p>
            <p>EMAIL_HOST=smtp.sendgrid.net</p>
            <p>EMAIL_HOST_PASSWORD=SG.xxxxx</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Loading Environment Variables</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Python (Backend)</h3>
            <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs overflow-x-auto">
              <p>import os</p>
              <p>from dotenv import load_dotenv</p>
              <p></p>
              <p>load_dotenv()</p>
              <p>api_key = os.getenv('STRIPE_KEY')</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-3">JavaScript (Frontend)</h3>
            <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs overflow-x-auto">
              <p>const apiUrl = import.meta.env.VITE_API_URL</p>
              <p>const stripeKey = import.meta.env.VITE_STRIPE_KEY</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Use strong, random values for secrets</li>
              <li>• Rotate secrets periodically</li>
              <li>• Never commit .env files</li>
              <li>• Document required variables in .env.example</li>
              <li>• Use different secrets per environment</li>
              <li>• Store secrets in secure vault in production</li>
              <li>• Use environment variables for all configuration</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
