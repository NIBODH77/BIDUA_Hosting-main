import { DocLayout } from '../../../components/docs/DocLayout';
import { Globe, Code2 } from 'lucide-react';

export function DeployFrontend() {
  return (
    <DocLayout
      title="Frontend Deployment"
      description="Deploy the React frontend to CDN and servers"
      breadcrumbs={[
        { label: 'Deployment', path: '/docs/deploy' },
        { label: 'Frontend Deployment' }
      ]}
      prevPage={{ title: 'Backend Deployment', path: '/docs/deploy/backend' }}
      nextPage={{ title: 'Database Setup', path: '/docs/deploy/database' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frontend Deployment</h2>
          <p className="text-slate-600 mb-4">Deploy React application to production CDN and servers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Process</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Install Dependencies</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  npm install
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Build Production Bundle</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  npm run build
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Optimize Assets</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  npm run analyze
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Deploy to CDN</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  npm run deploy
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Optimization</h2>
          <div className="space-y-3 mb-6">
            {[
              { optimization: 'Code Splitting', benefit: 'Reduce initial bundle size' },
              { optimization: 'Minification', benefit: 'Compress JavaScript/CSS' },
              { optimization: 'Image Optimization', benefit: 'Compress and lazy load' },
              { optimization: 'Caching', benefit: 'Browser/CDN caching' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between p-3 border border-slate-200 rounded">
                <span className="font-semibold text-slate-900">{item.optimization}</span>
                <span className="text-slate-600 text-sm">{item.benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Configuration</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">.env.production</h3>
            <div className="space-y-1 text-sm font-mono text-slate-600">
              <p>VITE_API_URL=https://api.biduahosting.com</p>
              <p>VITE_CDN_URL=https://cdn.biduahosting.com</p>
              <p>VITE_APP_NAME=BIDUA Hosting</p>
              <p>VITE_ANALYTICS_ID=UA-xxxxx</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">CDN Deployment</h2>
          <ol className="space-y-3 text-slate-600 text-sm">
            <li>1. Build: <code className="bg-slate-100 px-1">npm run build</code></li>
            <li>2. Output: <code className="bg-slate-100 px-1">dist/</code> folder</li>
            <li>3. Upload to CDN: <code className="bg-slate-100 px-1">aws s3 sync dist/ s3://cdn-bucket/</code></li>
            <li>4. Invalidate cache: <code className="bg-slate-100 px-1">aws cloudfront create-invalidation</code></li>
            <li>5. Verify deployment</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Post-Deployment Verification</h2>
          <div className="space-y-3 mb-6">
            {[
              'Check homepage loads without errors',
              'Verify API connectivity',
              'Test user authentication',
              'Check responsive design',
              'Test payment gateway',
              'Monitor error logs'
            ].map((check, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="checkbox" readOnly />
                <span className="text-slate-600">{check}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Performance Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { metric: 'Page Load Time', target: '< 3s' },
              { metric: 'First Contentful Paint', target: '< 1.8s' },
              { metric: 'Largest Contentful Paint', target: '< 2.5s' },
              { metric: 'Time to Interactive', target: '< 3.8s' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="text-slate-600 text-sm">{item.metric}</p>
                <p className="font-semibold text-slate-900">{item.target}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Rollback Procedure</h2>
          <ol className="space-y-2 text-slate-600 text-sm">
            <li>1. If critical issue, revert to previous version</li>
            <li>2. Invalidate CloudFront cache</li>
            <li>3. Notify team of issue</li>
            <li>4. Post-mortem analysis</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Always test build locally before deploying</li>
              <li>• Monitor bundle size to avoid bloat</li>
              <li>• Use CDN for static assets</li>
              <li>• Implement proper caching headers</li>
              <li>• Test on various devices and browsers</li>
              <li>• Use Web Vitals metrics for monitoring</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
