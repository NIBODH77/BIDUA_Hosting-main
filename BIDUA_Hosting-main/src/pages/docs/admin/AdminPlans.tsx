import { DocLayout } from '../../../components/docs/DocLayout';
import { Package, Sliders, PlusCircle, Trash2 } from 'lucide-react';

export function AdminPlans() {
  return (
    <DocLayout
      title="Plan Management"
      description="Create and manage hosting plans"
      breadcrumbs={[
        { label: 'Admin Guides', path: '/docs/admin' },
        { label: 'Plan Management' }
      ]}
      prevPage={{ title: 'User Management', path: '/docs/admin/users' }}
      nextPage={{ title: 'Order Management', path: '/docs/admin/orders' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Plans</h2>
          <p className="text-slate-600 mb-4">Create, edit, and manage hosting plans from the admin panel.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan List</h2>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Admin → Plans</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">View all available plans</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Click plan to edit or delete</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Creating New Plan</h2>
          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Click "Add New Plan"</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Plan Details</p>
                <p className="text-slate-600 text-sm">Name, type, features</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Configure Resources</p>
                <p className="text-slate-600 text-sm">CPU, RAM, storage, bandwidth</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Set Pricing</p>
                <p className="text-slate-600 text-sm">Monthly, quarterly, annual rates</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">5</span>
              <div>
                <p className="font-semibold text-slate-900">Publish Plan</p>
                <p className="text-slate-600 text-sm">Make visible to customers</p>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan Fields</h2>
          <div className="space-y-3 mb-6">
            {[
              { field: 'Plan Name', required: true, example: 'Professional VPS' },
              { field: 'Plan Type', required: true, example: 'VPS' },
              { field: 'Description', required: false, example: 'High-performance VPS' },
              { field: 'CPU Cores', required: true, example: '4' },
              { field: 'RAM (GB)', required: true, example: '8' },
              { field: 'Storage (GB)', required: true, example: '500' },
              { field: 'Bandwidth', required: true, example: '2TB/month' },
              { field: 'Monthly Price', required: true, example: '$49.99' },
              { field: 'Setup Fee', required: false, example: '$0' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-900">{item.field}</span>
                  {item.required && <span className="text-red-500 text-xs">REQUIRED</span>}
                </div>
                <p className="text-slate-600 text-sm">Example: {item.example}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Editing Plans</h2>
          <ol className="space-y-2 text-slate-600">
            <li>1. Click on plan from list</li>
            <li>2. Click "Edit" button</li>
            <li>3. Modify plan details</li>
            <li>4. Update pricing if needed</li>
            <li>5. Click "Save Changes"</li>
            <li>6. Changes take effect immediately</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing Tiers</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <p className="text-slate-600 mb-4">Configure prices for different billing cycles:</p>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between p-2 border border-slate-200 rounded">
                <span>Monthly:</span>
                <span className="font-mono">$49.99</span>
              </div>
              <div className="flex justify-between p-2 border border-slate-200 rounded">
                <span>Quarterly (5% discount):</span>
                <span className="font-mono">$141.47</span>
              </div>
              <div className="flex justify-between p-2 border border-slate-200 rounded">
                <span>Annual (20% discount):</span>
                <span className="font-mono">$479.92</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { status: 'Active', color: 'green', desc: 'Available for purchase' },
              { status: 'Inactive', color: 'gray', desc: 'Hidden from customers' },
              { status: 'Deprecated', color: 'yellow', desc: 'Old plan, no new sales' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900 mb-1">{item.status}</p>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Deleting Plans</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-900 mb-3"><strong>Warning:</strong> Use caution when deleting plans</p>
            <ol className="space-y-1 text-red-900 text-sm">
              <li>1. Only delete plans with no active customers</li>
              <li>2. Consider deprecating instead of deleting</li>
              <li>3. Backup data before deletion</li>
              <li>4. Confirm deletion when prompted</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan Features</h2>
          <p className="text-slate-600 mb-4">Define what's included in each plan:</p>
          <div className="space-y-2 mb-6 text-slate-600">
            <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
              <input type="checkbox" checked readOnly />
              <span>Unlimited subdomains</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
              <input type="checkbox" checked readOnly />
              <span>Free SSL certificate</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
              <input type="checkbox" checked readOnly />
              <span>Daily backups</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
              <input type="checkbox" readOnly />
              <span>Premium support</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Review plan pricing quarterly</li>
              <li>• Offer promotional discounts for annual billing</li>
              <li>• Don't create too many similar plans</li>
              <li>• Test plans before publishing</li>
              <li>• Keep resource limits realistic</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
