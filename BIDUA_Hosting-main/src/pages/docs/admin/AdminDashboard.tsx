import { DocLayout } from '../../../components/docs/DocLayout';
import { BarChart3, Users, DollarSign, AlertCircle, Settings } from 'lucide-react';

export function AdminDashboard() {
  return (
    <DocLayout
      title="Admin Dashboard Guide"
      description="Complete guide to the admin control panel"
      breadcrumbs={[
        { label: 'Admin Guides', path: '/docs/admin' },
        { label: 'Dashboard' }
      ]}
      nextPage={{ title: 'User Management', path: '/docs/admin/users' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            The admin dashboard provides comprehensive controls for managing the BIDUA Hosting platform, users, servers, billing, and support operations.
          </p>
        </section>

        {/* Accessing Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessing the Admin Panel</h2>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to admin.biduahosting.com</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Log in with admin credentials</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Two-factor authentication (if enabled)</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Access main dashboard</span>
            </li>
          </ol>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-slate-700"><strong>Security:</strong> Never share admin credentials. Enable 2FA on admin accounts.</p>
          </div>
        </section>

        {/* Dashboard Sections */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard Sections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: BarChart3,
                title: 'Overview',
                items: ['Key metrics', 'Revenue stats', 'System health', 'Recent activity']
              },
              {
                icon: Users,
                title: 'Users',
                items: ['User list', 'New signups', 'Active users', 'Suspended accounts']
              },
              {
                icon: DollarSign,
                title: 'Billing',
                items: ['Invoices', 'Payments', 'Refunds', 'Revenue reports']
              },
              {
                icon: Settings,
                title: 'Settings',
                items: ['System config', 'Payment gateways', 'Email settings', 'Security']
              }
            ].map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, iidx) => (
                      <li key={iidx} className="text-slate-600 text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dashboard Widgets */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard Widgets</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: '1,245', change: '+5.2%', color: 'cyan' },
              { label: 'Total Revenue', value: '$45,230', change: '+12.3%', color: 'green' },
              { label: 'Active Servers', value: '982', change: '+2.1%', color: 'blue' },
              { label: 'Support Tickets', value: '23', change: '-8.5%', color: 'orange' }
            ].map((metric, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-slate-600 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <p className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
              <h4 className="font-semibold text-slate-900">Latest Events</h4>
            </div>

            <div className="divide-y divide-slate-200">
              {[
                { time: '2 minutes ago', event: 'New user signup', user: 'John Doe', status: 'success' },
                { time: '15 minutes ago', event: 'Server created', user: 'VPS-1234', status: 'success' },
                { time: '1 hour ago', event: 'Payment received', user: '$130.90', status: 'success' },
                { time: '2 hours ago', event: 'Support ticket', user: 'Ticket #5432', status: 'pending' }
              ].map((activity, idx) => (
                <div key={idx} className="px-6 py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-900">{activity.event}</p>
                    <p className="text-slate-600 text-sm">{activity.user}</p>
                  </div>
                  <p className="text-slate-600 text-sm">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Main Navigation</h2>

          <p className="text-slate-600 mb-6">The admin dashboard sidebar provides access to all key sections:</p>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-4">Left Sidebar Menu</h3>

            <div className="space-y-2 text-slate-600">
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Dashboard</strong> - Main overview</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Users</strong> - User management</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Orders</strong> - Order tracking</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Plans</strong> - Hosting plans</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Servers</strong> - Server management</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Billing</strong> - Invoices & payments</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Support</strong> - Tickets & issues</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                <span><strong>Settings</strong> - System settings</span>
              </p>
            </div>
          </div>
        </section>

        {/* Filtering & Search */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Filtering & Search</h2>

          <p className="text-slate-600 mb-6">
            Most admin panels have search and filter capabilities:
          </p>

          <div className="space-y-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Search Box</h3>
              <p className="text-slate-600 text-sm">Quick search by name, email, ID, or username</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Filters</h3>
              <p className="text-slate-600 text-sm">Filter by status, date range, plan type, etc</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Export</h3>
              <p className="text-slate-600 text-sm">Export data to CSV or PDF for reports</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Sorting</h3>
              <p className="text-slate-600 text-sm">Sort by any column - click column header</p>
            </div>
          </div>
        </section>

        {/* Reports */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Reports & Analytics</h2>

          <p className="text-slate-600 mb-6">
            Access detailed reports and analytics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { title: 'Revenue Report', desc: 'Daily, monthly, yearly revenue' },
              { title: 'User Growth', desc: 'New users, churn, retention' },
              { title: 'Server Usage', desc: 'Resource utilization metrics' },
              { title: 'Payment Analysis', desc: 'Payment methods, failed payments' },
              { title: 'Support Metrics', desc: 'Ticket volume, response times' },
              { title: 'Plan Analytics', desc: 'Popular plans, upgrades, downgrades' }
            ].map((report, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-1">{report.title}</h4>
                <p className="text-slate-600 text-sm">{report.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Generating Reports</h3>

          <ol className="space-y-2 text-slate-600">
            <li>1. Click "Reports" from sidebar</li>
            <li>2. Select report type</li>
            <li>3. Set date range</li>
            <li>4. Choose format (PDF, CSV, Excel)</li>
            <li>5. Click "Generate" or "Export"</li>
          </ol>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>

          <p className="text-slate-600 mb-6">
            Commonly used admin tasks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              'Create new user',
              'Issue refund',
              'Suspend account',
              'Create server',
              'Process payment',
              'Send announcement',
              'View logs',
              'System status'
            ].map((action, idx) => (
              <button key={idx} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                {action}
              </button>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Keep admin account secure with strong password and 2FA</li>
              <li>• Review activity logs regularly</li>
              <li>• Generate backups weekly</li>
              <li>• Monitor system performance metrics</li>
              <li>• Update system regularly</li>
              <li>• Document all major changes</li>
              <li>• Review and reconcile billing weekly</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
