import { DocLayout } from '../../../components/docs/DocLayout';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';

export function ReferralsCommission() {
  return (
    <DocLayout
      title="Multi-Level Commission Structure"
      description="Deep dive into how commissions are calculated and distributed across three levels"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Referral Program', path: '/docs/features/referrals' },
        { label: 'Commission Structure' }
      ]}
      prevPage={{ title: 'Registration', path: '/docs/features/referrals-registration' }}
      nextPage={{ title: 'Payout Management', path: '/docs/features/referrals-payouts' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Commission System Overview</h2>
          <p className="text-slate-700 mb-4">
            BIDUA Hosting uses a three-level commission structure that rewards you for building a referral network. Unlike single-tier systems, you earn commissions not just from direct referrals, but also from their referrals and beyond.
          </p>
          
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6 mt-4">
            <p className="text-slate-900 font-semibold mb-2">💡 Key Advantage:</p>
            <p className="text-slate-700">Build deeper networks and earn more with L2 and L3 commissions. Your earning potential grows exponentially!</p>
          </div>
        </section>

        {/* Three Levels */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Three Commission Levels</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* L1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Users className="h-8 w-8 text-blue-600 mr-2" />
                <h3 className="text-xl font-bold text-blue-900">Level 1</h3>
              </div>
              <p className="text-blue-800 text-sm mb-4">Direct Referrals</p>
              <div className="text-4xl font-bold text-blue-600 mb-2">10-30%</div>
              <p className="text-blue-700 text-xs">Commission per purchase</p>
              <hr className="my-4 border-blue-300" />
              <p className="text-blue-800 text-sm">Your direct referrals</p>
            </div>

            {/* L2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Award className="h-8 w-8 text-purple-600 mr-2" />
                <h3 className="text-xl font-bold text-purple-900">Level 2</h3>
              </div>
              <p className="text-purple-800 text-sm mb-4">Indirect Referrals</p>
              <div className="text-4xl font-bold text-purple-600 mb-2">5-15%</div>
              <p className="text-purple-700 text-xs">Commission per purchase</p>
              <hr className="my-4 border-purple-300" />
              <p className="text-purple-800 text-sm">Their referrals</p>
            </div>

            {/* L3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-green-900">Level 3</h3>
              </div>
              <p className="text-green-800 text-sm mb-4">Third-Level Referrals</p>
              <div className="text-4xl font-bold text-green-600 mb-2">2-5%</div>
              <p className="text-green-700 text-xs">Commission per purchase</p>
              <hr className="my-4 border-green-300" />
              <p className="text-green-800 text-sm">Their referrals</p>
            </div>
          </div>
        </section>

        {/* Commission Calculation */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Commission Calculation Works</h2>
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Calculation Formula</h3>
            
            <div className="bg-slate-50 p-4 rounded font-mono text-sm text-slate-700">
              <p className="mb-2">Commission = Order Total × Commission Rate</p>
              <p className="text-xs text-slate-600">Order Total includes: plan price + add-ons - discounts + taxes</p>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-3 mt-6">Commission Triggers</h3>
            
            <div className="space-y-3">
              <div className="border border-slate-200 rounded p-4">
                <p className="font-semibold text-slate-900 mb-1">🛒 Initial Purchase</p>
                <p className="text-slate-600 text-sm">Commission awarded when referred customer makes their first server purchase</p>
              </div>

              <div className="border border-slate-200 rounded p-4">
                <p className="font-semibold text-slate-900 mb-1">🔄 Annual Renewal</p>
                <p className="text-slate-600 text-sm">Commission awarded again when customer renews their service subscription</p>
              </div>

              <div className="border border-slate-200 rounded p-4">
                <p className="font-semibold text-slate-900 mb-1">➕ Add-on Purchases</p>
                <p className="text-slate-600 text-sm">Commission applied to any add-ons or upgrades purchased by referred customer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Real-World Example: Complete Network</h2>
          
          <div className="space-y-6">
            {/* Year 1 */}
            <div className="bg-gradient-to-r from-slate-50 to-cyan-50 border-2 border-cyan-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Year 1: Building Your Network</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded p-4 border-l-4 border-blue-500">
                  <p className="text-slate-900 font-semibold mb-1">You refer Customer A</p>
                  <p className="text-slate-600 text-sm mb-2">Purchases: VPS Professional at $100/month ($1,200/year)</p>
                  <p className="text-blue-700 font-bold">Your L1 Commission: $180 (15% × $1,200)</p>
                </div>

                <div className="bg-white rounded p-4 border-l-4 border-purple-500 ml-6">
                  <p className="text-slate-900 font-semibold mb-1">Customer A refers Customer B</p>
                  <p className="text-slate-600 text-sm mb-2">Purchases: VPS Starter at $50/month ($600/year)</p>
                  <p className="text-purple-700 font-bold">Your L2 Commission: $60 (10% × $600)</p>
                </div>

                <div className="bg-white rounded p-4 border-l-4 border-green-500 ml-12">
                  <p className="text-slate-900 font-semibold mb-1">Customer B refers Customer C</p>
                  <p className="text-slate-600 text-sm mb-2">Purchases: VPS Starter at $50/month ($600/year)</p>
                  <p className="text-green-700 font-bold">Your L3 Commission: $18 (3% × $600)</p>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded p-4 mt-4 border border-blue-300">
                  <p className="text-slate-900 font-bold text-lg">Year 1 Total: $258</p>
                </div>
              </div>
            </div>

            {/* Year 2+ */}
            <div className="bg-gradient-to-r from-green-50 to-cyan-50 border-2 border-green-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Year 2+: Recurring Revenue</h3>
              
              <p className="text-slate-600 mb-4">All three customers renew their subscriptions. Same commissions apply again!</p>

              <div className="space-y-4">
                <div className="bg-white rounded p-4 border-l-4 border-blue-500">
                  <p className="text-slate-900 font-semibold mb-1">Customer A Renews</p>
                  <p className="text-blue-700 font-bold">Your L1 Commission: $180</p>
                </div>

                <div className="bg-white rounded p-4 border-l-4 border-purple-500 ml-6">
                  <p className="text-slate-900 font-semibold mb-1">Customer B Renews</p>
                  <p className="text-purple-700 font-bold">Your L2 Commission: $60</p>
                </div>

                <div className="bg-white rounded p-4 border-l-4 border-green-500 ml-12">
                  <p className="text-slate-900 font-semibold mb-1">Customer C Renews</p>
                  <p className="text-green-700 font-bold">Your L3 Commission: $18</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-cyan-100 rounded p-4 mt-4 border border-green-300">
                  <p className="text-slate-900 font-bold text-lg">Recurring Year Total: $258</p>
                  <p className="text-slate-600 text-sm">Every year, as long as they remain customers!</p>
                </div>
              </div>
            </div>

            {/* Exponential Growth */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Exponential Growth Potential</h3>
              
              <p className="text-slate-600 mb-4">As your network grows, your earnings multiply:</p>

              <div className="space-y-2 text-slate-700 text-sm">
                <p>📈 If you refer <strong>10 customers</strong> directly → earn L1 from all 10</p>
                <p>📈 If those 10 refer <strong>5 each</strong> (50 total) → earn L2 from all 50</p>
                <p>📈 If those 50 refer <strong>3 each</strong> (150 total) → earn L3 from all 150</p>
                <p className="font-bold pt-2">Total passive network: 210 customers!</p>
              </div>

              <div className="bg-orange-100 border border-orange-400 rounded p-3 mt-4">
                <p className="text-orange-900 font-bold">This is why multi-level commissions are so powerful!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Rates */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Commission Rate Details</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Rate Range</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">When Applied</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Example ($100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-semibold text-blue-900">L1 (Direct)</td>
                  <td className="px-4 py-3 text-blue-700 font-bold">10-30%</td>
                  <td className="px-4 py-3 text-slate-600">Your direct referrals purchase</td>
                  <td className="px-4 py-3 text-blue-700 font-semibold">$10-30</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-purple-900">L2 (Indirect)</td>
                  <td className="px-4 py-3 text-purple-700 font-bold">5-15%</td>
                  <td className="px-4 py-3 text-slate-600">Your L1 customers' referrals purchase</td>
                  <td className="px-4 py-3 text-purple-700 font-semibold">$5-15</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-green-900">L3 (Third-tier)</td>
                  <td className="px-4 py-3 text-green-700 font-bold">2-5%</td>
                  <td className="px-4 py-3 text-slate-600">Your L2 customers' referrals purchase</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">$2-5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <p className="text-amber-800 text-sm"><strong>Why ranges?</strong> Commission rates vary based on plan tier and volume. Premium plans offer higher L1 rates. Bulk referrals may trigger higher rates.</p>
          </div>
        </section>

        {/* Commission Status */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Commission Lifecycle & Status</h2>
          
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="font-semibold text-yellow-900 mb-1">📋 Pending (0-30 days)</p>
              <p className="text-yellow-800 text-sm">Commission earned but under review. 30-day fraud check window.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="font-semibold text-blue-900 mb-1">✅ Approved (30+ days)</p>
              <p className="text-blue-800 text-sm">Commission verified and approved. Ready for payout or reinvestment.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="font-semibold text-green-900 mb-1">💰 Paid</p>
              <p className="text-green-800 text-sm">Commission transferred to your account. Transaction complete.</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="font-semibold text-red-900 mb-1">❌ Rejected / Cancelled</p>
              <p className="text-red-800 text-sm">Commission cancelled due to fraud detection or customer refund.</p>
            </div>
          </div>
        </section>

        {/* Tax & Reporting */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tax & Reporting</h2>
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <p className="text-slate-700">
              Commission earnings are subject to applicable taxes based on your jurisdiction. We provide:
            </p>

            <div className="space-y-3">
              <div className="border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900">Annual Earnings Report</p>
                <p className="text-slate-600 text-sm">Detailed breakdown of all commissions earned per year</p>
              </div>

              <div className="border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900">Monthly Statements</p>
                <p className="text-slate-600 text-sm">Access to monthly earning statements and transaction history</p>
              </div>

              <div className="border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900">1099 / Tax Forms (US)</p>
                <p className="text-slate-600 text-sm">Applicable tax forms provided for earnings above reporting threshold</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
              <p className="text-blue-800 text-sm"><strong>Note:</strong> You are responsible for reporting earnings to tax authorities. Consult your tax advisor regarding commission tax obligations.</p>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
