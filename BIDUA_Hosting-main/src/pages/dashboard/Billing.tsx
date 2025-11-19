import { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  id: string;
  date: string;
  amount?: number; // Keep for backward compatibility
  total_amount?: number; // Backend uses this
  status: string;
  description: string;
  invoice_date?: string;
  invoice_number?: string;
  payment_status?: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export function Billing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payment-methods'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);

      // Load invoices
      try {
        const invoiceResponse = await api.get('/api/v1/invoices/');
        const invoicesArray = Array.isArray(invoiceResponse) ? invoiceResponse : invoiceResponse?.invoices || [];
        setInvoices(invoicesArray);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      }

      // Load payment methods
      try {
        const paymentResponse = await api.get('/api/v1/billing/payment-methods');
        const methodsArray = Array.isArray(paymentResponse) ? paymentResponse : paymentResponse?.payment_methods || [];
        setPaymentMethods(methodsArray);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handlePayNow = async (invoice: Invoice) => {
    // Navigate to dedicated invoice payment page
    navigate(`/pay-invoice/${invoice.id}`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Navigate to invoice view page with invoice data
    navigate(`/invoice/${invoice.id}`, { state: { invoice } });
  };

  // Calculate total outstanding balance
  const calculateOutstandingBalance = () => {
    return invoices
      .filter(inv => (inv.payment_status || inv.status) === 'pending' || (inv.payment_status || inv.status) === 'unpaid')
      .reduce((total, inv) => total + Number(inv.total_amount || inv.amount || 0), 0);
  };

  const outstandingBalance = calculateOutstandingBalance();

  return (
    <div className="space-y-4 sm:space-y-6 w-full h-full overflow-y-auto pb-6 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-sm sm:text-base text-slate-400">Manage your invoices and payment methods</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Current Balance</h3>
            <p className="text-xs sm:text-sm text-slate-400">Your account balance</p>
          </div>
          <div className="text-left sm:text-right">
            <p className={`text-2xl sm:text-3xl font-bold ${outstandingBalance > 0 ? 'text-red-400' : 'text-cyan-400'}`}>
              ₹{outstandingBalance.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              {outstandingBalance > 0 ? `${invoices.filter(inv => (inv.payment_status || inv.status) === 'pending' || (inv.payment_status || inv.status) === 'unpaid').length} pending invoice${invoices.filter(inv => (inv.payment_status || inv.status) === 'pending' || (inv.payment_status || inv.status) === 'unpaid').length !== 1 ? 's' : ''}` : 'No outstanding balance'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden w-full">
        <div className="border-b border-cyan-500/30 overflow-x-auto">
          <div className="flex w-full min-w-max">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('payment-methods')}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'payment-methods'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              Payment Methods
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-slate-400">Loading...</p>
            </div>
          ) : activeTab === 'invoices' ? (
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No invoices yet</p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-6">
                    <table className="min-w-full divide-y divide-cyan-500/30">
                      <thead>
                        <tr className="border-b border-cyan-500/30">
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Invoice ID</th>
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Date</th>
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Description</th>
                          <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Amount</th>
                          <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Status</th>
                          <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-500/10">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-slate-950 transition">
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                              {invoice.invoice_number || invoice.id}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                              {new Date(invoice.invoice_date || invoice.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-400 min-w-[150px] sm:min-w-[200px]">{invoice.description}</td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-white text-right whitespace-nowrap">
                              ₹{Number(invoice.total_amount || invoice.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <span
                                  className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    invoice.payment_status || invoice.status
                                  )}`}
                                >
                                  {getStatusIcon(invoice.payment_status || invoice.status)}
                                  <span className="capitalize">{invoice.payment_status || invoice.status}</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                {((invoice.payment_status || invoice.status) === 'pending' || (invoice.payment_status || invoice.status) === 'unpaid') && (
                                  <button
                                    onClick={() => handlePayNow(invoice)}
                                    disabled={loading}
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition disabled:opacity-50"
                                  >
                                    <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>Pay Now</span>
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleViewInvoice(invoice)}
                                  className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition"
                                >
                                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  <span className="hidden sm:inline">View & Print</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-slate-400 mb-4">No payment methods added</p>
                  <button className="px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 text-sm sm:text-base">
                    Add Payment Method
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-950 rounded-lg border border-cyan-500/30"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-slate-400">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                          {method.isDefault && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {!method.isDefault && (
                          <button className="px-3 sm:px-4 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition">
                            Set Default
                          </button>
                        )}
                        <button className="px-3 sm:px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full px-6 py-3 bg-slate-950 border border-cyan-500/30 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500/10 transition">
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
