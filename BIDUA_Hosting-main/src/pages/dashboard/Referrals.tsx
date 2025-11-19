import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Gift, Copy, Check } from 'lucide-react';
import { getReferralStats, formatCurrency } from '../../lib/referral';
import { ReferralStats } from '../../types';
import { ReferralEarningsTab } from '../../components/referrals/ReferralEarningsTab';
import { ReferralPayoutsTab } from '../../components/referrals/ReferralPayoutsTab';

export function Referrals() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'payouts'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getReferralStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (stats?.referral_code) {
      const link = `${window.location.origin}/signup?ref=${stats.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralCode = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading referral data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Referral Program</h1>
        <p className="text-slate-400">Earn commission by referring new customers to BIDUA Hosting</p>
      </div>

      <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl shadow-lg p-4 sm:p-6 border-2 border-cyan-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="flex items-center space-x-3">
            <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Your Referral Code</h3>
              <p className="text-xs sm:text-sm text-cyan-100">Share this code to start earning</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-wider text-center sm:text-left">
              {stats?.referral_code || 'Loading...'}
            </div>
            <button
              onClick={copyReferralCode}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/signup?ref=${stats?.referral_code || ''}`}
            className="flex-1 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-xs sm:text-sm truncate"
          />
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-6 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.total_referrals || 0}</div>
          <div className="text-sm text-slate-400">Total Referrals</div>
          <div className="mt-3 pt-3 border-t border-cyan-500/30 flex justify-between text-xs">
            <span className="text-slate-400">L1: {stats?.l1_referrals || 0}</span>
            <span className="text-slate-400">L2: {stats?.l2_referrals || 0}</span>
            <span className="text-slate-400">L3: {stats?.l3_referrals || 0}</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats?.total_earnings || 0)}
          </div>
          <div className="text-sm text-slate-400">Total Earnings</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats?.available_balance || 0)}
          </div>
          <div className="text-sm text-slate-400">Available Balance</div>
          {stats?.can_request_payout && (
            <div className="mt-3 text-xs text-green-400 font-semibold">Ready for payout!</div>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats?.total_withdrawn || 0)}
          </div>
          <div className="text-sm text-slate-400">Total Withdrawn</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 overflow-hidden">
        <div className="border-b border-cyan-500/30">
          <div className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'earnings'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'payouts'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Payouts
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Commission Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 border border-cyan-500/30">
                    <h4 className="font-semibold text-white mb-3">Recurring Plans (Monthly/Quarterly/Semi-annual)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 1 (Direct):</span>
                        <span className="text-green-400 font-bold">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 2:</span>
                        <span className="text-green-400 font-bold">1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 3:</span>
                        <span className="text-green-400 font-bold">1%</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-cyan-500/30 text-xs text-slate-400">
                        Earn on every renewal payment
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4 border border-cyan-500/30">
                    <h4 className="font-semibold text-white mb-3">Long-term Plans (Annual/Biennial/Triennial)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 1 (Direct):</span>
                        <span className="text-green-400 font-bold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 2:</span>
                        <span className="text-green-400 font-bold">3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level 3:</span>
                        <span className="text-green-400 font-bold">2%</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-cyan-500/30 text-xs text-slate-400">
                        One-time commission
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Payout Information</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>Minimum payout: ₹500</li>
                  <li>TDS: 10% (Tax Deducted at Source)</li>
                  <li>Service Tax (GST): 18%</li>
                  <li>Payouts processed within 7-10 business days</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && <ReferralEarningsTab />}

          {activeTab === 'payouts' && <ReferralPayoutsTab stats={stats} onPayoutCreated={loadStats} />}
        </div>
      </div>
    </div>
  );
}
