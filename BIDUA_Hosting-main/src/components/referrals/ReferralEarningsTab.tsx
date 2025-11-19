import { useState, useEffect } from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { getReferralEarnings, formatCurrency } from '../../lib/referral';
import { ReferralEarning } from '../../types';

export function ReferralEarningsTab() {
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const data = await getReferralEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading earnings...</div>
      </div>
    );
  }

  if (earnings.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Earnings Yet</h3>
        <p className="text-slate-400">
          Share your referral code to start earning commissions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {earnings.map((earning: any) => (
        <div
          key={earning.id}
          className="bg-slate-800 rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-white">
                  {earning.referral_user?.full_name || 'Unknown User'}
                </span>
                <span className="text-xs text-slate-400">
                  ({earning.referral_user?.referral_code})
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Level {earning.level} • {earning.commission_percentage}% commission
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date(earning.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                +{formatCurrency(earning.commission_amount)}
              </div>
              <div className="text-xs text-slate-400">
                Order: {formatCurrency(earning.order_amount)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Order #:</span>
              <span className="text-xs text-white font-mono">
                {earning.order?.order_number || 'N/A'}
              </span>
            </div>
            {earning.is_recurring && (
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                Recurring
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
