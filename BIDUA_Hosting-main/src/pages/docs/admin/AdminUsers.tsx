import { DocLayout } from '../../../components/docs/DocLayout';
import { Users, UserCheck, Lock, Trash2 } from 'lucide-react';

export function AdminUsers() {
  return (
    <DocLayout
      title="User Management"
      description="Guide to managing user accounts and access"
      breadcrumbs={[
        { label: 'Admin Guides', path: '/docs/admin' },
        { label: 'User Management' }
      ]}
      prevPage={{ title: 'Admin Dashboard', path: '/docs/admin/dashboard' }}
      nextPage={{ title: 'Plan Management', path: '/docs/admin/plans' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Manage user accounts, permissions, and account status from the admin panel.
          </p>
        </section>

        {/* User List */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Viewing Users</h2>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Click "Users" from admin sidebar</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">View paginated list of all users</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Use filters and search to find specific users</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Click user to view detailed profile</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">User List Columns</h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold">Column</th>
                  <th className="px-4 py-3 text-left font-semibold">Information</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Name</td>
                  <td className="px-4 py-3 text-slate-600">User's full name</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium">Email</td>
                  <td className="px-4 py-3 text-slate-600">Primary contact email</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Status</td>
                  <td className="px-4 py-3 text-slate-600">Active, Suspended, Inactive</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium">Join Date</td>
                  <td className="px-4 py-3 text-slate-600">Account creation date</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Last Login</td>
                  <td className="px-4 py-3 text-slate-600">Last access to account</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium">Plan</td>
                  <td className="px-4 py-3 text-slate-600">Current hosting plan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* User Actions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">User Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              {
                icon: UserCheck,
                title: 'View User Details',
                steps: ['Click on user from list', 'View full profile', 'Edit information', 'Manage services']
              },
              {
                icon: Lock,
                title: 'Reset Password',
                steps: ['Click user → Settings', 'Select "Reset Password"', 'Send reset email', 'User sets new password']
              },
              {
                icon: Users,
                title: 'Change Plan',
                steps: ['Click user → Services', 'Select "Upgrade/Downgrade"', 'Choose new plan', 'Apply changes']
              },
              {
                icon: Trash2,
                title: 'Suspend Account',
                steps: ['Click user → Settings', 'Select "Suspend"', 'Choose reason', 'Confirm suspension']
              }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-3">{action.title}</h3>
                  <ol className="space-y-1 text-slate-600 text-sm">
                    {action.steps.map((step, sidx) => (
                      <li key={sidx}>{sidx + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* Account Status */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Status Management</h2>

          <div className="space-y-4 mb-6">
            {[
              { status: 'Active', color: 'green', desc: 'Account in good standing' },
              { status: 'Suspended', color: 'red', desc: 'Account restricted due to violation' },
              { status: 'Inactive', color: 'gray', desc: 'Account not used for 90+ days' },
              { status: 'Pending', color: 'yellow', desc: 'Awaiting email verification' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-${item.color}-500`}></div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.status}</p>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Suspending Users</h3>

          <ol className="space-y-2 text-slate-600">
            <li>1. Click on user account</li>
            <li>2. Go to Settings → Account Status</li>
            <li>3. Click "Suspend Account"</li>
            <li>4. Select reason (policy violation, payment issues, etc)</li>
            <li>5. Enter admin notes</li>
            <li>6. Click "Confirm Suspension"</li>
            <li>7. User receives notification</li>
          </ol>
        </section>

        {/* User Roles & Permissions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Roles & Permissions</h2>

          <p className="text-slate-600 mb-6">
            Different user roles have different permission levels:
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                role: 'Customer',
                perms: ['View own account', 'Manage servers', 'View invoices', 'Open support tickets']
              },
              {
                role: 'Reseller',
                perms: ['Create sub-accounts', 'White-label control', 'Manage customers', 'Custom billing']
              },
              {
                role: 'Support Staff',
                perms: ['View accounts', 'Handle tickets', 'Reset passwords', 'Issue refunds']
              },
              {
                role: 'Admin',
                perms: ['Full access', 'User management', 'System settings', 'Financial reports']
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">{item.role}</h4>
                <ul className="space-y-1 text-slate-600 text-sm">
                  {item.perms.map((perm, pidx) => (
                    <li key={pidx}>• {perm}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Searching & Filtering */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Searching & Filtering Users</h2>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Available Filters</h3>

            <div className="space-y-3 text-slate-600">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Status</p>
                <p className="text-sm">Active, Suspended, Inactive, Pending</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Plan Type</p>
                <p className="text-sm">Shared, VPS, Cloud, Dedicated</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Join Date Range</p>
                <p className="text-sm">Specify start and end dates</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Country</p>
                <p className="text-sm">Filter by registration country</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Payment Status</p>
                <p className="text-sm">Paid, Outstanding, Overdue</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Communications */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">User Communications</h2>

          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Sending Messages</h3>

            <ol className="space-y-2 text-slate-600">
              <li>1. Select user from list</li>
              <li>2. Click "Send Message" or "Email User"</li>
              <li>3. Compose message</li>
              <li>4. Choose delivery method (email, in-app notification)</li>
              <li>5. Preview and send</li>
            </ol>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Message Templates</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              'Welcome email',
              'Account verification',
              'Password reset',
              'Billing reminder',
              'Renewal notification',
              'Account suspension notice'
            ].map((template, idx) => (
              <button key={idx} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left text-slate-600">
                {template}
              </button>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Review suspended accounts weekly</li>
              <li>• Document all account actions for audit trail</li>
              <li>• Use filters to find problematic accounts</li>
              <li>• Always verify identity before sensitive actions</li>
              <li>• Send notifications before suspensions</li>
              <li>• Keep support tickets updated for user issues</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
