import { useState, useEffect } from 'react';
import { DollarSign, Plus, CreditCard, Building2, Smartphone } from 'lucide-react';
import { getReferralPayouts, requestPayout, formatCurrency, getStatusColor } from '../../lib/referral';
import { ReferralPayout, ReferralStats, PaymentMethod } from '../../types';

interface ReferralPayoutsTabProps {
  stats: ReferralStats | null;
  onPayoutCreated: () => void;
}

export function ReferralPayoutsTab({ stats, onPayoutCreated }: ReferralPayoutsTabProps) {
  const [payouts, setPayouts] = useState<ReferralPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const data = await getReferralPayouts();
      setPayouts(data);
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!stats || stats.available_balance < 500) {
      alert('Minimum payout amount is ₹500');
      return;
    }

    if (paymentMethod === 'bank_transfer' && (!accountHolder || !accountNumber || !ifscCode || !bankName)) {
      alert('Please fill in all bank details');
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return;
    }

    if (paymentMethod === 'paypal' && !paypalEmail) {
      alert('Please enter PayPal email');
      return;
    }

    setProcessing(true);
    try {
      const paymentDetails: any = {};

      if (paymentMethod === 'bank_transfer') {
        paymentDetails.bank_account_details = {
          account_holder: accountHolder,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_name: bankName,
        };
      } else if (paymentMethod === 'upi') {
        paymentDetails.upi_id = upiId;
      } else if (paymentMethod === 'paypal') {
        paymentDetails.paypal_email = paypalEmail;
      }

      const result = await requestPayout(stats.available_balance, paymentMethod, paymentDetails);

      if (result.success) {
        setShowRequestForm(false);
        resetForm();
        await loadPayouts();
        onPayoutCreated();
      } else {
        alert(result.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Failed to request payout:', error);
      alert('Failed to request payout');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setAccountHolder('');
    setAccountNumber('');
    setIfscCode('');
    setBankName('');
    setUpiId('');
    setPaypalEmail('');
    setPaymentMethod('bank_transfer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading payouts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && stats.can_request_payout && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 border-2 border-green-400">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Ready for Payout!</h3>
              <p className="text-green-100 mb-4">
                You have {formatCurrency(stats.available_balance)} available for withdrawal
              </p>
              <div className="text-sm text-green-100 space-y-1">
                <div>• TDS (10%): {formatCurrency(stats.available_balance * 0.10)}</div>
                <div>• GST (18%): {formatCurrency(stats.available_balance * 0.18)}</div>
                <div className="font-semibold pt-2 border-t border-green-400">
                  Net Amount: {formatCurrency(stats.available_balance * 0.72)}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>
      )}

      {showRequestForm && (
        <div className="bg-slate-800 rounded-lg p-6 border border-cyan-500/30">
          <h3 className="text-lg font-bold text-white mb-4">Request Payout</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-lg border-2 transition ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-500/50'
                  }`}
                >
                  <Building2 className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-semibold">Bank Transfer</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-lg border-2 transition ${
                    paymentMethod === 'upi'
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-500/50'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-semibold">UPI</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-lg border-2 transition ${
                    paymentMethod === 'paypal'
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-500/50'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-semibold">PayPal</div>
                </button>
              </div>
            </div>

            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                    placeholder="Enter account number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                  placeholder="example@upi"
                />
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white"
                  placeholder="example@email.com"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleRequestPayout}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Submit Request'}
              </button>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {payouts.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Payout History</h3>
          <p className="text-slate-400">
            Your payout requests will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="bg-slate-800 rounded-lg p-6 border border-cyan-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-white">
                      Payout #{payout.payout_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                      {payout.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">
                    {new Date(payout.requested_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatCurrency(payout.net_amount)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Net Amount
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900 rounded-lg mb-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Gross Amount</div>
                  <div className="text-sm font-semibold text-white">
                    {formatCurrency(payout.gross_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">TDS (10%)</div>
                  <div className="text-sm font-semibold text-white">
                    -{formatCurrency(payout.tds_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">GST (18%)</div>
                  <div className="text-sm font-semibold text-white">
                    -{formatCurrency(payout.service_tax_amount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="text-white ml-2 capitalize">
                    {payout.payment_method.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Tax Year/Quarter:</span>
                  <span className="text-white ml-2">
                    {payout.tax_year} Q{payout.tax_quarter}
                  </span>
                </div>
              </div>

              {payout.payment_reference && (
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm">
                  <span className="text-slate-400">Payment Reference:</span>
                  <span className="text-green-400 ml-2 font-mono">{payout.payment_reference}</span>
                </div>
              )}

              {payout.rejected_reason && (
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm">
                  <span className="text-red-400 font-semibold">Rejection Reason:</span>
                  <p className="text-slate-300 mt-1">{payout.rejected_reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
