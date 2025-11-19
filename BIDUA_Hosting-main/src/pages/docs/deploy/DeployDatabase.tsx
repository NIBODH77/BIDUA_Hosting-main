import { DocLayout } from '../../../components/docs/DocLayout';
import { Database, Zap } from 'lucide-react';

export function DeployDatabase() {
  return (
    <DocLayout
      title="Database Setup & Migration"
      description="Initialize and manage database for production"
      breadcrumbs={[
        { label: 'Deployment', path: '/docs/deploy' },
        { label: 'Database Setup' }
      ]}
      prevPage={{ title: 'Frontend Deployment', path: '/docs/deploy/frontend' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Database Setup</h2>
          <p className="text-slate-600 mb-4">Initialize PostgreSQL database for BIDUA Hosting.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Prerequisites</h2>
          <div className="space-y-3 mb-6">
            {[
              'PostgreSQL 14+ installed',
              'pgAdmin or psql client',
              'Backup storage (S3/local)',
              'Adequate disk space (100GB+)',
              'Network access configured'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="checkbox" readOnly />
                <span className="text-slate-600">{item}</span>
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
                <p className="font-semibold text-slate-900">Create Database</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  createdb -U postgres bidua_production
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Create Database User</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  createuser -P bidua_user
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Grant Permissions</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-sm mt-1">
                  GRANT ALL PRIVILEGES ON DATABASE bidua_production TO bidua_user;
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Migrations</h2>
          <ol className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span>Review migrations: <code className="bg-slate-100 px-1">alembic history</code></span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span>Create backup first</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span>Run migrations: <code className="bg-slate-100 px-1">alembic upgrade head</code></span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span>Verify success: <code className="bg-slate-100 px-1">SELECT * FROM alembic_version;</code></span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Backup Strategy</h2>
          <div className="space-y-3 mb-6">
            {[
              { type: 'Daily Backup', frequency: 'Every 24 hours', retention: '7 days', method: 'pg_dump to S3' },
              { type: 'Weekly Backup', frequency: 'Every Sunday', retention: '4 weeks', method: 'Full backup' },
              { type: 'Monthly Backup', frequency: 'First day', retention: '12 months', method: 'Archive' }
            ].map((backup, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="font-semibold text-slate-900">{backup.type}</p>
                <div className="space-y-1 text-slate-600 text-sm mt-1">
                  <p>Frequency: {backup.frequency}</p>
                  <p>Retention: {backup.retention}</p>
                  <p>Method: {backup.method}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">Backup Command</h3>
          <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm overflow-x-auto">
            pg_dump -U bidua_user bidua_production | gzip &gt; backup_$(date +%Y%m%d).sql.gz
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Restore Procedure</h2>
          <ol className="space-y-3 text-slate-600 text-sm">
            <li>1. Stop application: <code className="bg-slate-100 px-1">systemctl stop bidua-api</code></li>
            <li>2. Drop current DB: <code className="bg-slate-100 px-1">dropdb bidua_production</code></li>
            <li>3. Create new DB: <code className="bg-slate-100 px-1">createdb bidua_production</code></li>
            <li>4. Restore backup: <code className="bg-slate-100 px-1">psql bidua_production &lt; backup.sql</code></li>
            <li>5. Verify data: <code className="bg-slate-100 px-1">SELECT COUNT(*) FROM users;</code></li>
            <li>6. Start application: <code className="bg-slate-100 px-1">systemctl start bidua-api</code></li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Performance Optimization</h2>
          <div className="space-y-3 mb-6">
            {[
              { task: 'Create Indexes', benefit: 'Faster queries' },
              { task: 'Vacuum & Analyze', benefit: 'Optimize storage' },
              { task: 'Connection Pooling', benefit: 'Better performance' },
              { task: 'Query Monitoring', benefit: 'Identify slow queries' }
            ].map((opt, idx) => (
              <div key={idx} className="flex justify-between p-2 border border-slate-200 rounded">
                <span className="text-slate-600">{opt.task}</span>
                <span className="text-slate-600 text-sm">{opt.benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Monitoring</h2>
          <div className="space-y-3 mb-6">
            <div className="border border-slate-200 rounded-lg p-3">
              <p className="font-semibold text-slate-900 text-sm">Connection Count</p>
              <div className="bg-slate-100 p-2 rounded font-mono text-xs mt-1">
                SELECT COUNT(*) FROM pg_stat_activity;
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3">
              <p className="font-semibold text-slate-900 text-sm">Database Size</p>
              <div className="bg-slate-100 p-2 rounded font-mono text-xs mt-1">
                SELECT pg_size_pretty(pg_database_size('bidua_production'));
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3">
              <p className="font-semibold text-slate-900 text-sm">Slow Queries</p>
              <div className="bg-slate-100 p-2 rounded font-mono text-xs mt-1">
                SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC;
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Maintenance Tasks</h2>
          <div className="space-y-2 text-slate-600 text-sm">
            <p>Weekly: <code className="bg-slate-100 px-1">VACUUM ANALYZE;</code></p>
            <p>Monthly: <code className="bg-slate-100 px-1">REINDEX DATABASE bidua_production;</code></p>
            <p>Quarterly: Full backup test and restore verification</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Test backups regularly</li>
              <li>• Monitor database size</li>
              <li>• Keep backups in multiple locations</li>
              <li>• Document all database changes</li>
              <li>• Set up monitoring alerts</li>
              <li>• Plan for database growth</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
