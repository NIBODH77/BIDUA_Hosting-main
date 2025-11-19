import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  gst_percent?: number;
  tds_percent?: number;
  amount: number;
}

interface Invoice {
  id: string | number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  status: string;
  description?: string;
  items: InvoiceItem[];
  currency?: string;
  payment_method?: string;
  payment_date?: string;
  payment_reference?: string;
}

export function InvoiceView() {
  const { invoiceId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice | null>(location.state?.invoice || null);
  const [loading, setLoading] = useState(!invoice);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/v1/invoices/${invoiceId}`);
      setInvoice(data);
    } catch (error) {
      console.error('Failed to load invoice:', error);
      alert('Failed to load invoice');
      navigate('/dashboard/billing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoice && invoiceId) {
      loadInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const handleDownload = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Invoice not found</div>
      </div>
    );
  }

  const cgst = invoice.tax_amount / 2;
  const sgst = invoice.tax_amount / 2;

  return (
    <>
      <style>
        {`
          @media print {
            html, body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            * {
              box-shadow: none !important;
              text-shadow: none !important;
              filter: none !important;
              backdrop-filter: none !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            @page {
              margin: 0;
              size: A4 portrait;
            }
            
            /* Force single page compact layout with internal padding */
            .invoice-container {
              font-size: 10px !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 12mm !important;
            }
            /* Force single page compact layout with internal padding */
            .invoice-container {
              font-size: 10px !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 12mm !important;
              box-sizing: border-box !important;
            }
            
            .invoice-header {
              padding: 8px !important;
              border-bottom-width: 3px !important;
              margin: 0 !important;
            }
            
            .invoice-body {
              padding: 10px 0 !important;
            }
            
            .invoice-section {
              margin-bottom: 6px !important;
            }
            
            .invoice-grid {
              gap: 12px !important;
              margin-bottom: 6px !important;
            }
            
            h1 {
              font-size: 18px !important;
              margin: 0 !important;
            }
            
            .invoice-number {
              font-size: 20px !important;
              margin: 0 !important;
            }
            
            table {
              font-size: 9px !important;
              margin-bottom: 6px !important;
            }
            
            th {
              padding: 4px 6px !important;
            }
            
            td {
              padding: 4px 6px !important;
            }
            
            .terms-section {
              font-size: 8px !important;
              line-height: 1.2 !important;
              padding-top: 6px !important;
              margin-top: 6px !important;
            }
            
            .terms-section p {
              margin-bottom: 2px !important;
            }
            
            .bank-details {
              padding: 6px !important;
              font-size: 8px !important;
              margin-top: 6px !important;
            }
            
            .bank-grid {
              gap: 8px !important;
            }
            
            .bank-grid > div {
              margin-bottom: 3px !important;
            }
            
            .footer-section {
              margin-top: 8px !important;
              padding-top: 6px !important;
              font-size: 8px !important;
            }
            
            .footer-section p {
              margin-bottom: 2px !important;
            }
            
            .totals-section {
              margin-bottom: 6px !important;
            }
            
            .totals-section > div {
              width: 60% !important;
            }
            
            .logo-container {
              width: 40px !important;
              height: 40px !important;
            }
            
            .logo-text {
              font-size: 16px !important;
            }
            
            /* Ensure everything fits on one page */
            .avoid-break {
              page-break-inside: avoid !important;
            }
            
            /* Hide discount column in print to save space */
            .hide-print {
              display: none !important;
            }
          }
          
          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .invoice-grid {
              grid-template-columns: 1fr !important;
            }
            
            .invoice-header-grid {
              flex-direction: column !important;
              gap: 16px !important;
            }
            
            .text-right-desktop {
              text-align: left !important;
            }
            
            .bank-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      
      <div className="min-h-screen bg-slate-950 py-4 md:py-8">
        <div className="max-w-[210mm] mx-auto px-2 md:px-4">
          
          {/* Header Actions - Hidden in print */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 print:hidden no-print gap-3">
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition text-sm md:text-base"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span>Back to Billing</span>
            </button>
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition border border-cyan-500/30 text-sm md:text-base"
              >
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm md:text-base"
              >
                Save as PDF
              </button>
            </div>
          </div>

          {/* Professional Invoice Document */}
          <div className="bg-white text-black shadow-xl invoice-container">
            
            {/* Header with Logo and Invoice Number */}
            <div className="border-b-4 border-teal-600 p-3 md:p-6 invoice-header">
              <div className="flex flex-col md:flex-row justify-between items-start gap-3 invoice-header-grid">
                {/* Company Logo & Name */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 md:w-12 md:h-12 bg-teal-600 rounded flex items-center justify-center logo-container">
                      <span className="text-white font-bold text-base md:text-xl logo-text">B</span>
                    </div>
                    <div>
                      <h1 className="text-base md:text-xl font-bold text-slate-900">BIDUA INDUSTRIES</h1>
                      <p className="text-xs text-slate-600">PVT LTD</p>
                    </div>
                  </div>
                </div>
                
                {/* Invoice Number & Status */}
                <div className="text-left md:text-right text-right-desktop w-full md:w-auto">
                  <div className="text-xl md:text-3xl font-bold text-teal-600 mb-1">INVOICE</div>
                  <div className="text-base md:text-xl font-semibold text-slate-700">{invoice.invoice_number}</div>
                </div>
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="p-3 md:p-6 invoice-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-6 invoice-grid invoice-section">
                
                {/* Issue Date & For */}
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Issue Date:</div>
                    <div className="text-xs md:text-sm font-medium">{new Date(invoice.invoice_date).toLocaleDateString('en-GB')}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Due Date:</div>
                    <div className="text-xs md:text-sm font-medium text-red-600">{new Date(invoice.due_date).toLocaleDateString('en-GB')}</div>
                  </div>
                  
                  <div className="pt-1 md:pt-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Issue For:</div>
                    <div className="font-semibold text-xs md:text-sm">Valued Customer</div>
                    <div className="text-xs text-slate-600 mt-1">Account ID: {invoice.id}</div>
                    {invoice.description && (
                      <div className="text-xs text-slate-600 mt-1">{invoice.description}</div>
                    )}
                  </div>
                </div>

                {/* Issued By */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Issued By:</div>
                  <div className="font-semibold text-xs md:text-sm mb-1">BIDUA Industries Pvt Ltd</div>
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <p>Office 201, B 158, Sector 63,</p>
                    <p>Noida, Uttar Pradesh 201301, India</p>
                    <p className="mt-1 font-medium">GSTIN: 09AAMCR4056L1ZS</p>
                    <p>PAN: AAMCR4056L | SAC: 998315</p>
                    <p className="mt-1">Email: support@bidua.com</p>
                    <p>Phone: +91 120 416 8464</p>
                  </div>
                </div>
              </div>

              {/* Item Description Table */}
              <div className="mb-3 md:mb-4 invoice-section avoid-break overflow-x-auto">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100 border-y-2 border-slate-300">
                      <th className="text-left py-2 px-2 md:px-3 text-xs font-bold text-slate-700">Item Description</th>
                      <th className="text-center py-2 px-2 md:px-3 text-xs font-bold text-slate-700">Qty</th>
                      <th className="text-right py-2 px-2 md:px-3 text-xs font-bold text-slate-700">Amount</th>
                      <th className="text-right py-2 px-2 md:px-3 text-xs font-bold text-slate-700 hidden md:table-cell hide-print">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="py-2 px-2 md:px-3 text-xs text-slate-700">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">SAC: 998315</div>
                        </td>
                        <td className="py-2 px-2 md:px-3 text-center text-xs text-slate-700">{item.quantity}</td>
                        <td className="py-2 px-2 md:px-3 text-right text-xs font-semibold text-slate-900">
                          Rs. {Number(item.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-2 md:px-3 text-right text-xs text-green-600 hidden md:table-cell hide-print">
                          {item.discount_percent ? `Rs. ${(Number(item.amount) * Number(item.discount_percent) / 100).toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-3 md:mb-5 invoice-section avoid-break totals-section">
                <div className="w-full md:w-72">
                  <div className="space-y-1 md:space-y-1.5 border-t-2 border-slate-300 pt-2 md:pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold">Rs. {Number(invoice.subtotal || 0).toFixed(2)}</span>
                    </div>
                    
                    {invoice.tax_amount > 0 && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">9.00% CGST:</span>
                          <span className="font-semibold">Rs. {cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">9.00% SGST:</span>
                          <span className="font-semibold">Rs. {sgst.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    
                    {invoice.amount_paid > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Credits / Paid:</span>
                        <span className="font-semibold">Rs. {Number(invoice.amount_paid).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm md:text-base font-bold border-t-2 border-slate-300 pt-1.5 md:pt-2 mt-1.5 md:mt-2">
                      <span>Total:</span>
                      <span className="text-teal-600">Rs. {Number(invoice.total_amount || 0).toFixed(2)}</span>
                    </div>
                    
                    {invoice.balance_due > 0 && (
                      <div className="flex justify-between text-sm md:text-base font-bold text-red-600 bg-red-50 -mx-2 px-2 py-1 md:py-1.5 rounded">
                        <span>Balance Due:</span>
                        <span>Rs. {Number(invoice.balance_due).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information if Paid */}
              {invoice.payment_status === 'paid' && invoice.payment_date && (
                <div className="bg-green-50 border-l-4 border-green-500 p-2 md:p-3 mb-3 md:mb-4 invoice-section avoid-break">
                  <h3 className="font-semibold text-green-900 mb-1 md:mb-2 text-xs md:text-sm">✓ Payment Received</h3>
                  <div className="text-xs text-green-800 space-y-0.5 md:space-y-1">
                    <p><span className="font-semibold">Payment Date:</span> {new Date(invoice.payment_date).toLocaleString('en-GB')}</p>
                    <p><span className="font-semibold">Payment Method:</span> {invoice.payment_method || 'Razorpay'}</p>
                    {invoice.payment_reference && (
                      <p><span className="font-semibold">Reference:</span> {invoice.payment_reference}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Terms & Conditions - Compact */}
              <div className="border-t-2 border-slate-200 pt-3 md:pt-6 mt-3 md:mt-6 invoice-section avoid-break">
                <h3 className="font-bold text-xs md:text-sm mb-2 md:mb-3 text-slate-900">PAYMENT TERMS & CONDITIONS</h3>
                <div className="text-[10px] md:text-xs text-slate-600 space-y-1 md:space-y-2 leading-relaxed terms-section">
                  <p><strong>Payment Terms:</strong> Due within 7 days. Late payments may incur charges.</p>
                  <p><strong>Methods:</strong> Bank Transfer, Card, UPI, Razorpay.</p>
                  <p><strong>Refunds:</strong> As per Service Level Agreement.</p>
                  <p><strong>Taxes:</strong> GST 18% (9% CGST + 9% SGST) included.</p>
                  <p><strong>Disputes:</strong> Raise within 15 days of invoice date.</p>
                </div>
              </div>

              {/* Bank Details for Payment - Compact */}
              {invoice.payment_status !== 'paid' && (
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-slate-50 border border-slate-200 rounded invoice-section avoid-break bank-details">
                  <h3 className="font-bold text-xs mb-1 md:mb-2">BANK DETAILS FOR PAYMENT</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3 text-[10px] md:text-xs bank-grid">
                    <div>
                      <p className="text-slate-600">Account Name:</p>
                      <p className="font-semibold">BIDUA Industries Pvt Ltd</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Bank Name:</p>
                      <p className="font-semibold">HDFC Bank</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Account Number:</p>
                      <p className="font-semibold">50200012345678</p>
                    </div>
                    <div>
                      <p className="text-slate-600">IFSC Code:</p>
                      <p className="font-semibold">HDFC0001234</p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-slate-600">UPI ID:</p>
                      <p className="font-semibold">bidua@hdfcbank</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer - Compact */}
              <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-slate-200 text-center footer-section">
                <p className="text-xs text-slate-600 mb-1">Thank you for your business!</p>
                <p className="text-[10px] md:text-xs text-slate-500">
                  This is a computer-generated invoice and does not require a signature.
                </p>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1">
                  For queries: <a href="mailto:support@bidua.com" className="text-teal-600">support@bidua.com</a> | +91 120 416 8464
                </p>
                <p className="text-[10px] text-slate-400 mt-2">© 2025 BIDUA Industries Pvt Ltd. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
