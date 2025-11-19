import { DocLayout } from '../../../components/docs/DocLayout';
import { Server, Code, CheckCircle } from 'lucide-react';

export function DeployBackend() {
  return (
    <DocLayout
      title="Backend Deployment"
      description="Deploy the backend API and services"
      breadcrumbs={[
        { label: 'Deployment', path: '/docs/deploy' },
        { label: 'Backend Deployment' }
      ]}
      prevPage={{ title: 'Environment Setup', path: '/docs/deploy/environment' }}
      nextPage={{ title: 'Frontend Deployment', path: '/docs/deploy/frontend' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Backend Deployment</h2>
          <p className="text-slate-600 mb-4">Deploy the FastAPI/Django backend to production servers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pre-Deployment Checklist</h2>
          <div className="space-y-2 mb-6">
            {[
              'All tests passing',
              'Code reviewed and merged',
              'Environment variables configured',
              'Database migrations ready',
              'Dependencies updated',
              'Security checks passed'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="checkbox" readOnly />
                <span className="text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Deployment Steps</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Build Backend</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  docker build -t bidua-api:latest -f backend.Dockerfile .
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Push to Registry</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  docker push registry.biduahosting.com/api:latest
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Run Migrations</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  docker run api:latest alembic upgrade head
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Deploy to Server</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  kubectl apply -f api-deployment.yaml
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Configuration</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Production Secrets:</h3>
            <div className="space-y-2 text-sm font-mono text-slate-600">
              <p>SECRET_KEY=<span className="text-amber-600">[generate-strong-key]</span></p>
              <p>DATABASE_URL=<span className="text-amber-600">[production-db-url]</span></p>
              <p>REDIS_URL=<span className="text-amber-600">[production-redis-url]</span></p>
              <p>DEBUG=False</p>
              <p>ALLOWED_HOSTS=biduahosting.com,api.biduahosting.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Database Migrations</h2>
          <ol className="space-y-2 text-slate-600 text-sm">
            <li>1. Review pending migrations: <code className="bg-slate-100 px-1">alembic history</code></li>
            <li>2. Create backup before migration</li>
            <li>3. Run migrations: <code className="bg-slate-100 px-1">alembic upgrade head</code></li>
            <li>4. Verify migration success</li>
            <li>5. Rollback plan if needed</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Checks</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <p className="text-slate-600 mb-3">Verify deployment after deploying:</p>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">Check API endpoint: <code className="bg-white border p-1">curl https://api.biduahosting.com/health</code></p>
              <p className="text-slate-600">Check database: <code className="bg-white border p-1">curl https://api.biduahosting.com/db-health</code></p>
              <p className="text-slate-600">Check logs: <code className="bg-white border p-1">kubectl logs deployment/bidua-api</code></p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Rollback Plan</h2>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">If deployment fails, revert: <code className="bg-slate-100 px-1">kubectl rollout undo deployment/bidua-api</code></span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">If database migration fails, restore from backup</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Alert team and analyze failure</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Monitoring</h2>
          <div className="space-y-3 mb-6">
            {[
              { metric: 'API Response Time', target: '< 200ms' },
              { metric: 'Error Rate', target: '< 0.1%' },
              { metric: 'Memory Usage', target: '< 80%' },
              { metric: 'CPU Usage', target: '< 70%' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border border-slate-200 rounded">
                <span className="text-slate-600">{item.metric}</span>
                <span className="text-slate-900 font-semibold">{item.target}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Deploy during low-traffic periods</li>
              <li>• Have rollback plan ready</li>
              <li>• Monitor logs after deployment</li>
              <li>• Communicate with team before deploying</li>
              <li>• Keep database backups recent</li>
              <li>• Test migrations on staging first</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
