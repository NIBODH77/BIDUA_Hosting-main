import { DocLayout } from '../../../components/docs/DocLayout';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

export function AdminSupport() {
  return (
    <DocLayout
      title="Support Management"
      description="Manage support tickets and customer issues"
      breadcrumbs={[
        { label: 'Admin Guides', path: '/docs/admin' },
        { label: 'Support Management' }
      ]}
      prevPage={{ title: 'Order Management', path: '/docs/admin/orders' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Management</h2>
          <p className="text-slate-600 mb-4">Manage customer support tickets and issues from the admin panel.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Dashboard</h2>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Admin → Support</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">View support queue and metrics</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Click ticket to view details</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { status: 'Open', color: 'blue', desc: 'New ticket' },
              { status: 'In Progress', color: 'yellow', desc: 'Being worked on' },
              { status: 'Waiting for Customer', color: 'orange', desc: 'Awaiting response' },
              { status: 'Resolved', color: 'green', desc: 'Issue fixed' },
              { status: 'Closed', color: 'gray', desc: 'Archived' },
              { status: 'Re-opened', color: 'red', desc: 'Issue recurred' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <p className="font-semibold text-slate-900">{item.status}</p>
                </div>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Responding to Tickets</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Open Ticket</p>
                <p className="text-slate-600 text-sm">Click ticket from list</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Read Details</p>
                <p className="text-slate-600 text-sm">Review customer issue and attachments</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Assign Ticket</p>
                <p className="text-slate-600 text-sm">Assign to support staff member</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Compose Response</p>
                <p className="text-slate-600 text-sm">Write helpful response</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">5</span>
              <div>
                <p className="font-semibold text-slate-900">Send Reply</p>
                <p className="text-slate-600 text-sm">Click send to notify customer</p>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Priorities</h2>
          <div className="space-y-3 mb-6">
            {[
              { level: 'Critical', color: 'red', response: '30 min', desc: 'Service down' },
              { level: 'High', color: 'orange', response: '2 hours', desc: 'Major issue' },
              { level: 'Medium', color: 'yellow', response: '8 hours', desc: 'Minor issue' },
              { level: 'Low', color: 'blue', response: '24 hours', desc: 'General inquiry' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded bg-${item.color}-500`}></div>
                    <span className="font-semibold text-slate-900">{item.level}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 text-sm">{item.response} response</p>
                    <p className="text-slate-600 text-xs">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Templates</h2>
          <p className="text-slate-600 mb-4">Use reply templates for common issues:</p>
          <div className="space-y-3 mb-6">
            {[
              'Password reset instructions',
              'Server restart confirmation',
              'Billing inquiry response',
              'Refund process explanation',
              'Feature not available',
              'Issue resolved confirmation'
            ].map((template, idx) => (
              <button key={idx} className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                {template}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { metric: 'Open Tickets', value: '23', color: 'cyan' },
              { metric: 'Avg Response Time', value: '2.5h', color: 'blue' },
              { metric: 'Closed Today', value: '12', color: 'green' },
              { metric: 'Customer Rating', value: '4.8/5', color: 'yellow' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-slate-600 text-sm">{stat.metric}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Filtering Tickets</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Available Filters:</h3>
            <div className="space-y-2 text-slate-600">
              <p>Status: Open, In Progress, Resolved, Closed</p>
              <p>Priority: Critical, High, Medium, Low</p>
              <p>Category: Technical, Billing, Account, Security</p>
              <p>Assigned to: Support staff member</p>
              <p>Date range: Custom date range</p>
              <p>Customer: Search by name/email</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Respond to critical tickets immediately</li>
              <li>• Always acknowledge receipt of ticket</li>
              <li>• Set clear expectations for resolution time</li>
              <li>• Provide step-by-step solutions</li>
              <li>• Follow up with customers after resolution</li>
              <li>• Collect feedback on support experience</li>
              <li>• Document solutions for future reference</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
