import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  description: string;
  subtotal: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  balance_due: string | number;
  payment_status: string;
  currency: string;
  items?: any[];
}

export function InvoicePayment() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/v1/invoices/${invoiceId}`);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!invoice) return;

    try {
      setPaying(true);

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = async () => {
        try {
          // Create payment order
          const amountToPay = Number(invoice.balance_due || invoice.total_amount);
          
          const paymentOrderResponse = await api.post('/api/v1/payments/create-order', {
            payment_type: 'invoice',
            amount: amountToPay,
            invoice_id: invoice.id
          });

          if (!paymentOrderResponse.success) {
            throw new Error('Failed to create payment order');
          }

          const { payment } = paymentOrderResponse;

          // Initialize Razorpay
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: payment.total_amount * 100,
            currency: payment.currency || 'INR',
            name: 'BIDUA Hosting',
            description: `Payment for Invoice #${invoice.invoice_number}`,
            order_id: payment.razorpay_order_id,
            handler: async (response: any) => {
              try {
                // Verify payment
                const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verificationResponse.success) {
                  // Payment successful - redirect to invoice view
                  navigate(`/invoice/${invoice.id}`, {
                    state: { paymentSuccess: true }
                  });
                }
              } catch (error: any) {
                alert(`Payment verification failed: ${error.message}`);
                setPaying(false);
              }
            },
            modal: {
              ondismiss: () => {
                setPaying(false);
              }
            },
            theme: {
              color: '#06b6d4'
            }
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (error: any) {
          alert(error.message || 'Failed to initiate payment');
          setPaying(false);
        }
      };

      script.onerror = () => {
        alert('Failed to load payment gateway. Please try again.');
        setPaying(false);
      };

      document.body.appendChild(script);
    } catch (error: any) {
      console.error('Failed to initiate payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Invoice Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The invoice you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/dashboard/billing')}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            Back to Billing
          </button>
        </div>
      </div>
    );
  }

  if (invoice.payment_status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Invoice Already Paid</h2>
          <p className="text-slate-400 mb-6">This invoice has already been paid.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
            >
              Back to Billing
            </button>
            <button
              onClick={() => navigate(`/invoice/${invoice.id}`)}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              View Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard/billing')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Billing</span>
        </button>

        {/* Payment Card */}
        <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Payment</h1>
            </div>
            <p className="text-cyan-100">Complete payment for your invoice</p>
          </div>

          {/* Invoice Details */}
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <FileText className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Invoice Number:</span>
                    <p className="text-white font-medium">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Issue Date:</span>
                    <p className="text-white font-medium">
                      {new Date(invoice.invoice_date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Due Date:</span>
                    <p className="text-white font-medium">
                      {new Date(invoice.due_date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Description:</span>
                    <p className="text-white font-medium">{invoice.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="space-y-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-3">Amount Breakdown</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal:</span>
                <span className="text-white font-medium">₹{Number(invoice.subtotal).toFixed(2)}</span>
              </div>

              {invoice.tax_amount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax (18% GST):</span>
                    <span className="text-white font-medium">₹{Number(invoice.tax_amount).toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="border-t border-slate-600 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-cyan-400">₹{Number(invoice.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {invoice.balance_due !== invoice.total_amount && (
                <div className="flex justify-between text-lg font-bold border-t border-slate-600 pt-3">
                  <span className="text-white">Balance Due:</span>
                  <span className="text-red-400">₹{Number(invoice.balance_due).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Payment Button */}
            <div className="pt-4">
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {paying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay ₹{Number(invoice.balance_due || invoice.total_amount).toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>

            {/* View Invoice Link */}
            <div className="text-center">
              <button
                onClick={() => navigate(`/invoice/${invoice.id}`)}
                className="text-cyan-400 hover:text-cyan-300 transition text-sm"
              >
                View Full Invoice Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
