import { DocLayout } from '../../../components/docs/DocLayout';
import { ShoppingCart, MapPin, CreditCard, CheckCircle, HelpCircle } from 'lucide-react';

export function UserPurchase() {
  return (
    <DocLayout
      title="How to Purchase Servers"
      description="Step-by-step guide to purchasing hosting plans"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'How to Purchase' }
      ]}
      prevPage={{ title: 'Account Setup', path: '/docs/user/account' }}
      nextPage={{ title: 'Managing Servers', path: '/docs/user/servers' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Purchasing a hosting plan with BIDUA is simple and straightforward. Follow this guide to select, configure, and purchase your first server.
          </p>
        </section>

        {/* Step-by-Step Process */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Step-by-Step Purchasing Guide</h2>

          <div className="space-y-6 my-6">
            {/* Step 1 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">1</span>
                  <span>Visit the Pricing Page</span>
                </h3>
              </div>
              <div className="p-6">
                <ol className="space-y-2 text-slate-600">
                  <li>1. Log into your account or navigate as a guest</li>
                  <li>2. Go to "Pricing" or "Plans" section</li>
                  <li>3. Browse available hosting plans</li>
                </ol>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">2</span>
                  <span>Select Your Plan</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Choose a plan that fits your needs:</p>
                <div className="space-y-2 text-slate-600 mb-4">
                  <p>• Shared Hosting - Best for websites</p>
                  <p>• VPS - Better performance and control</p>
                  <p>• Cloud - Scalable and flexible</p>
                  <p>• Dedicated - Full server power</p>
                </div>
                <p className="text-slate-600">Click "Select Plan" or "Get Started" button</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">3</span>
                  <span>Configure Your Plan</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Customize your hosting plan:</p>
                <div className="space-y-3 text-slate-600 mb-4">
                  <div>
                    <p className="font-semibold">CPU Cores:</p>
                    <p className="ml-4">Select number of processor cores</p>
                  </div>
                  <div>
                    <p className="font-semibold">RAM:</p>
                    <p className="ml-4">Choose memory allocation</p>
                  </div>
                  <div>
                    <p className="font-semibold">Storage:</p>
                    <p className="ml-4">Select storage capacity (SSD/HDD)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Bandwidth:</p>
                    <p className="ml-4">Choose monthly data transfer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">4</span>
                  <span>Select Operating System</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Choose your preferred OS:</p>
                <div className="grid grid-cols-2 gap-3 text-slate-600 mb-4">
                  <div>
                    <p className="font-semibold">Linux</p>
                    <p className="text-sm">Ubuntu, CentOS, Debian</p>
                  </div>
                  <div>
                    <p className="font-semibold">Windows</p>
                    <p className="text-sm">Windows Server 2016-2022</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">Can be changed anytime after purchase</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">5</span>
                  <span>Add Optional Services</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Choose optional add-ons:</p>
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Premium Support (+$79/month)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>SSL Certificate (+$30/year)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Backup Service (+$19/month)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Additional Storage (+$15/month)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">6</span>
                  <span>Select Billing Cycle</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Choose billing frequency:</p>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between p-2 border border-slate-200 rounded">
                    <span>Monthly</span>
                    <span>No discount</span>
                  </div>
                  <div className="flex justify-between p-2 border border-slate-200 rounded">
                    <span>Quarterly</span>
                    <span className="text-green-600 font-semibold">5% off</span>
                  </div>
                  <div className="flex justify-between p-2 border border-slate-200 rounded">
                    <span>6 Months</span>
                    <span className="text-green-600 font-semibold">10% off</span>
                  </div>
                  <div className="flex justify-between p-2 border border-cyan-400 rounded bg-cyan-50">
                    <span className="font-semibold">Annual</span>
                    <span className="text-green-600 font-semibold">20% off</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">7</span>
                  <span>Review Order</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Verify all details before proceeding:</p>
                <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold">VPS 2vCore / 4GB RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Cycle:</span>
                    <span className="font-semibold">Annual</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span className="font-semibold">Premium Support</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                    <span>Total:</span>
                    <span className="text-cyan-500">$359.88/year</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">Apply promo code if you have one</p>
              </div>
            </div>

            {/* Step 8 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">8</span>
                  <span>Complete Payment</span>
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Proceed to secure checkout:</p>
                <div className="space-y-2 text-slate-600">
                  <p>1. Enter billing address (if not logged in)</p>
                  <p>2. Choose payment method</p>
                  <p>3. Enter payment details</p>
                  <p>4. Review terms & conditions</p>
                  <p>5. Click "Complete Purchase"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Configuration Tips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">For Small Websites</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Shared Hosting or Basic VPS</li>
                <li>• 1-2 vCores</li>
                <li>• 2-4GB RAM</li>
                <li>• 50-100GB SSD</li>
                <li>• 500GB-1TB bandwidth</li>
              </ul>
            </div>

            <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">For Growing Business</h3>
              <ul className="space-y-2 text-purple-800 text-sm">
                <li>• VPS or Cloud Hosting</li>
                <li>• 4-8 vCores</li>
                <li>• 8-16GB RAM</li>
                <li>• 200-500GB SSD</li>
                <li>• 2-5TB bandwidth</li>
              </ul>
            </div>

            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">For Enterprise</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Dedicated Server</li>
                <li>• 16-64 vCores</li>
                <li>• 32-256GB RAM</li>
                <li>• 500GB-10TB SSD</li>
                <li>• Unlimited bandwidth</li>
              </ul>
            </div>

            <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-3">For Testing</h3>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• Shared Hosting</li>
                <li>• Minimal resources</li>
                <li>• Monthly billing</li>
                <li>• Easy upgrade path</li>
                <li>• 30-day money-back guarantee</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Promo Codes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Promo Codes & Discounts</h2>

          <p className="text-slate-600 mb-6">
            Save money by using promotional codes during checkout:
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">How to Apply a Promo Code</h3>

            <ol className="space-y-2 text-green-800 text-sm">
              <li>1. Complete your plan selection</li>
              <li>2. On the checkout page, find "Promo Code" field</li>
              <li>3. Enter your code and click "Apply"</li>
              <li>4. Discount will be applied to total</li>
              <li>5. Proceed with payment</li>
            </ol>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <p className="text-slate-600 mb-3"><strong>Available Codes:</strong></p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 border border-slate-200 rounded bg-white">
                <span className="font-mono font-bold text-cyan-600">WELCOME15</span>
                <span className="text-slate-600">15% off first purchase</span>
              </div>
              <div className="flex justify-between p-2 border border-slate-200 rounded bg-white">
                <span className="font-mono font-bold text-cyan-600">ANNUAL20</span>
                <span className="text-slate-600">20% off annual plans</span>
              </div>
              <div className="flex justify-between p-2 border border-slate-200 rounded bg-white">
                <span className="font-mono font-bold text-cyan-600">STUDENT30</span>
                <span className="text-slate-600">30% off (students with ID)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Methods</h2>

          <p className="text-slate-600 mb-6">
            We accept multiple secure payment methods:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              'Credit Cards (Visa, Mastercard, Amex)',
              'Debit Cards',
              'PayPal',
              'Bank Transfer',
              'Bitcoin & Ethereum',
              'Google Pay'
            ].map((method, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                <CreditCard className="h-5 w-5 text-cyan-500" />
                <span className="text-slate-600">{method}</span>
              </div>
            ))}
          </div>
        </section>

        {/* After Purchase */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Happens After Purchase</h2>

          <div className="space-y-4 my-6">
            <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Immediate Confirmation</p>
                <p className="text-slate-600 text-sm">Order confirmation sent to your email</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Server Provisioning</p>
                <p className="text-slate-600 text-sm">Your server is set up (usually within minutes)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Login Credentials</p>
                <p className="text-slate-600 text-sm">Receive server IP, username, and password</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Dashboard Access</p>
                <p className="text-slate-600 text-sm">Manage your server from the control panel</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Support Ready</p>
                <p className="text-slate-600 text-sm">Our support team is available if you need help</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-cyan-500" />
                <span>Can I upgrade my plan later?</span>
              </h3>
              <p className="text-slate-600 text-sm">Yes, you can upgrade anytime. Changes take effect immediately.</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-cyan-500" />
                <span>What if I'm not satisfied?</span>
              </h3>
              <p className="text-slate-600 text-sm">We offer a 30-day money-back guarantee. No questions asked.</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-cyan-500" />
                <span>How long does provisioning take?</span>
              </h3>
              <p className="text-slate-600 text-sm">Usually 5-30 minutes. You'll receive credentials via email.</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-cyan-500" />
                <span>Do you provide setup assistance?</span>
              </h3>
              <p className="text-slate-600 text-sm">Yes, premium support includes setup help. Contact us anytime.</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Start smaller and upgrade as you grow</li>
              <li>• Annual billing provides best value (20% off)</li>
              <li>• Use promo codes for additional savings</li>
              <li>• Enable auto-renewal to avoid service interruption</li>
              <li>• Save your server credentials securely</li>
              <li>• Contact support if you need help configuring</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
