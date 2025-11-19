import { DocLayout } from '../../../components/docs/DocLayout';
import { CreditCard, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export function PaymentsAPI() {
  return (
    <DocLayout
      title="Payments API"
      description="API documentation for payment processing via Razorpay integration."
      breadcrumbs={[{ label: 'API' }, { label: 'Payments' }]}
      prevPage={{ title: 'Orders API', path: '/docs/api/orders' }}
      nextPage={{ title: 'Servers API', path: '/docs/api/servers' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payments API Overview</h2>
          <p className="text-slate-700 mb-4">
            The Payments API integrates with Razorpay for secure payment processing. All payments are PCI-DSS compliant and support multiple payment methods.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">Payment Gateway</h3>
              <p className="text-slate-700 text-sm">Razorpay - Leading payment processor in India and Southeast Asia</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Supported Methods</h3>
              <p className="text-slate-700 text-sm">Credit/Debit Cards, NetBanking, UPI, Wallets, International Cards</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Webhooks</h3>
              <p className="text-slate-700 text-sm">Razorpay sends webhooks for payment events - payment.authorized, payment.failed, payment.captured</p>
            </div>
          </div>
        </section>

        {/* Create Payment Order */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Payment Order</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/payments/create-order
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
                <div className="text-slate-700">Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "order_id": 5,
  "amount": 73.16,
  "currency": "INR",
  "description": "VPS Starter - Annual Subscription",
  "customer": {
    "email": "user@example.com",
    "contact": "+919876543210"
  },
  "notify": {
    "sms": true,
    "email": true
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "razorpay_order_id": "order_IluGWxBm9U8zJ8",
  "amount": 7316,
  "amount_paid": 0,
  "amount_due": 7316,
  "currency": "INR",
  "receipt": "ORD-2024-000005",
  "status": "created",
  "attempts": 0,
  "notes": {
    "policy_name": "VPS Starter",
    "user_id": "1"
  },
  "created_at": 1610522400,
  "key_id": "rzp_live_11111111111111"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Usage Notes</h3>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800 text-sm">
                  The returned <code className="bg-blue-100 px-2 py-1 rounded">razorpay_order_id</code> and <code className="bg-blue-100 px-2 py-1 rounded">key_id</code> are used to initialize the Razorpay checkout on the frontend.
                </p>
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
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Order does not exist or user doesn't own this order</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Invalid amount, currency, or order already paid</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verify Payment */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verify Payment</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/payments/verify
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
                <div className="text-slate-700">Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "razorpay_payment_id": "pay_IluGWxBm9U8zJ8",
  "razorpay_order_id": "order_IluGWxBm9U8zJ8",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How to Get Signature</h3>
              <p className="text-slate-700 text-sm mb-3">
                After successful Razorpay payment, use the response data to create a signature for verification:
              </p>
              <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">{`// Frontend (JavaScript)
const crypto = require('crypto');

const signature = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(order_id + '|' + payment_id)
  .digest('hex');`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "id": 5,
    "order_number": "ORD-2024-000005",
    "order_status": "active",
    "payment_status": "paid",
    "grand_total": 73.16,
    "razorpay_payment_id": "pay_IluGWxBm9U8zJ8",
    "paid_at": "2024-01-15T10:45:00Z"
  },
  "invoice": {
    "id": 5,
    "invoice_number": "INV-2024-000005",
    "download_url": "/api/v1/invoices/5/download"
  }
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
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Invalid signature - payment verification failed</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Order or payment not found in system</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Payment Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Payment Details</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/payments/{'{razorpay_payment_id}'}
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
  "id": "pay_IluGWxBm9U8zJ8",
  "entity": "payment",
  "amount": 7316,
  "currency": "INR",
  "status": "captured",
  "method": "card",
  "description": "VPS Starter - Annual Subscription",
  "email": "user@example.com",
  "contact": "+919876543210",
  "order_id": "order_IluGWxBm9U8zJ8",
  "invoice_id": null,
  "international": false,
  "method": "netbanking",
  "receipt": "ORD-2024-000005",
  "acquirer_data": {
    "auth_code": "000000"
  },
  "fee": 200,
  "tax": 0,
  "notes": {},
  "fee_details": null,
  "error_code": null,
  "error_description": null,
  "error_source": null,
  "error_reason": null,
  "error_step": null,
  "error_field": null,
  "acquirer_data": null,
  "created_at": 1610522400
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Flow Diagram */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Flow</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500">
                <h3 className="font-semibold text-slate-900 mb-2">1. Create Order (Backend)</h3>
                <p className="text-slate-700 text-sm">POST /api/v1/orders creates order with grand_total</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 mb-2">2. Create Payment Order (Backend)</h3>
                <p className="text-slate-700 text-sm">POST /api/v1/payments/create-order returns razorpay_order_id</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-semibold text-slate-900 mb-2">3. Initialize Checkout (Frontend)</h3>
                <p className="text-slate-700 text-sm">Use Razorpay.js with order_id and key_id to show payment modal</p>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500">
                <h3 className="font-semibold text-slate-900 mb-2">4. User Completes Payment (Razorpay)</h3>
                <p className="text-slate-700 text-sm">Customer selects payment method and completes transaction</p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-slate-900 mb-2">5. Verify Payment (Frontend)</h3>
                <p className="text-slate-700 text-sm">POST /api/v1/payments/verify with payment_id and signature</p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-lg p-4 border-l-4 border-orange-500">
                <h3 className="font-semibold text-slate-900 mb-2">6. Order Activated (Backend)</h3>
                <p className="text-slate-700 text-sm">Order status changed to "active", server/service provisioned</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Security Best Practices</h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Do's
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Always verify payment signature on backend before updating order</li>
                <li>• Store payment_id and order_id for audit trail</li>
                <li>• Use HTTPS for all payment endpoints</li>
                <li>• Keep Razorpay API keys secure in environment variables</li>
                <li>• Implement idempotency for payment verification to handle retries</li>
                <li>• Log all payment transactions for compliance</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Don'ts
              </h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Never expose Razorpay SECRET_KEY in frontend code</li>
                <li>• Don't trust payment status from frontend alone</li>
                <li>• Never process payment without signature verification</li>
                <li>• Avoid storing credit card information - use Razorpay tokens</li>
                <li>• Don't skip webhook verification for async payments</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Webhooks</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <p className="text-slate-700">
              Razorpay sends webhooks to your configured webhook URL for payment events. Handle these asynchronously:
            </p>

            <div className="bg-slate-50 rounded p-4 space-y-3">
              <div>
                <strong className="text-slate-900">payment.authorized</strong>
                <p className="text-slate-700 text-sm">Payment has been authorized but not yet captured</p>
              </div>
              <div>
                <strong className="text-slate-900">payment.captured</strong>
                <p className="text-slate-700 text-sm">Payment successfully captured - update order status to active</p>
              </div>
              <div>
                <strong className="text-slate-900">payment.failed</strong>
                <p className="text-slate-700 text-sm">Payment failed - update order status and notify customer</p>
              </div>
              <div>
                <strong className="text-slate-900">refund.created</strong>
                <p className="text-slate-700 text-sm">Refund has been initiated</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Webhook Verification</h3>
              <p className="text-slate-700 text-sm mb-2">Always verify webhook signature:</p>
              <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">{`const crypto = require('crypto');

const signature = req.headers['x-razorpay-signature'];
const body = req.body;

const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(body))
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid webhook signature');
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Servers</h2>
          <p className="text-slate-700 mb-6">
            After payment is verified, explore the Servers API to manage server resources.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/servers"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Servers API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
