import { DocLayout } from '../../../components/docs/DocLayout';
import { ShoppingCart, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export function OrdersAPI() {
  return (
    <DocLayout
      title="Orders API"
      description="API documentation for order creation, management, and order tracking."
      breadcrumbs={[{ label: 'API' }, { label: 'Orders' }]}
      prevPage={{ title: 'Plans API', path: '/docs/api/plans' }}
      nextPage={{ title: 'Payments API', path: '/docs/api/payments' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Orders API Overview</h2>
          <p className="text-slate-700 mb-4">
            The Orders API manages the complete order lifecycle - from creation through fulfillment. Orders link users, plans, and payment information.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">Authentication</h3>
              <p className="text-slate-700 text-sm">Most endpoints require authentication. Include JWT token in Authorization header.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Order Statuses</h3>
              <p className="text-slate-700 text-sm">pending, active, cancelled, completed, expired</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Payment Statuses</h3>
              <p className="text-slate-700 text-sm">pending, paid, failed, refunded, partially_refunded</p>
            </div>
          </div>
        </section>

        {/* Create Order */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Order</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/orders
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "plan_id": 1,
  "billing_cycle": "annual",
  "country_id": 3,
  "currency": "INR",
  "addons": [
    {
      "addon_id": 1,
      "quantity": 2
    },
    {
      "addon_id": 3,
      "quantity": 1
    }
  ],
  "server_details": {
    "hostname": "my-server.example.com",
    "os": "Ubuntu 22.04",
    "datacenter": "US-East"
  },
  "promo_code": "SAVE10",
  "notes": "Please activate immediately"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (201 Created)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 5,
  "order_number": "ORD-2024-000005",
  "user_id": 1,
  "plan_id": 1,
  "order_status": "pending",
  "payment_status": "pending",
  "billing_cycle": "annual",
  "total_amount": 59.88,
  "discount_amount": 6.89,
  "tax_amount": 11.16,
  "grand_total": 73.16,
  "currency": "INR",
  "server_details": {
    "hostname": "my-server.example.com",
    "os": "Ubuntu 22.04",
    "datacenter": "US-East"
  },
  "razorpay_order_id": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Invalid or missing authentication token</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Invalid plan_id, country_id, or insufficient stock</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">422 Unprocessable Entity</p>
                  <p className="text-red-800 text-sm">Validation error - missing required fields or invalid format</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List Orders */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">List User Orders</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/orders
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">skip</span> (optional) - Number of orders to skip (default: 0)</div>
                <div><span className="font-semibold">limit</span> (optional) - Number of orders to return (default: 10, max: 100)</div>
                <div><span className="font-semibold">status</span> (optional) - Filter by order status</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "orders": [
    {
      "id": 5,
      "order_number": "ORD-2024-000005",
      "plan": {
        "id": 1,
        "name": "VPS Starter"
      },
      "order_status": "active",
      "payment_status": "paid",
      "billing_cycle": "annual",
      "grand_total": 73.16,
      "currency": "INR",
      "created_at": "2024-01-15T10:30:00Z",
      "next_renewal": "2025-01-15T10:30:00Z"
    },
    {
      "id": 4,
      "order_number": "ORD-2024-000004",
      "plan": {
        "id": 2,
        "name": "VPS Professional"
      },
      "order_status": "pending",
      "payment_status": "pending",
      "billing_cycle": "monthly",
      "grand_total": 11.98,
      "currency": "USD",
      "created_at": "2024-01-10T15:20:00Z"
    }
  ],
  "total": 2,
  "skip": 0,
  "limit": 10
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Get Order Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Order Details</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/orders/{'{order_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 5,
  "order_number": "ORD-2024-000005",
  "user_id": 1,
  "plan": {
    "id": 1,
    "name": "VPS Starter",
    "type": "vps",
    "base_price": 4.99
  },
  "order_status": "active",
  "payment_status": "paid",
  "billing_cycle": "annual",
  "total_amount": 59.88,
  "discount_amount": 6.89,
  "tax_amount": 11.16,
  "grand_total": 73.16,
  "currency": "INR",
  "addons": [
    {
      "addon_id": 1,
      "name": "Extra RAM",
      "quantity": 2,
      "price_per_unit": 2.00,
      "total": 4.00
    }
  ],
  "server_details": {
    "hostname": "my-server.example.com",
    "os": "Ubuntu 22.04",
    "datacenter": "US-East"
  },
  "razorpay_order_id": "order_123abc456",
  "razorpay_payment_id": "pay_456def789",
  "payment_date": "2024-01-15T10:45:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:45:00Z",
  "next_renewal": "2025-01-15T10:30:00Z"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Missing or invalid authentication token</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">403 Forbidden</p>
                  <p className="text-red-800 text-sm">You don't have permission to access this order</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Order with specified ID does not exist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Update Order Status */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Update Order Status (Admin)</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                PATCH /api/v1/orders/{'{order_id}'}/status
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{admin_token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "order_status": "active",
  "payment_status": "paid"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "message": "Order status updated successfully",
  "order": {
    "id": 5,
    "order_number": "ORD-2024-000005",
    "order_status": "active",
    "payment_status": "paid",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Order Lifecycle */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Lifecycle</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 text-slate-700 font-semibold">1</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Pending</h3>
                  <p className="text-slate-700 text-sm">Order created, waiting for payment</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-200 text-blue-700 font-semibold">2</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Payment Processing</h3>
                  <p className="text-slate-700 text-sm">Payment submitted to Razorpay, verification in progress</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-200 text-green-700 font-semibold">3</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Active</h3>
                  <p className="text-slate-700 text-sm">Payment verified, server/service activated for user</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-200 text-yellow-700 font-semibold">4</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Renewal or Completion</h3>
                  <p className="text-slate-700 text-sm">Billing cycle ends, renews or completes based on user action</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-200 text-red-700 font-semibold">5</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Cancelled/Expired</h3>
                  <p className="text-slate-700 text-sm">Order cancelled by user or expired</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Scenarios */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Order Scenarios</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-cyan-500" />
                New Customer Purchase
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                <li>Customer registers and logs in</li>
                <li>Browses available plans and addons</li>
                <li>Calculates final price based on country and billing cycle</li>
                <li>Creates order via POST /api/v1/orders</li>
                <li>Redirected to payment page</li>
                <li>Completes Razorpay payment</li>
                <li>Order status updated to "active"</li>
                <li>Server/service provisioned immediately</li>
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-blue-500" />
                Upgrade/Addon Purchase
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                <li>Existing customer views current order details</li>
                <li>Selects upgrade plan or additional addons</li>
                <li>Creates new order with upgraded configuration</li>
                <li>Completes payment for difference</li>
                <li>Old order cancelled, new order activated</li>
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-purple-500" />
                Order Renewal
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                <li>Existing order approaches expiration</li>
                <li>System sends renewal reminder email</li>
                <li>Customer creates new order for same plan/addons</li>
                <li>Completes payment</li>
                <li>Service continues without interruption</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Process Payments</h2>
          <p className="text-slate-700 mb-6">
            After creating an order, use the Payments API to process payment through Razorpay.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/payments"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Payments API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
