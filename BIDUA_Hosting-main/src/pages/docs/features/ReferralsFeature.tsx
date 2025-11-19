import { DocLayout } from '../../../components/docs/DocLayout';
import { Users, TrendingUp, Gift, DollarSign, Award, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ReferralsFeature() {
  return (
    <DocLayout
      title="Referral Program"
      description="Earn rewards by referring friends and colleagues to BIDUA Hosting"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Referral Program' }
      ]}
      prevPage={{ title: 'Support System', path: '/docs/features/support' }}
    >
      <div className="space-y-8">
        {/* Quick Navigation to Subsections */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📚 Referral Program Documentation</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/docs/features/referrals-registration"
              className="p-4 bg-white rounded-lg border border-slate-200 hover:border-cyan-400 hover:shadow transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">Registration Guide</h3>
                <ArrowRight className="h-4 w-4 text-cyan-500 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-slate-600 text-sm">Learn how signup with referral codes works and real-time validation</p>
            </Link>

            <Link
              to="/docs/features/referrals-commission"
              className="p-4 bg-white rounded-lg border border-slate-200 hover:border-cyan-400 hover:shadow transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">Commission Structure</h3>
                <ArrowRight className="h-4 w-4 text-cyan-500 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-slate-600 text-sm">Deep dive into 3-level commission system (L1, L2, L3) and calculations</p>
            </Link>

            <Link
              to="/docs/features/referrals-payouts"
              className="p-4 bg-white rounded-lg border border-slate-200 hover:border-cyan-400 hover:shadow transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">Payout Management</h3>
                <ArrowRight className="h-4 w-4 text-cyan-500 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-slate-600 text-sm">Request payouts, payout methods, tracking, and withdrawals</p>
            </Link>
          </div>
        </div>
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            The BIDUA Hosting Referral Program rewards you for bringing new customers to our platform. Earn commissions, account credits, and exclusive benefits when your referrals sign up and purchase plans.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Program Works</h2>

          <ol className="space-y-6 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Join the Program</p>
                <p className="text-slate-600">Sign up for the referral program from your dashboard</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Get Your Referral Link</p>
                <p className="text-slate-600">Receive a unique referral link to share with others</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Share & Promote</p>
                <p className="text-slate-600">Share your link on social media, blogs, email, etc.</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Earn Rewards</p>
                <p className="text-slate-600">Get paid when referrals sign up and make purchases</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Commission Structure */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Multi-Level Commission Structure</h2>

          <p className="text-slate-600 mb-6">
            Earn competitive commissions across three levels based on your referral network:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Level 1 (Direct)</h3>
              <p className="text-blue-800 text-sm mb-4">Your direct referrals</p>
              <div className="text-3xl font-bold text-blue-600 mb-2">10-30%</div>
              <p className="text-blue-700 text-sm">Commission rate per purchase</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Level 2 (Indirect)</h3>
              <p className="text-purple-800 text-sm mb-4">Referrals of your referrals</p>
              <div className="text-3xl font-bold text-purple-600 mb-2">5-15%</div>
              <p className="text-purple-700 text-sm">Commission rate per purchase</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">Level 3 (Third-tier)</h3>
              <p className="text-green-800 text-sm mb-4">Referrals in your L2 network</p>
              <div className="text-3xl font-bold text-green-600 mb-2">2-5%</div>
              <p className="text-green-700 text-sm">Commission rate per purchase</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4 mt-8">Commission Details</h3>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Commission Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Range</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Trigger Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Recurring</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">L1 (Direct Referral)</td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">10-30%</td>
                  <td className="px-4 py-3 text-slate-600">First purchase + renewals</td>
                  <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Annual</span></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">L2 (Indirect Referral)</td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">5-15%</td>
                  <td className="px-4 py-3 text-slate-600">First purchase + renewals</td>
                  <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Annual</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">L3 (Third-Level Referral)</td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">2-5%</td>
                  <td className="px-4 py-3 text-slate-600">First purchase + renewals</td>
                  <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Annual</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 my-6">
            <p className="text-slate-700 mb-2"><strong>How Multi-Level Works:</strong> When your referral purchases a service, you earn L1 commission. When they refer someone, you earn L2 on their referral's purchase. When their referral refers someone, you earn L3. All commissions are applied simultaneously.</p>
            <p className="text-slate-700 mt-2"><strong>Pro Tip:</strong> Build your referral network strategically! Commissions repeat annually when customers renew their services, creating passive income streams.</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4 mt-8">Example Commission Scenario</h3>

          <div className="bg-gradient-to-r from-slate-50 to-cyan-50 border border-cyan-200 rounded-lg p-6">
            <p className="text-slate-700 mb-4"><strong>You refer Customer A ($100/year VPS)</strong></p>
            <p className="text-green-700 font-semibold mb-4">💰 Your L1 Commission: $15 (15% of $100)</p>

            <p className="text-slate-700 mb-4"><strong>Customer A refers Customer B ($100/year VPS)</strong></p>
            <p className="text-blue-700 font-semibold mb-4">💰 Your L2 Commission: $10 (10% of $100)</p>

            <p className="text-slate-700 mb-4"><strong>Customer B refers Customer C ($100/year VPS)</strong></p>
            <p className="text-purple-700 font-semibold mb-4">💰 Your L3 Commission: $3 (3% of $100)</p>

            <div className="border-t border-cyan-200 pt-4 mt-4">
              <p className="text-slate-900 font-bold text-lg">Total First Year: $28</p>
              <p className="text-slate-600 text-sm">Next Year (if all renew): $28 again... and every year after!</p>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Program Eligibility</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4">Who Can Join</h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Any existing BIDUA customer</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Verified account holders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Agencies and resellers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Bloggers and content creators</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>No geographic restrictions</span>
                </li>
              </ul>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-4">Restrictions</h3>
              <ul className="space-y-2 text-red-800">
                <li className="flex items-center space-x-2">
                  <span className="text-red-600">✗</span>
                  <span>No self-referrals (same person)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-600">✗</span>
                  <span>No click fraud or manipulation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-600">✗</span>
                  <span>Account must be in good standing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-600">✗</span>
                  <span>No payment disputes allowed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-600">✗</span>
                  <span>Terms of service must be followed</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started with Referrals</h2>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Log into Your Account</p>
                <p className="text-slate-600">Sign in to your BIDUA Hosting dashboard</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Referrals Section</p>
                <p className="text-slate-600">Navigate to Dashboard → Referrals → Program Details</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Enable the Program</p>
                <p className="text-slate-600">Click "Opt-in" to join the referral program</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Copy Your Referral Link</p>
                <p className="text-slate-600">Copy the unique link provided in your dashboard</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">Start Referring</p>
                <p className="text-slate-600">Share your link and start earning rewards</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Tracking & Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Dashboard</h2>

          <p className="text-slate-600 mb-6">
            Monitor your referrals and earnings from your dashboard:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Users,
                title: 'Total Referrals',
                description: 'Track the number of people who signed up using your link'
              },
              {
                icon: DollarSign,
                title: 'Total Earnings',
                description: 'View cumulative commissions earned from all referrals'
              },
              {
                icon: TrendingUp,
                title: 'Active Referrals',
                description: 'See how many of your referrals are currently active customers'
              },
              {
                icon: Award,
                title: 'Performance Stats',
                description: 'View conversion rates and earnings trends over time'
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

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Dashboard Metrics</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Lifetime Referrals:</span>
                <span className="font-bold text-cyan-500">45</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Active Customers:</span>
                <span className="font-bold text-cyan-500">38</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Total Earnings:</span>
                <span className="font-bold text-cyan-500">$2,450.00</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600">Pending Payouts:</span>
                <span className="font-bold text-cyan-500">$125.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Conversion Rate:</span>
                <span className="font-bold text-cyan-500">84.4%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Promotion Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Promotion Tips & Ideas</h2>

          <p className="text-slate-600 mb-6">
            Here are effective ways to promote your referral link:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Share2,
                title: 'Social Media',
                ideas: ['Post on Twitter', 'Share on LinkedIn', 'Instagram stories', 'Facebook groups']
              },
              {
                icon: Gift,
                title: 'Email Marketing',
                ideas: ['Newsletter', 'Email signatures', 'Welcome emails', 'Follow-up campaigns']
              },
              {
                icon: TrendingUp,
                title: 'Content Marketing',
                ideas: ['Blog posts', 'YouTube videos', 'Tutorials', 'Case studies']
              },
              {
                icon: Users,
                title: 'Direct Outreach',
                ideas: ['Personal emails', 'Slack communities', 'Discord servers', 'Forums']
              }
            ].map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-3">{channel.title}</h3>
                  <ul className="space-y-2">
                    {channel.ideas.map((idea, idx) => (
                      <li key={idx} className="text-slate-600 text-sm">• {idea}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Marketing Materials */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Marketing Materials</h2>

          <p className="text-slate-600 mb-6">
            We provide ready-to-use marketing materials to help you promote:
          </p>

          <div className="space-y-4 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Banners & Graphics</h3>
              <p className="text-slate-600 text-sm">Download pre-made banners in multiple sizes for your website or social media</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Email Templates</h3>
              <p className="text-slate-600 text-sm">Ready-to-send email templates to share with your contacts</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Social Media Copy</h3>
              <p className="text-slate-600 text-sm">Suggested text and hashtags for Twitter, Facebook, and LinkedIn</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Blog Post Ideas</h3>
              <p className="text-slate-600 text-sm">Topics and outlines for blog articles featuring BIDUA Hosting</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-slate-700">All marketing materials can be downloaded from the Referrals section of your dashboard</p>
          </div>
        </section>

        {/* Payouts */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Payouts & Withdrawals</h2>

          <p className="text-slate-600 mb-6">
            Learn how to receive your referral earnings:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payout Methods</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                method: 'Account Credit',
                description: 'Automatic credit to your BIDUA account for services',
                timing: 'Immediate',
                fee: 'Free'
              },
              {
                method: 'Bank Transfer',
                description: 'Direct transfer to your bank account',
                timing: '5-10 business days',
                fee: '$5 per transfer'
              },
              {
                method: 'PayPal',
                description: 'Transfer directly to PayPal account',
                timing: '1-3 business days',
                fee: 'Free'
              },
              {
                method: 'Cryptocurrency',
                description: 'Receive earnings in Bitcoin or Ethereum',
                timing: 'Instant',
                fee: 'Variable'
              }
            ].map((payout, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">{payout.method}</h4>
                <p className="text-slate-600 text-sm mb-3">{payout.description}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-slate-600">Timing:</span> <span className="font-semibold text-slate-900">{payout.timing}</span></p>
                  <p><span className="text-slate-600">Fee:</span> <span className="font-semibold text-slate-900">{payout.fee}</span></p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payout Schedule</h3>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">•</span>
                <span><strong>Minimum Balance:</strong> $10 minimum before payout is available</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">•</span>
                <span><strong>Payout Frequency:</strong> Monthly on the 15th of each month</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">•</span>
                <span><strong>Processing Time:</strong> 5-10 business days after payout request</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">•</span>
                <span><strong>Tax Information:</strong> Submit tax forms as required by jurisdiction</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Tier Program */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Tier Program</h2>

          <p className="text-slate-600 mb-6">
            Earn higher commissions as you reach referral milestones:
          </p>

          <div className="space-y-4 my-6">
            {[
              { tier: 'Bronze', referrals: '0-10', commission: '20%', bonus: '' },
              { tier: 'Silver', referrals: '11-25', commission: '22%', bonus: '+$50/month bonus' },
              { tier: 'Gold', referrals: '26-50', commission: '25%', bonus: '+$100/month bonus' },
              { tier: 'Platinum', referrals: '51+', commission: '30%', bonus: '+$200/month bonus + VIP support' }
            ].map((tier, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  tier.tier === 'Platinum'
                    ? 'bg-gradient-to-r from-slate-50 to-cyan-50 border-cyan-400'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-900">{tier.tier}</h4>
                    <p className="text-slate-600 text-sm">{tier.referrals} active referrals</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-500">{tier.commission} commission</p>
                    {tier.bonus && <p className="text-green-600 text-sm font-semibold">{tier.bonus}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Terms & Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms & Conditions</h2>

          <div className="space-y-4 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Referral Validity</h3>
              <p className="text-slate-600 text-sm">Referrals must sign up within 30 days of clicking your link to be counted</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Payment Responsibility</h3>
              <p className="text-slate-600 text-sm">Referrals must pay for their first purchase before commission is earned</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Fraud Prevention</h3>
              <p className="text-slate-600 text-sm">Any fraudulent activity will result in account suspension and forfeiture of earnings</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Program Changes</h3>
              <p className="text-slate-600 text-sm">We reserve the right to modify commission rates with 30 days notice</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Quality referrals convert better than quantity</li>
              <li>• Provide genuine recommendations to build trust</li>
              <li>• Track your referral performance in the dashboard</li>
              <li>• Use multiple channels to maximize reach</li>
              <li>• Share success stories and testimonials</li>
              <li>• Reach out to support for promotional assistance</li>
              <li>• Update your payment method to avoid payout delays</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
