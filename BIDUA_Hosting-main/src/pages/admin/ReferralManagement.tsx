import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, DollarSign, TrendingUp, Eye } from 'lucide-react';
import api from '../../lib/api';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

interface AffiliateData {
  id: number;
  user_id: number;
  referral_code: string;
  status: string;
  is_active: boolean;
  total_referrals: number;
  total_commission: number;
  available_balance: number;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

interface PayoutData {
  id: number;
  affiliate_user_id: number;
  amount: number;
  status: string;
  payment_method: string;
  requested_at: string;
  processed_at: string | null;
  user?: {
    email: string;
    full_name: string;
  };
}

export function ReferralManagement() {
  const [affiliates, setAffiliates] = useState<AffiliateData[]>([]);
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'affiliates' | 'payouts'>('affiliates');
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [affiliatesRes, payoutsRes] = await Promise.all([
        api.request('/api/v1/affiliate/admin/affiliates', { method: 'GET' }).catch(() => []),
        api.request('/api/v1/affiliate/admin/payouts/pending', { method: 'GET' }).catch(() => []),
      ]);
      setAffiliates(Array.isArray(affiliatesRes) ? affiliatesRes : []);
      setPayouts(Array.isArray(payoutsRes) ? payoutsRes : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutAction = async (payoutId: number, action: 'approve' | 'reject') => {
    try {
      await api.request(`/api/v1/affiliate/admin/payouts/${payoutId}/process`, {
        method: 'POST',
        body: JSON.stringify({ action, admin_notes: `${action}d by admin` }),
      });
      await fetchData();
      alert(`Payout ${action}d successfully`);
    } catch (error) {
      console.error('Error processing payout:', error);
      alert(`Failed to ${action} payout`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredAffiliates = affiliates.filter(aff =>
    aff.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (aff.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (aff.user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommissions = affiliates.reduce((sum, a) => sum + (a.total_commission || 0), 0);
  const totalReferrals = affiliates.reduce((sum, a) => sum + (a.total_referrals || 0), 0);
  const pendingPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Referral Management"
        description="Track affiliate performance, approve payouts, and keep partners engaged."
        actions={
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950/60 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Total Affiliates</p>
          <p className="text-2xl font-bold text-white">{affiliates.length}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Total Referrals</p>
          <p className="text-2xl font-bold text-blue-600">{totalReferrals}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Total Commissions</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCommissions)}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Pending Payouts</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(pendingPayouts)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-950/60 rounded-lg shadow-md border border-slate-900">
        <div className="border-b border-slate-900">
          <div className="flex">
            <button
              onClick={() => setActiveTab('affiliates')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'affiliates'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Affiliates ({affiliates.length})
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'payouts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Pending Payouts ({payouts.length})
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'affiliates' && (
            <>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search affiliates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-950/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Affiliate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referrals</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-950/60 divide-y divide-gray-200">
                    {filteredAffiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="hover:bg-slate-950/70">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{affiliate.user?.full_name || 'N/A'}</div>
                          <div className="text-sm text-slate-500">{affiliate.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm">
                            {affiliate.referral_code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{affiliate.total_referrals || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(affiliate.total_commission)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {formatCurrency(affiliate.available_balance)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            affiliate.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {affiliate.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(affiliate.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAffiliates.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No affiliates found</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'payouts' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-950/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Requested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-950/60 divide-y divide-gray-200">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-slate-950/70">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{payout.user?.full_name || 'N/A'}</div>
                        <div className="text-sm text-slate-500">{payout.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">{formatCurrency(payout.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {payout.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(payout.requested_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePayoutAction(payout.id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handlePayoutAction(payout.id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {payouts.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending payouts</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
