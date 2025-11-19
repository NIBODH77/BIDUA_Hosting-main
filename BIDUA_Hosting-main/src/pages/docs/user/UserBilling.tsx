import { DocLayout } from '../../../components/docs/DocLayout';
import { CreditCard, FileText, Bell, DollarSign, AlertCircle } from 'lucide-react';

export function UserBilling() {
  return (
    <DocLayout
      title="Billing & Payments"
      description="Guide to managing billing, invoices, and payments"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'Billing & Payments' }
      ]}
      prevPage={{ title: 'Managing Servers', path: '/docs/user/servers' }}
      nextPage={{ title: 'Using Support', path: '/docs/user/support' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Manage your billing and payments from your account dashboard. View invoices, update payment methods, and track your account balance.
          </p>
        </section>

        {/* Billing Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessing Billing Information</h2>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Log into your account</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Click "Billing" or "Account" from sidebar</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">View your billing dashboard</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Dashboard Overview</h3>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Account Balance', value: '$0.00', icon: DollarSign },
                { label: 'Next Invoice Date', value: 'Dec 15, 2024', icon: Bell },
                { label: 'Renewal Status', value: 'Active', icon: CreditCard }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-3">
                    <Icon className="h-5 w-5 text-cyan-500 mb-2" />
                    <p className="text-slate-600 text-sm">{item.label}</p>
                    <p className="font-bold text-slate-900">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Invoices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Invoices</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Viewing Invoices</h3>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Billing → Invoices</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">See list of all invoices with dates and amounts</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Click on invoice to view or download PDF</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h3>

          <div className="border border-slate-200 rounded-lg p-6 bg-white mb-6">
            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Invoice Number:</span>
                <span className="font-mono font-semibold">INV-2024-001234</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Invoice Date:</span>
                <span>November 15, 2024</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Billing Period:</span>
                <span>Nov 15 - Dec 14, 2024</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Due Date:</span>
                <span className="font-semibold">December 15, 2024</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Amount Due:</span>
                <span className="font-bold text-cyan-500">$130.90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">Paid</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Downloading Invoices</h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm mb-3">Each invoice has download options:</p>
            <ul className="space-y-1 text-blue-900 text-sm">
              <li>• PDF - Standard format for printing</li>
              <li>• CSV - For spreadsheet analysis</li>
              <li>• Email - Send invoice to email</li>
            </ul>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Methods</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Adding Payment Method</h3>

          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Billing Settings</p>
                <p className="text-slate-600 text-sm">Billing → Payment Methods</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Click "Add Payment Method"</p>
                <p className="text-slate-600 text-sm">Choose payment type</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Payment Details</p>
                <p className="text-slate-600 text-sm">Card info, PayPal account, etc.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Verify & Save</p>
                <p className="text-slate-600 text-sm">Method is now available for payments</p>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Methods Supported</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { method: 'Credit Card', badge: 'Visa, Mastercard, Amex' },
              { method: 'Debit Card', badge: 'All major debit cards' },
              { method: 'PayPal', badge: 'Instant processing' },
              { method: 'Bank Transfer', badge: '1-3 days' },
              { method: 'Cryptocurrency', badge: 'Bitcoin, Ethereum' },
              { method: 'Google Pay', badge: 'Mobile payment' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <CreditCard className="h-5 w-5 text-cyan-500" />
                <div className="flex-1 ml-3">
                  <p className="font-semibold text-slate-900">{item.method}</p>
                  <p className="text-slate-600 text-sm">{item.badge}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Making Payments */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Making Payments</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pay Outstanding Invoice</h3>

          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Invoices</p>
                <p className="text-slate-600 text-sm">View your unpaid invoices</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Click "Pay Now"</p>
                <p className="text-slate-600 text-sm">On the invoice you want to pay</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Select Payment Method</p>
                <p className="text-slate-600 text-sm">Choose from saved methods</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Confirm Payment</p>
                <p className="text-slate-600 text-sm">Review amount and process</p>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Automatic Payments</h3>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <p className="text-slate-600 mb-4">
              Enable automatic payments to ensure your services never get interrupted:
            </p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-900 mb-2">Setting Up Auto-Pay</p>
                <ol className="space-y-1 text-slate-600 text-sm ml-4">
                  <li>1. Go to Billing → Auto-Renewal</li>
                  <li>2. Toggle "Enable Auto-Pay"</li>
                  <li>3. Select payment method</li>
                  <li>4. Confirm and save</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold text-slate-900 mb-2">Auto-Pay Benefits</p>
                <ul className="space-y-1 text-slate-600 text-sm">
                  <li>• Never worry about missed payments</li>
                  <li>• Service continues uninterrupted</li>
                  <li>• Automatic renewal before expiration</li>
                  <li>• Email notification before charging</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Account Balance */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Balance & Credits</h2>

          <p className="text-slate-600 mb-6">
            View your account balance and use credits towards future purchases:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Credit Sources</h3>

          <div className="space-y-3 mb-6">
            {[
              { source: 'Referral Earnings', amount: '+$45.00', date: 'Oct 10, 2024' },
              { source: 'Promotional Code', amount: '+$25.00', date: 'Sep 5, 2024' },
              { source: 'Refund', amount: '+$50.00', date: 'Aug 20, 2024' },
              { source: 'Service Usage', amount: '-$130.90', date: 'Nov 15, 2024' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">{item.source}</p>
                  <p className="text-slate-600 text-sm">{item.date}</p>
                </div>
                <span className={`font-bold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Current Balance:</span>
              <span className="text-2xl font-bold text-cyan-500">$10.90</span>
            </div>
          </div>
        </section>

        {/* Billing Notifications */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Billing Notifications</h2>

          <p className="text-slate-600 mb-6">
            Configure when and how you receive billing notifications:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Types</h3>

          <div className="space-y-3 mb-6">
            {[
              { type: 'Invoice Generated', enabled: true },
              { type: 'Payment Due Reminder', enabled: true },
              { type: 'Payment Processed', enabled: true },
              { type: 'Renewal Reminder', enabled: true },
              { type: 'Billing Changes', enabled: true },
              { type: 'Marketing Offers', enabled: false }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-600">{item.type}</span>
                <div className={`w-12 h-6 rounded-full ${item.enabled ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Setting Preferences</h3>

          <ol className="space-y-2 text-slate-600 mb-6">
            <li>1. Go to Settings → Notifications</li>
            <li>2. Find "Billing Notifications" section</li>
            <li>3. Toggle each notification type on/off</li>
            <li>4. Choose delivery method (email, SMS)</li>
            <li>5. Set preferred time for notifications</li>
            <li>6. Save preferences</li>
          </ol>
        </section>

        {/* Payment Issues */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Troubleshooting Payment Issues</h2>

          <div className="space-y-4 mb-6">
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Payment Declined</span>
              </h3>
              <ul className="space-y-1 text-red-800 text-sm">
                <li>• Check card details and expiration date</li>
                <li>• Ensure sufficient funds available</li>
                <li>• Verify billing address matches card</li>
                <li>• Contact your bank to enable international transactions</li>
                <li>• Try a different payment method</li>
              </ul>
            </div>

            <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Payment Processing Timeout</span>
              </h3>
              <ul className="space-y-1 text-orange-800 text-sm">
                <li>• Check internet connection</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Try again in a different browser</li>
                <li>• Wait a few minutes before retrying</li>
                <li>• Contact support if issue persists</li>
              </ul>
            </div>

            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Payment Not Reflected</span>
              </h3>
              <ul className="space-y-1 text-yellow-800 text-sm">
                <li>• Check email for payment confirmation</li>
                <li>• Wait 24 hours for processing</li>
                <li>• Check bank statement for transaction</li>
                <li>• Contact support with transaction ID</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Taxes & Compliance */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Taxes & Compliance</h2>

          <p className="text-slate-600 mb-6">
            Tax information and compliance documentation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Tax Invoice</h3>
              <p className="text-slate-600 text-sm mb-3">Download tax invoice for accounting purposes</p>
              <button className="px-3 py-1 bg-cyan-500 text-white rounded text-sm">Download Tax Invoice</button>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Tax Exemption</h3>
              <p className="text-slate-600 text-sm mb-3">Request tax exemption for your organization</p>
              <button className="px-3 py-1 bg-slate-300 text-slate-700 rounded text-sm">Request Exemption</button>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Update Tax Information</h3>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <ol className="space-y-2 text-slate-600 text-sm">
              <li>1. Go to Billing → Tax Settings</li>
              <li>2. Enter your VAT/Tax ID number</li>
              <li>3. Update billing address</li>
              <li>4. Specify business type</li>
              <li>5. Save changes</li>
            </ol>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Enable auto-renewal to avoid service interruption</li>
              <li>• Keep payment method updated</li>
              <li>• Review invoices for accuracy</li>
              <li>• Set up billing reminders</li>
              <li>• Archive invoices for tax purposes</li>
              <li>• Contact support for billing questions</li>
              <li>• Use promo codes for savings</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
