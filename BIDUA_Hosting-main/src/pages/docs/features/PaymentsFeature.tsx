import { DocLayout } from '../../../components/docs/DocLayout';
import { CreditCard, Lock, Check, AlertCircle, Zap } from 'lucide-react';

export function PaymentsFeature() {
  return (
    <DocLayout
      title="Payment Gateway Integration"
      description="Guide to payment processing and gateway integrations"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Payment Gateway' }
      ]}
      prevPage={{ title: 'Billing & Invoicing', path: '/docs/features/billing' }}
      nextPage={{ title: 'Support System', path: '/docs/features/support' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting integrates with multiple payment gateways to provide secure, reliable, and convenient payment processing. Our systems support various payment methods and currencies worldwide.
          </p>
        </section>

        {/* Payment Gateways */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Integrated Payment Gateways</h2>

          <div className="space-y-6 my-6">
            {/* Razorpay */}
            <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-cyan-400 transition">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Razorpay</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Leading payment gateway for Indian and global transactions</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Supported Methods:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Credit Cards</li>
                      <li>• Debit Cards</li>
                      <li>• Net Banking</li>
                      <li>• UPI</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Features:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Instant Processing</li>
                      <li>• 24/7 Support</li>
                      <li>• Fraud Protection</li>
                      <li>• Multiple Currencies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe */}
            <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-cyan-400 transition">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Stripe</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Global payment processing for international customers</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Supported Methods:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Credit Cards</li>
                      <li>• Debit Cards</li>
                      <li>• ACH Transfer</li>
                      <li>• Apple Pay</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Features:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Global Coverage</li>
                      <li>• Recurring Billing</li>
                      <li>• Advanced Fraud Detection</li>
                      <li>• PCI Compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-cyan-400 transition">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">PayPal</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Popular digital payment platform with global reach</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Supported Methods:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• PayPal Balance</li>
                      <li>• Linked Cards</li>
                      <li>• Bank Accounts</li>
                      <li>• Local Wallets</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Features:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Buyer Protection</li>
                      <li>• Easy Setup</li>
                      <li>• Widely Trusted</li>
                      <li>• Multiple Currencies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptocurrency */}
            <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-cyan-400 transition">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Cryptocurrency (Coinbase)</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Decentralized payment option using blockchain technology</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Supported Coins:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Bitcoin (BTC)</li>
                      <li>• Ethereum (ETH)</li>
                      <li>• USDC</li>
                      <li>• USDT</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-2">Features:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Instant Settlement</li>
                      <li>• Lower Fees</li>
                      <li>• Privacy Focused</li>
                      <li>• Global Access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Payment Methods</h2>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Payment Method</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Gateway</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Processing Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Credit Card</td>
                  <td className="px-4 py-3 text-slate-600">Razorpay, Stripe</td>
                  <td className="px-4 py-3 text-slate-600">Instant</td>
                  <td className="px-4 py-3 text-slate-600">2.36%</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Debit Card</td>
                  <td className="px-4 py-3 text-slate-600">Razorpay, Stripe</td>
                  <td className="px-4 py-3 text-slate-600">Instant</td>
                  <td className="px-4 py-3 text-slate-600">1.42%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Net Banking</td>
                  <td className="px-4 py-3 text-slate-600">Razorpay</td>
                  <td className="px-4 py-3 text-slate-600">1-2 hours</td>
                  <td className="px-4 py-3 text-slate-600">Fixed</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">UPI</td>
                  <td className="px-4 py-3 text-slate-600">Razorpay</td>
                  <td className="px-4 py-3 text-slate-600">Instant</td>
                  <td className="px-4 py-3 text-slate-600">Free</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">PayPal</td>
                  <td className="px-4 py-3 text-slate-600">PayPal</td>
                  <td className="px-4 py-3 text-slate-600">Instant</td>
                  <td className="px-4 py-3 text-slate-600">3.49%</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Bank Transfer</td>
                  <td className="px-4 py-3 text-slate-600">Direct</td>
                  <td className="px-4 py-3 text-slate-600">1-3 days</td>
                  <td className="px-4 py-3 text-slate-600">Free</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Bitcoin</td>
                  <td className="px-4 py-3 text-slate-600">Coinbase</td>
                  <td className="px-4 py-3 text-slate-600">10-30 min</td>
                  <td className="px-4 py-3 text-slate-600">1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Security</h2>

          <p className="text-slate-600 mb-6">
            All payments are processed securely with industry-standard encryption and fraud protection:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Lock,
                title: 'PCI DSS Compliance',
                description: 'Payment Card Industry Data Security Standard compliance'
              },
              {
                icon: Check,
                title: 'SSL Encryption',
                description: '256-bit SSL encryption for all transactions'
              },
              {
                icon: AlertCircle,
                title: 'Fraud Detection',
                description: '3D Secure and advanced fraud prevention systems'
              },
              {
                icon: Zap,
                title: 'Tokenization',
                description: 'Card details are tokenized and never stored in plain text'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-slate-700">
              Your payment information is never stored on our servers. We use tokenized payments that securely transmit data to payment gateways and back.
            </p>
          </div>
        </section>

        {/* Checkout Flow */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Checkout Flow</h2>

          <ol className="space-y-6 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Review Your Order</p>
                <p className="text-slate-600">Confirm plan details, add-ons, billing cycle, and total amount</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Verify Your Information</p>
                <p className="text-slate-600">Provide billing and contact information</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Select Payment Method</p>
                <p className="text-slate-600">Choose your preferred payment gateway and method</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Payment Details</p>
                <p className="text-slate-600">Provide payment credentials (redirected to secure gateway)</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">Process Payment</p>
                <p className="text-slate-600">Payment gateway processes and verifies transaction</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">6</span>
              <div>
                <p className="font-semibold text-slate-900">Confirmation</p>
                <p className="text-slate-600">Receive confirmation and invoice via email</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Recurring Billing */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Recurring Billing & Subscriptions</h2>

          <p className="text-slate-600 mb-6">
            Set up automatic recurring payments for continuous service without interruption:
          </p>

          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">How It Works</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="font-semibold text-cyan-600">1</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Save Payment Method</p>
                  <p className="text-slate-600">Store your preferred payment method during checkout</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="font-semibold text-cyan-600">2</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Automatic Renewal</p>
                  <p className="text-slate-600">Service automatically renews on each billing date</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="font-semibold text-cyan-600">3</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email Notification</p>
                  <p className="text-slate-600">Receive advance notice before payment is charged</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="font-semibold text-cyan-600">4</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Manage Subscriptions</p>
                  <p className="text-slate-600">Update payment method or cancel anytime from dashboard</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-slate-700">You can disable auto-renewal anytime. Services will be deactivated at the end of the current billing cycle.</p>
          </div>
        </section>

        {/* Invoice Payment */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Invoice Payment Options</h2>

          <p className="text-slate-600 mb-6">
            For existing invoices, you have multiple payment options:
          </p>

          <div className="space-y-4 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Online Payment Link</h3>
              <p className="text-slate-600">Click the payment link in your invoice email to pay immediately</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Dashboard Payment</h3>
              <p className="text-slate-600">Go to Billing section and pay any outstanding invoices</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Bank Transfer</h3>
              <p className="text-slate-600">Use bank transfer details provided in invoice</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Contact Support</h3>
              <p className="text-slate-600">Reach out to discuss payment plans or special arrangements</p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Troubleshooting Payment Issues</h2>

          <div className="space-y-6 my-6">
            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Declined</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Check if card is expired or has insufficient funds</li>
                <li>• Verify billing address matches card records exactly</li>
                <li>• Contact your bank to ensure international transactions are enabled</li>
                <li>• Try a different payment method</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Timeout Error</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Check your internet connection</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Try again using a different browser</li>
                <li>• Wait a few minutes and retry</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Not Reflected</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Check your email for confirmation receipt</li>
                <li>• Wait 24 hours for processing</li>
                <li>• Check your bank statement for transaction</li>
                <li>• Contact support with transaction ID</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Save your payment method for faster checkout on future purchases</li>
              <li>• Use a payment method from the same country as your billing address</li>
              <li>• Inform your bank before making international payments</li>
              <li>• Keep your invoice and payment confirmation for records</li>
              <li>• Set calendar reminders for renewal dates</li>
              <li>• Contact support immediately if you spot unauthorized charges</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
