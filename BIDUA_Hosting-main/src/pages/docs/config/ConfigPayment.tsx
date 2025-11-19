import { DocLayout } from '../../../components/docs/DocLayout';
import { CreditCard, Settings } from 'lucide-react';

export function ConfigPayment() {
  return (
    <DocLayout
      title="Payment Gateway Setup"
      description="Configure payment gateways (Stripe, Razorpay, etc)"
      breadcrumbs={[
        { label: 'Configuration', path: '/docs/config' },
        { label: 'Payment Gateways' }
      ]}
      prevPage={{ title: 'Environment Variables', path: '/docs/config/env' }}
      nextPage={{ title: 'Email Configuration', path: '/docs/config/email' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Gateway Configuration</h2>
          <p className="text-slate-600 mb-4">Setup and configure payment processing gateways for BIDUA Hosting.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Stripe Setup</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Create Stripe Account</p>
                <p className="text-slate-600 text-sm">Visit stripe.com and register</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Get API Keys</p>
                <p className="text-slate-600 text-sm">Dashboard → API Keys → Copy keys</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Add to Environment</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs mt-2 overflow-x-auto">
                  <p>STRIPE_PUBLIC_KEY=pk_live_xxxxx</p>
                  <p>STRIPE_SECRET_KEY=sk_live_xxxxx</p>
                  <p>STRIPE_WEBHOOK_SECRET=whsec_xxxxx</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Setup Webhooks</p>
                <p className="text-slate-600 text-sm">Stripe Dashboard → Webhooks → Add endpoint</p>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">Webhook Events to Listen</h3>
          <ul className="space-y-1 text-slate-600 mb-6">
            <li>• payment_intent.succeeded</li>
            <li>• payment_intent.payment_failed</li>
            <li>• customer.subscription.updated</li>
            <li>• charge.refunded</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Razorpay Setup</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Create Razorpay Account</p>
                <p className="text-slate-600 text-sm">Visit razorpay.com and sign up</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Get Credentials</p>
                <p className="text-slate-600 text-sm">Settings → API Keys</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Add Environment Variables</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs mt-2 overflow-x-auto">
                  <p>RAZORPAY_KEY_ID=key_id_here</p>
                  <p>RAZORPAY_KEY_SECRET=key_secret_here</p>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">PayPal Setup</h2>
          <ol className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span>Create Developer Account on developer.paypal.com</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span>Create Sandbox and Live Apps</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span>Get Client ID and Secret</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span>Add to environment: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Testing Payments</h2>
          <div className="space-y-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Stripe Test Cards</h3>
              <div className="space-y-1 text-slate-600 text-sm font-mono">
                <p>Success: 4242 4242 4242 4242</p>
                <p>Decline: 4000 0000 0000 0002</p>
                <p>3D Secure: 4000 0025 0000 3010</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Razorpay Test Mode</h3>
              <p className="text-slate-600 text-sm">Use test keys from Razorpay dashboard for testing</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Webhook Setup</h2>
          <div className="border border-slate-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Configure Webhook Endpoint</h3>
            <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs overflow-x-auto">
              <p>https://api.biduahosting.com/webhooks/stripe</p>
              <p>https://api.biduahosting.com/webhooks/razorpay</p>
              <p>https://api.biduahosting.com/webhooks/paypal</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">Webhook Events to Handle</h3>
          <div className="space-y-2 text-slate-600 text-sm">
            <p>• Payment Success → Create Order</p>
            <p>• Payment Failed → Send Notification</p>
            <p>• Refund Processed → Update Order Status</p>
            <p>• Subscription Updated → Update Billing</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Variables Summary</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <div className="space-y-2 text-sm font-mono text-slate-600">
              <p># Stripe</p>
              <p>STRIPE_PUBLIC_KEY=pk_live_xxxxx</p>
              <p>STRIPE_SECRET_KEY=sk_live_xxxxx</p>
              <p>STRIPE_WEBHOOK_SECRET=whsec_xxxxx</p>
              <p></p>
              <p># Razorpay</p>
              <p>RAZORPAY_KEY_ID=xxxxx</p>
              <p>RAZORPAY_KEY_SECRET=xxxxx</p>
              <p></p>
              <p># PayPal</p>
              <p>PAYPAL_CLIENT_ID=xxxxx</p>
              <p>PAYPAL_CLIENT_SECRET=xxxxx</p>
              <p>PAYPAL_MODE=live</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Never hardcode payment keys in code</li>
              <li>• Use test keys for development</li>
              <li>• Validate webhook signatures</li>
              <li>• Implement idempotency for retries</li>
              <li>• Log all payment transactions</li>
              <li>• Monitor payment failures</li>
              <li>• Rotate keys regularly</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
