import { DocLayout } from '../../../components/docs/DocLayout';
import { DollarSign, CreditCard, Zap, CheckCircle2 } from 'lucide-react';

export function ReferralsPayouts() {
  return (
    <DocLayout
      title="Payout Management & Withdrawals"
      description="Learn how to request and manage your commission payouts"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Referral Program', path: '/docs/features/referrals' },
        { label: 'Payout Management' }
      ]}
      prevPage={{ title: 'Commission Structure', path: '/docs/features/referrals-commission' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payout Overview</h2>
          <p className="text-slate-700 mb-4">
            Once your commissions are approved, you can request payouts via multiple methods. We handle all transfers securely and provide tracking for every payout.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-900 font-bold text-lg">$50+</p>
              <p className="text-blue-700 text-sm">Minimum payout amount</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-900 font-bold text-lg">4 Methods</p>
              <p className="text-green-700 text-sm">Multiple payout options</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <p className="text-purple-900 font-bold text-lg">3-7 Days</p>
              <p className="text-purple-700 text-sm">Average processing time</p>
            </div>
          </div>
        </section>

        {/* Payout Methods */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payout Methods</h2>

          <div className="space-y-6">
            {/* Bank Transfer */}
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Bank Transfer</h3>
                  <p className="text-slate-600 text-sm mb-4">Direct transfer to your bank account via SWIFT or ACH</p>

                  <div className="space-y-3 mb-4">
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Processing Time:</span> 5-10 business days</p>
                    </div>
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Fee:</span> $5 USD per transfer</p>
                    </div>
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Supported Countries:</span> 195+ countries</p>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm font-semibold mb-3">Required Information:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• Account holder full name</li>
                    <li>• Account number</li>
                    <li>• Bank name</li>
                    <li>• SWIFT code or Routing number</li>
                    <li>• Account type (Checking/Savings)</li>
                    <li>• Bank country</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-white border-2 border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">PayPal</h3>
                  <p className="text-slate-600 text-sm mb-4">Instant transfer to your PayPal account</p>

                  <div className="space-y-3 mb-4">
                    <div className="bg-yellow-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Processing Time:</span> 1-3 business days</p>
                    </div>
                    <div className="bg-yellow-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Fee:</span> Free (no platform fees)</p>
                    </div>
                    <div className="bg-yellow-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Fastest Option:</span> Yes</p>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm font-semibold mb-3">Required Information:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• PayPal registered email</li>
                    <li>• PayPal account must be verified</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                    <p className="text-yellow-800 text-sm">💡 Recommended for fastest payouts and minimal fees</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptocurrency */}
            <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Cryptocurrency</h3>
                  <p className="text-slate-600 text-sm mb-4">Receive earnings in Bitcoin, Ethereum, or USDT</p>

                  <div className="space-y-3 mb-4">
                    <div className="bg-purple-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Processing Time:</span> Instant (blockchain confirmation may vary)</p>
                    </div>
                    <div className="bg-purple-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Fee:</span> Variable (network fees apply)</p>
                    </div>
                    <div className="bg-purple-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Supported Coins:</span> BTC, ETH, USDT, USDC</p>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm font-semibold mb-3">Required Information:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• Cryptocurrency wallet address</li>
                    <li>• Coin type (BTC, ETH, USDT, etc.)</li>
                  </ul>

                  <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-4">
                    <p className="text-purple-800 text-sm">💡 Best for tech-savvy users and international transfers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Credit */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Account Credit (Cash Back)</h3>
                  <p className="text-slate-600 text-sm mb-4">Use earnings as credit toward your hosting purchases</p>

                  <div className="space-y-3 mb-4">
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Processing Time:</span> Immediate (instant credit)</p>
                    </div>
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Fee:</span> Free (no fees)</p>
                    </div>
                    <div className="bg-green-50 rounded p-3">
                      <p className="text-sm text-slate-600"><span className="font-semibold">Use Cases:</span> Reduce hosting bills, upgrade services</p>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm font-semibold mb-3">How It Works:</p>
                  <p className="text-slate-600 text-sm ml-4">Credit is instantly applied to your account and automatically used to pay your next invoice. Excess credit carries over to future billing periods.</p>

                  <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                    <p className="text-green-800 text-sm">💡 Best for active users who want to reduce hosting costs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payout Process */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Request a Payout</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <p className="font-semibold text-slate-900">Check Your Balance</p>
                <p className="text-slate-600 text-sm">Go to Dashboard → Referrals → Earnings. Ensure you have at least $50 available (approved commissions only).</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <p className="font-semibold text-slate-900">Click "Request Payout"</p>
                <p className="text-slate-600 text-sm">Locate the payout request button in your Earnings section.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <p className="font-semibold text-slate-900">Select Payout Method</p>
                <p className="text-slate-600 text-sm">Choose your preferred payout method: Bank Transfer, PayPal, Cryptocurrency, or Account Credit.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">4</div>
              <div>
                <p className="font-semibold text-slate-900">Enter Payment Details</p>
                <p className="text-slate-600 text-sm">Provide required information based on selected method (bank details, PayPal email, wallet address, etc.).</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">5</div>
              <div>
                <p className="font-semibold text-slate-900">Enter Payout Amount</p>
                <p className="text-slate-600 text-sm">Specify amount to withdraw (must be $50+ and not exceed your approved balance).</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">6</div>
              <div>
                <p className="font-semibold text-slate-900">Review & Confirm</p>
                <p className="text-slate-600 text-sm">Double-check all details and confirm the payout request.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">7</div>
              <div>
                <p className="font-semibold text-slate-900">Wait for Processing</p>
                <p className="text-slate-600 text-sm">Payout is processed according to method timeline (1-10 business days). You'll receive email confirmation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payout Status */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payout Status Tracking</h2>

          <div className="space-y-3 mb-6">
            <div className="border border-yellow-200 bg-yellow-50 rounded p-4">
              <p className="font-semibold text-yellow-900 mb-1">📋 Pending</p>
              <p className="text-yellow-800 text-sm">Payout request submitted. Awaiting processing. Check your email for confirmation.</p>
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded p-4">
              <p className="font-semibold text-blue-900 mb-1">⏳ Processing</p>
              <p className="text-blue-800 text-sm">Payout being processed by our payment processor. Funds will be sent to your payment method.</p>
            </div>

            <div className="border border-green-200 bg-green-50 rounded p-4">
              <p className="font-semibold text-green-900 mb-1">✅ Completed</p>
              <p className="text-green-800 text-sm">Payout successfully transferred. Check your bank/PayPal/wallet account for funds.</p>
            </div>

            <div className="border border-red-200 bg-red-50 rounded p-4">
              <p className="font-semibold text-red-900 mb-1">❌ Failed</p>
              <p className="text-red-800 text-sm">Payout failed (invalid details, account closed, etc.). Update payment info and resubmit.</p>
            </div>
          </div>

          <p className="text-slate-700 mb-4">Track all payouts in your Dashboard → Referrals → Payout History. Each entry shows:</p>

          <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
            <p className="text-slate-600">• <strong>Payout ID</strong> - Unique reference number</p>
            <p className="text-slate-600">• <strong>Amount</strong> - USD equivalent</p>
            <p className="text-slate-600">• <strong>Method</strong> - Selected payout method</p>
            <p className="text-slate-600">• <strong>Status</strong> - Current processing status</p>
            <p className="text-slate-600">• <strong>Requested Date</strong> - When you submitted request</p>
            <p className="text-slate-600">• <strong>Completion Date</strong> - When payout was completed (if applicable)</p>
            <p className="text-slate-600">• <strong>Tracking ID</strong> - Bank/payment processor tracking number</p>
          </div>
        </section>

        {/* Payment Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Updating Payment Methods</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">How to Update Your Payment Details</h3>

            <ol className="space-y-4">
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Dashboard Settings</p>
                  <p className="text-slate-600 text-sm">Go to Dashboard → Settings → Payment Methods</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Add or Edit</p>
                  <p className="text-slate-600 text-sm">Click "Add New Payment Method" or edit existing one</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Enter Details</p>
                  <p className="text-slate-600 text-sm">Provide accurate payment information for your chosen method</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold text-slate-900">Verify & Save</p>
                  <p className="text-slate-600 text-sm">Some methods require verification (email confirmation, small deposit test, etc.)</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800 text-sm"><strong>Tip:</strong> Update payment details before requesting payout to avoid delays. Keep information current!</p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payout FAQ</h2>

          <div className="space-y-4">
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">How long does payout take?</summary>
              <p className="text-slate-600 text-sm mt-2">Processing times vary by method: PayPal (1-3 days), Bank Transfer (5-10 days), Crypto (instant), Account Credit (immediate).</p>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">Is there a minimum payout amount?</summary>
              <p className="text-slate-600 text-sm mt-2">Yes, minimum is $50 USD. Only approved commissions count toward this minimum.</p>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">Can I payout to multiple accounts?</summary>
              <p className="text-slate-600 text-sm mt-2">You can maintain multiple payment methods, but each payout goes to one destination per request.</p>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">What if my payout fails?</summary>
              <p className="text-slate-600 text-sm mt-2">Funds are refunded to your account balance. Update your payment details and resubmit. Contact support if needed.</p>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">Can I request multiple payouts per month?</summary>
              <p className="text-slate-600 text-sm mt-2">Yes, as long as you have $50+ approved balance available. No limit on number of payouts.</p>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-slate-900">Do I pay taxes on commission earnings?</summary>
              <p className="text-slate-600 text-sm mt-2">Yes, commission earnings are typically taxable income. We provide annual earnings reports. Consult your tax advisor.</p>
            </details>
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Need Help with Payouts?</h2>
          <p className="text-slate-700 mb-4">Contact our support team if you encounter any issues with payout requests or need additional assistance.</p>
          <a href="/dashboard/support" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium">
            Open Support Ticket
          </a>
        </section>
      </div>
    </DocLayout>
  );
}
