import { DocLayout } from '../../../components/docs/DocLayout';
import { Users, TrendingUp, DollarSign, Share2, Award } from 'lucide-react';

export function UserReferrals() {
  return (
    <DocLayout
      title="Earning Through Referrals"
      description="Complete guide to the referral program and earning rewards"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'Referral Program' }
      ]}
      prevPage={{ title: 'Using Support', path: '/docs/user/support' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting's referral program rewards you for recommending our services. Earn cash commissions and account credits by referring friends, colleagues, and customers.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Program Works</h2>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Get Your Referral Link</p>
                <p className="text-slate-600">Sign up for the program and receive unique referral link</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Share Your Link</p>
                <p className="text-slate-600">Share via email, social media, blog, or personal network</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">People Sign Up</p>
                <p className="text-slate-600">When someone clicks your link and creates account</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">They Purchase</p>
                <p className="text-slate-600">Your referral purchases a hosting plan</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">You Earn Commission</p>
                <p className="text-slate-600">Earn 20% commission on their first purchase and renewals</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Enrollment */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Joining the Program</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sign Up for Referrals</h3>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Log into your account</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Click "Referrals" from dashboard</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Click "Join Program"</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Accept terms and conditions</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">5</span>
              <span className="text-slate-600">Your referral link is ready to use</span>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-slate-700">You must be an active BIDUA customer to join the referral program</p>
          </div>
        </section>

        {/* Earnings & Commissions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Earnings & Commissions</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Commission Structure</h3>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Earning Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">When Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Sign-up Bonus</td>
                  <td className="px-4 py-3 text-slate-600">$10 credit</td>
                  <td className="px-4 py-3 text-slate-600">First purchase completed</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">First Purchase Commission</td>
                  <td className="px-4 py-3 text-slate-600">20% of purchase</td>
                  <td className="px-4 py-3 text-slate-600">When they pay for plan</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Renewal Commission</td>
                  <td className="px-4 py-3 text-slate-600">20% of renewal</td>
                  <td className="px-4 py-3 text-slate-600">Each renewal (lifetime)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Add-on Commission</td>
                  <td className="px-4 py-3 text-slate-600">15% of add-on cost</td>
                  <td className="px-4 py-3 text-slate-600">Per renewal</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Example Earnings</h3>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <p className="text-slate-600 mb-4">If you refer someone who purchases a VPS plan at $30/month annually:</p>

            <div className="space-y-3 text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>Annual Cost:</span>
                <span className="font-semibold">$360.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span>Your Commission (20%):</span>
                <span className="font-bold text-cyan-500">$72.00/year</span>
              </div>
              <div className="flex justify-between">
                <span>For 5 years:</span>
                <span className="font-bold text-cyan-500">$360.00</span>
              </div>
            </div>

            <p className="text-slate-600 text-sm">Plus recurring commissions every time they renew!</p>
          </div>
        </section>

        {/* Getting Your Link */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Referral Link</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Finding Your Link</h3>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Dashboard → Referrals</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Your referral link is displayed at the top</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Click "Copy Link" to copy to clipboard</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Paste and share anywhere</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Example Link Format</h3>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-6">
            https://biduahosting.com?ref=abc123xyz
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-slate-700"><strong>Unique link:</strong> Each referral link is unique to you. When someone signs up using your link, we automatically track it and credit your account.</p>
          </div>
        </section>

        {/* Sharing Strategies */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ways to Share Your Link</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Share2,
                title: 'Social Media',
                ideas: ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook groups']
              },
              {
                icon: Users,
                title: 'Direct Outreach',
                ideas: ['Email', 'Personal messages', 'Network contacts']
              },
              {
                icon: TrendingUp,
                title: 'Content',
                ideas: ['Blog posts', 'YouTube channel', 'Newsletter', 'Tutorials']
              },
              {
                icon: Award,
                title: 'Communities',
                ideas: ['Forums', 'Slack communities', 'Discord servers', 'Reddit']
              }
            ].map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-3">{channel.title}</h3>
                  <ul className="space-y-2">
                    {channel.ideas.map((idea, iidx) => (
                      <li key={iidx} className="text-slate-600 text-sm">• {idea}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Referral Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Dashboard</h2>

          <p className="text-slate-600 mb-6">
            Track your referrals and earnings:
          </p>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="text-slate-600 text-sm">Total Referrals</p>
                <p className="font-bold text-cyan-500 text-2xl">45</p>
              </div>
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="text-slate-600 text-sm">Active Customers</p>
                <p className="font-bold text-cyan-500 text-2xl">38</p>
              </div>
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="text-slate-600 text-sm">Total Earned</p>
                <p className="font-bold text-green-600 text-2xl">$2,450</p>
              </div>
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="text-slate-600 text-sm">Pending</p>
                <p className="font-bold text-orange-600 text-2xl">$125</p>
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-3">Your Referrals</h3>

            <div className="space-y-2">
              {[
                { name: 'John Doe', signup: 'Oct 15', status: 'Active', earned: '+$72.00' },
                { name: 'Sarah Smith', signup: 'Oct 8', status: 'Active', earned: '+$120.00' },
                { name: 'Mike Johnson', signup: 'Sep 22', status: 'Active', earned: '+$45.00' }
              ].map((ref, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border border-slate-200 rounded">
                  <div>
                    <p className="font-semibold text-slate-900">{ref.name}</p>
                    <p className="text-slate-600 text-sm">Signed up: {ref.signup}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">{ref.status}</span>
                    <p className="text-cyan-500 font-bold mt-1">{ref.earned}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tier Program */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Tiers</h2>

          <p className="text-slate-600 mb-6">
            Increase your commission as you reach more referrals:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { tier: 'Bronze', referrals: '0-10', commission: '20%', bonus: 'Base rate' },
              { tier: 'Silver', referrals: '11-25', commission: '22%', bonus: '+$50/month bonus' },
              { tier: 'Gold', referrals: '26-50', commission: '25%', bonus: '+$100/month bonus' },
              { tier: 'Platinum', referrals: '50+', commission: '30%', bonus: '+$200/month bonus' }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${
                  item.tier === 'Platinum'
                    ? 'bg-gradient-to-r from-slate-50 to-cyan-50 border-cyan-400'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.tier}</h3>
                    <p className="text-slate-600 text-sm">{item.referrals} referrals</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-500 text-lg">{item.commission}</p>
                    <p className="text-green-600 text-sm font-semibold">{item.bonus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payouts */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payouts & Withdrawals</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payout Methods</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { method: 'Account Credit', speed: 'Immediate', fee: 'Free' },
              { method: 'Bank Transfer', speed: '5-10 days', fee: '$5' },
              { method: 'PayPal', speed: '1-3 days', fee: 'Free' },
              { method: 'Cryptocurrency', speed: 'Instant', fee: 'Variable' }
            ].map((payout, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">{payout.method}</h4>
                <p className="text-slate-600 text-sm mb-1">Processing: {payout.speed}</p>
                <p className="text-slate-600 text-sm">Fee: {payout.fee}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Setting Up Payouts</h3>

          <ol className="space-y-3 text-slate-600">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span>Go to Referrals → Payouts</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span>Add your payout method</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span>Verify your information</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span>Request payout when balance reaches $10 minimum</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">5</span>
              <span>Funds transferred on next payout date</span>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
            <p className="text-slate-700"><strong>Note:</strong> Payouts are processed on the 15th of each month for balances $10+</p>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Best Practices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Do</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>✓ Share genuine recommendations</li>
                <li>✓ Explain benefits of BIDUA</li>
                <li>✓ Target relevant audiences</li>
                <li>✓ Follow up with referrals</li>
                <li>✓ Track your performance</li>
              </ul>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-3">Don't</h4>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>✗ Spam or use unethical tactics</li>
                <li>✗ Self-refer or manipulate</li>
                <li>✗ Share others' referral links</li>
                <li>✗ Make false claims</li>
                <li>✗ Buy referral traffic</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Quality referrals convert better than quantity</li>
              <li>• Create blog post or video about BIDUA Hosting</li>
              <li>• Include referral link in email signature</li>
              <li>• Share exclusive promotions with your network</li>
              <li>• Track which channels bring best referrals</li>
              <li>• Follow up with referrals to ensure satisfaction</li>
              <li>• Leverage your influence and expertise</li>
              <li>• Reach out to support for marketing help</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
