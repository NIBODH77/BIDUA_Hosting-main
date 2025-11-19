import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminApprovePayout, adminRejectPayout, formatCurrency, getStatusColor } from '../../lib/referral';
import { ReferralPayout } from '../../types';

export function ReferralManagement() {
  const [pendingPayouts, setPendingPayouts] = useState<ReferralPayout[]>([]);
  const [allPayouts, setAllPayouts] = useState<ReferralPayout[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payoutsRes, statsRes] = await Promise.all([
        supabase
          .from('referral_payouts')
          .select(`
            *,
            users_profiles!referral_payouts_user_id_fkey(full_name, referral_code)
          `)
          .order('created_at', { ascending: false }),
        supabase.rpc('get_admin_referral_stats')
      ]);

      if (payoutsRes.data) {
        const payouts = payoutsRes.data as any[];
        setPendingPayouts(payouts.filter(p => p.status === 'requested' || p.status === 'under_review'));
        setAllPayouts(payouts);
      }

      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payoutId: string) => {
    if (!paymentReference) {
      alert('Please enter payment reference');
      return;
    }

    setProcessing(true);
    try {
      await adminApprovePayout(payoutId, paymentReference);
      setSelectedPayout(null);
      setPaymentReference('');
      await loadData();
    } catch (error) {
      console.error('Failed to approve payout:', error);
      alert('Failed to approve payout');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (payoutId: string) => {
    if (!rejectReason) {
      alert('Please enter rejection reason');
      return;
    }

    setProcessing(true);
    try {
      await adminRejectPayout(payoutId, rejectReason);
      setSelectedPayout(null);
      setRejectReason('');
      await loadData();
    } catch (error) {
      console.error('Failed to reject payout:', error);
      alert('Failed to reject payout');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading referral data...</div>
      </div>
    );
  }

  const displayPayouts = activeTab === 'pending' ? pendingPayouts : allPayouts;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Referral Management</h2>
        <p className="text-slate-400">Manage referral program and payout requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-6 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalReferrals}</div>
          <div className="text-sm text-slate-400">Total Referrals</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats.totalEarnings)}
          </div>
          <div className="text-sm text-slate-400">Total Earnings</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-yellow-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats.pendingPayouts)}
          </div>
          <div className="text-sm text-slate-400">Pending Payouts</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border-2 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats.completedPayouts)}
          </div>
          <div className="text-sm text-slate-400">Completed Payouts</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 overflow-hidden">
        <div className="border-b border-cyan-500/30">
          <div className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'pending'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Pending Requests ({pendingPayouts.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Payouts ({allPayouts.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {displayPayouts.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Payout Requests</h3>
              <p className="text-slate-400">
                {activeTab === 'pending' ? 'No pending requests at the moment' : 'No payout history'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayPayouts.map((payout: any) => (
                <div
                  key={payout.id}
                  className="bg-slate-800 rounded-lg p-6 border border-cyan-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-white">
                          {payout.users_profiles?.full_name || 'Unknown User'}
                        </span>
                        <span className="text-sm text-slate-400">
                          ({payout.users_profiles?.referral_code})
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                          {payout.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 mb-1">
                        Payout #: {payout.payout_number}
                      </div>
                      <div className="text-xs text-slate-500">
                        Requested: {new Date(payout.requested_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(payout.net_amount)}
                      </div>
                      <div className="text-xs text-slate-400">
                        Gross: {formatCurrency(payout.gross_amount)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900 rounded-lg mb-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">TDS (10%)</div>
                      <div className="text-sm font-semibold text-white">
                        {formatCurrency(payout.tds_amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">GST (18%)</div>
                      <div className="text-sm font-semibold text-white">
                        {formatCurrency(payout.service_tax_amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Payment Method</div>
                      <div className="text-sm font-semibold text-white capitalize">
                        {payout.payment_method.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Tax Year/Quarter</div>
                      <div className="text-sm font-semibold text-white">
                        {payout.tax_year} Q{payout.tax_quarter}
                      </div>
                    </div>
                  </div>

                  {payout.bank_account_details && Object.keys(payout.bank_account_details).length > 0 && (
                    <div className="p-4 bg-slate-900 rounded-lg mb-4">
                      <div className="text-sm font-semibold text-white mb-2">Bank Details</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">Account Holder:</span>
                          <span className="text-white ml-2">{payout.bank_account_details.account_holder}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Account Number:</span>
                          <span className="text-white ml-2">{payout.bank_account_details.account_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">IFSC:</span>
                          <span className="text-white ml-2">{payout.bank_account_details.ifsc_code}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Bank:</span>
                          <span className="text-white ml-2">{payout.bank_account_details.bank_name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(payout.status === 'requested' || payout.status === 'under_review') && (
                    <div className="flex space-x-3">
                      {selectedPayout === payout.id ? (
                        <div className="flex-1 space-y-3">
                          <div className="flex space-x-3">
                            <input
                              type="text"
                              placeholder="Payment Reference"
                              value={paymentReference}
                              onChange={(e) => setPaymentReference(e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                            />
                            <button
                              onClick={() => handleApprove(payout.id)}
                              disabled={processing || !paymentReference}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center space-x-2"
                            >
                              <CheckCircle className="h-5 w-5" />
                              <span>Approve</span>
                            </button>
                          </div>
                          <div className="flex space-x-3">
                            <input
                              type="text"
                              placeholder="Rejection Reason"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                            />
                            <button
                              onClick={() => handleReject(payout.id)}
                              disabled={processing || !rejectReason}
                              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center space-x-2"
                            >
                              <XCircle className="h-5 w-5" />
                              <span>Reject</span>
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPayout(null);
                              setPaymentReference('');
                              setRejectReason('');
                            }}
                            className="text-sm text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPayout(payout.id)}
                          className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition"
                        >
                          Process Payout
                        </button>
                      )}
                    </div>
                  )}

                  {payout.payment_reference && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-400">Reference:</span>
                      <span className="text-white">{payout.payment_reference}</span>
                    </div>
                  )}

                  {payout.rejected_reason && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex items-start space-x-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-red-400 font-semibold">Rejected:</span>
                        <span className="text-slate-300 ml-1">{payout.rejected_reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
