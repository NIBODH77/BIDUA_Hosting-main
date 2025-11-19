import { DocLayout } from '../../../components/docs/DocLayout';
import { FileText, Clock, AlertCircle, Download, BarChart3 } from 'lucide-react';

export function BillingFeature() {
  return (
    <DocLayout
      title="Billing & Invoicing"
      description="Complete guide to billing, invoicing, and financial management"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Billing & Invoicing' }
      ]}
      prevPage={{ title: 'Add-ons System', path: '/docs/features/addons' }}
      nextPage={{ title: 'Payment Gateway', path: '/docs/features/payments' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting provides transparent billing with detailed invoices, flexible payment options, and automated billing cycles. Track your expenses and manage your account finances easily from your dashboard.
          </p>
        </section>

        {/* Billing Cycles */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Billing Cycles</h2>

          <p className="text-slate-600 mb-6">
            Choose from flexible billing cycles that suit your needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                cycle: 'Monthly',
                duration: 'Billed every 30 days',
                discount: 'No discount',
                best: false
              },
              {
                cycle: 'Quarterly',
                duration: 'Billed every 90 days',
                discount: '5% discount',
                best: false
              },
              {
                cycle: '6 Months',
                duration: 'Billed every 180 days',
                discount: '10% discount',
                best: false
              },
              {
                cycle: 'Annual',
                duration: 'Billed every 365 days',
                discount: '20% discount',
                best: true
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`border rounded-lg p-6 transition ${
                  item.best
                    ? 'border-cyan-400 bg-cyan-50 ring-2 ring-cyan-200'
                    : 'border-slate-200 hover:border-cyan-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">{item.cycle}</h3>
                  {item.best && (
                    <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                      BEST VALUE
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mb-2">{item.duration}</p>
                <p className="font-semibold text-cyan-500">{item.discount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Auto Renewal */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Auto-Renewal & Expiration</h2>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-slate-700">Services are automatically renewed at the end of each billing cycle unless you opt out</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Renewal Process</h3>

          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Renewal Notice</p>
                <p className="text-slate-600">Email notification 30 days before expiration</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Automatic Charge</p>
                <p className="text-slate-600">Service is automatically renewed using saved payment method</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Continuation</p>
                <p className="text-slate-600">Service continues uninterrupted with new renewal period</p>
              </div>
            </li>
          </ol>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-6">
            <p className="text-slate-700"><strong>Important:</strong> You can disable auto-renewal anytime from your account settings. Services will be deactivated at the end of the current billing cycle.</p>
          </div>
        </section>

        {/* Invoices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Invoices</h2>

          <p className="text-slate-600 mb-6">
            Detailed invoices are generated automatically and available in your account dashboard.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">What's Included in Invoices</h3>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Service Details</p>
                  <p className="text-slate-600">Plan name, billing period, and service dates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Itemized Charges</p>
                  <p className="text-slate-600">Base plan cost, add-ons, and promotional discounts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Tax Information</p>
                  <p className="text-slate-600">Applicable taxes and total amount due</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Payment Details</p>
                  <p className="text-slate-600">Payment status, date paid, and transaction ID</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Accessing Invoices</h3>

          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Dashboard</p>
                <p className="text-slate-600">Navigate to your account dashboard</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Select Billing</p>
                <p className="text-slate-600">Click on Billing or Invoices from the left sidebar</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">View Invoice</p>
                <p className="text-slate-600">Click on any invoice to view or download PDF</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Invoice Sample */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Invoice Sample</h2>

          <div className="border border-slate-300 rounded-lg p-8 bg-white">
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">Invoice</h3>
              <p className="text-slate-600">Invoice #INV-2024-001234</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Bill To:</h4>
                <p className="text-slate-600">John Doe</p>
                <p className="text-slate-600">john@example.com</p>
              </div>
              <div className="text-right">
                <p className="text-slate-600">Invoice Date: Nov 15, 2024</p>
                <p className="text-slate-600">Billing Period: Oct 15 - Nov 15, 2024</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-900">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-900">Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-slate-600">VPS Hosting Plan (2-4 vCore)</td>
                    <td className="px-4 py-3 text-right text-slate-600">1</td>
                    <td className="px-4 py-3 text-right text-slate-600">$30.00</td>
                    <td className="px-4 py-3 text-right text-slate-600">$30.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-600">Premium Support Add-on</td>
                    <td className="px-4 py-3 text-right text-slate-600">1</td>
                    <td className="px-4 py-3 text-right text-slate-600">$79.00</td>
                    <td className="px-4 py-3 text-right text-slate-600">$79.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-600">CDN Integration</td>
                    <td className="px-4 py-3 text-right text-slate-600">1</td>
                    <td className="px-4 py-3 text-right text-slate-600">$10.00</td>
                    <td className="px-4 py-3 text-right text-slate-600">$10.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-48 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900">$119.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (10%):</span>
                  <span className="font-semibold text-slate-900">$11.90</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="text-lg font-bold text-cyan-500">$130.90</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600"><strong>Payment Status:</strong> Paid on Nov 15, 2024</p>
              <p className="text-sm text-slate-600"><strong>Payment Method:</strong> Visa ending in 4242</p>
            </div>
          </div>
        </section>

        {/* Discounts & Promotions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Discounts & Promotions</h2>

          <p className="text-slate-600 mb-6">
            We offer various discounts to help you save on hosting costs:
          </p>

          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Bulk Billing Discount</h3>
              <p className="text-slate-600 mb-3">Extended billing cycles offer significant savings:</p>
              <ul className="space-y-1 text-slate-600">
                <li>• Monthly: No discount</li>
                <li>• Quarterly: 5% discount</li>
                <li>• 6 Months: 10% discount</li>
                <li>• Annual: 20% discount</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-2">First Purchase Discount</h3>
              <p className="text-slate-600">New customers receive 15% off their first billing cycle when signing up</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Referral Rewards</h3>
              <p className="text-slate-600">Earn account credits by referring friends. Each successful referral earns you $10 credit</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Promotional Codes</h3>
              <p className="text-slate-600">We regularly offer promotional codes via email and social media. Apply during checkout to get instant discounts</p>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Accepted Payment Methods</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              'Credit Cards (Visa, Mastercard, American Express)',
              'Debit Cards',
              'PayPal',
              'Bank Transfer',
              'Cryptocurrency (Bitcoin, Ethereum)',
              'Google Pay'
            ].map((method, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-slate-600">{method}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Issues */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Issues</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">If Payment Fails</h3>

            <ol className="space-y-4">
              <li className="flex items-start space-x-4">
                <span className="font-bold text-red-500">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Check Payment Method</p>
                  <p className="text-slate-600">Verify card details, expiration date, and billing address</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="font-bold text-red-500">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Update Payment Details</p>
                  <p className="text-slate-600">Go to Billing Settings and update your payment method</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="font-bold text-red-500">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Retry Payment</p>
                  <p className="text-slate-600">Click retry on the failed invoice or contact support</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-slate-700"><strong>Note:</strong> Services may be suspended after 7 days of failed payment. Contact support immediately if you're experiencing payment issues.</p>
          </div>
        </section>

        {/* Refunds */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Refund Policy</h2>

          <div className="border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">30-Day Money Back Guarantee</h3>
              <p className="text-slate-600">We offer a 30-day full refund policy on new accounts if you're not satisfied</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pro-rata Refunds</h3>
              <p className="text-slate-600">Unused portion of your billing cycle is credited back to your account upon cancellation</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Refund Process</h3>
              <p className="text-slate-600">Refunds are processed within 5-10 business days to the original payment method</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Exceptions</h3>
              <p className="text-slate-600">Refunds may not apply to add-ons, premium services, or services used beyond 30 days</p>
            </div>
          </div>
        </section>

        {/* Tax Information */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tax Information</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
            <p className="text-slate-600">
              Tax is calculated and applied based on your location and service type. Different regions may have different tax requirements.
            </p>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">VAT/GST</h3>
              <p className="text-slate-600">Applicable to customers in countries with VAT/GST regulations</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Tax Exemption</h3>
              <p className="text-slate-600">Non-profit and educational institutions can apply for tax exemption status</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Tax Documents</h3>
              <p className="text-slate-600">Tax invoices and receipts are automatically generated and available for download</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Annual billing provides the best value with 20% discount</li>
              <li>• Save your payment method for automatic renewals</li>
              <li>• Download and archive invoices for accounting purposes</li>
              <li>• Set up billing alerts to stay informed about upcoming charges</li>
              <li>• Use promotional codes during checkout for additional savings</li>
              <li>• Review your invoice details for accuracy before payment</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
