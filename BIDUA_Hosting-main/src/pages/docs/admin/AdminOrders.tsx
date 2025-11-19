import { DocLayout } from '../../../components/docs/DocLayout';
import { ShoppingCart, FileText, DollarSign } from 'lucide-react';

export function AdminOrders() {
  return (
    <DocLayout
      title="Order Management"
      description="Manage customer orders and transactions"
      breadcrumbs={[
        { label: 'Admin Guides', path: '/docs/admin' },
        { label: 'Order Management' }
      ]}
      prevPage={{ title: 'Plan Management', path: '/docs/admin/plans' }}
      nextPage={{ title: 'Support Management', path: '/docs/admin/support' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Management</h2>
          <p className="text-slate-600 mb-4">Track, manage, and process customer orders from the admin panel.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Viewing Orders</h2>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Admin → Orders</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">View all orders with status indicators</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Filter by status, date, customer, amount</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Click order to view details</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { status: 'Pending', color: 'yellow', desc: 'Awaiting payment' },
              { status: 'Processing', color: 'blue', desc: 'Being processed' },
              { status: 'Completed', color: 'green', desc: 'Order fulfilled' },
              { status: 'Cancelled', color: 'red', desc: 'Order cancelled' },
              { status: 'Refunded', color: 'orange', desc: 'Refund issued' },
              { status: 'Failed', color: 'red', desc: 'Payment failed' }
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Details</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono font-semibold">ORD-2024-001234</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>john@example.com</span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-semibold">VPS 2vCore</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Cycle:</span>
                <span>Annual</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-semibold">Amount:</span>
                <span className="font-bold text-cyan-500">$359.88</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">Completed</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Actions</h2>
          <div className="space-y-3 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Issue Refund</h4>
              <p className="text-slate-600 text-sm mb-3">Process refund for customer</p>
              <ol className="space-y-1 text-slate-600 text-sm">
                <li>1. Click "Issue Refund"</li>
                <li>2. Select amount</li>
                <li>3. Choose refund method</li>
                <li>4. Enter reason</li>
                <li>5. Confirm refund</li>
              </ol>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Cancel Order</h4>
              <p className="text-slate-600 text-sm mb-3">Cancel order and handle refund</p>
              <p className="text-slate-600 text-sm">Only available for pending/processing orders</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">View Invoice</h4>
              <p className="text-slate-600 text-sm mb-3">View or download order invoice</p>
              <p className="text-slate-600 text-sm">Click to view full invoice details</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Send Email</h4>
              <p className="text-slate-600 text-sm mb-3">Send message to customer</p>
              <p className="text-slate-600 text-sm">Use templates or custom message</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Filtering Orders</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Available Filters:</h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Status (Pending, Completed, Refunded, etc)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Date range</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Customer name/email</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Amount range</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Payment method</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-slate-300 rounded"></span>
                <span>Plan type</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Refund Process</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Open Order</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Click "Issue Refund"</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Refund Details</p>
                <p className="text-slate-600 text-sm">Amount, reason, notes</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Confirm Refund</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">5</span>
              <div>
                <p className="font-semibold text-slate-900">Notify Customer</p>
                <p className="text-slate-600 text-sm">Send refund notification email</p>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Reports</h2>
          <div className="space-y-3 mb-6">
            {[
              { title: 'Sales Report', desc: 'Revenue by date, plan, customer' },
              { title: 'Refund Report', desc: 'All refunds issued with reasons' },
              { title: 'Payment Report', desc: 'Payment methods and success rates' },
              { title: 'Customer Report', desc: 'Top customers by spend' }
            ].map((report, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="font-semibold text-slate-900">{report.title}</p>
                <p className="text-slate-600 text-sm">{report.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Check pending orders daily</li>
              <li>• Process refunds promptly</li>
              <li>• Document all order actions</li>
              <li>• Review failed payments</li>
              <li>• Follow up with customers about refunds</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
