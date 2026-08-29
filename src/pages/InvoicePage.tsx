import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, MessageSquare, ArrowLeft, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { downloadOrderPDF, shareOrOpenWhatsAppWithPDF } from '../utils/pdfInvoice';
import { Order } from '../types';

export const InvoicePage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await apiFetch(`/api/orders/${orderId}/invoice`);
        const json = await res.json();
        if (json.success && json.data?.order) {
          setOrder(json.data.order);
        } else {
          // Fallback search
          const res2 = await apiFetch(`/api/orders/${orderId}`);
          const json2 = await res2.json();
          if (json2.success && json2.data) {
            setOrder(json2.data);
          } else {
            setError('Invoice not found.');
          }
        }
      } catch (err) {
        setError('Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Generating official invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Invoice Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'Requested invoice does not exist.'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#0A3825] text-white px-6 py-2.5 rounded-xl text-sm font-medium"
        >
          Return Home
        </button>
      </div>
    );
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans print:bg-white print:py-0 print:px-0">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-card { border: none !important; box-shadow: none !important; background: white !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => shareOrOpenWhatsAppWithPDF(order)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Send Bill on WhatsApp (+92 324 2303895)
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print
            </button>

            <button
              onClick={() => downloadOrderPDF(order)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-amber-400" /> Download PDF (Optional)
            </button>
          </div>
        </div>

        {/* Invoice Printable Card */}
        <div className="print-card bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-slate-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#0A3825] text-amber-400 flex items-center justify-center font-serif font-bold text-lg">
                  MS
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#0A3825] tracking-tight">
                    MS HOME TRENDS
                  </h1>
                  <p className="text-[11px] font-medium text-amber-700 uppercase tracking-widest">
                    Luxury Household & Fine Crockery
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Official WhatsApp: <span className="font-semibold text-slate-700">+92 324 2303895</span> • Web: <span className="font-semibold text-slate-700">mshometrends.com</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block bg-[#0A3825] text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                OFFICIAL INVOICE
              </span>
              <p className="text-xs font-semibold text-slate-500 pt-1">
                Invoice No:{' '}
                <strong className="text-slate-900 font-mono">{order.invoiceNumber}</strong>
              </p>
              <p className="text-xs font-semibold text-slate-500">
                Order ID: <strong className="text-[#0A3825] font-mono">{order.orderId}</strong>
              </p>
              <p className="text-xs text-slate-500">Date: {formattedDate}</p>
            </div>
          </div>

          {/* Customer & Status Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] mb-2 border-b border-slate-200 pb-1">
                Billed & Shipped To:
              </h4>
              <p className="font-bold text-slate-900 text-sm">{order.customer?.fullName}</p>
              <p className="text-slate-600">Phone: {order.customer?.phone}</p>
              <p className="text-slate-600">WhatsApp: {order.customer?.whatsappNumber}</p>
              {order.customer?.email && <p className="text-slate-600">Email: {order.customer?.email}</p>}
              <p className="text-slate-700 font-medium pt-1">
                Address: {order.customer?.address}, {order.customer?.city}{' '}
                {order.customer?.postalCode}
              </p>
            </div>

            <div className="space-y-2 sm:text-right">
              <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] mb-2 border-b border-slate-200 pb-1">
                Payment & Order Status:
              </h4>
              <div className="space-y-1.5">
                <p className="text-slate-600">
                  Payment Method:{' '}
                  <strong className="text-slate-900 font-semibold">
                    {order.payment?.method || 'Easypaisa'}
                  </strong>
                </p>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="text-slate-600">Payment Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    {order.payment?.status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="text-slate-600">Order Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {order.orderStatus || 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* EasyPaisa Payment Account Box */}
          <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                Official EasyPaisa Account: <span className="font-mono font-bold text-amber-800 text-sm">0324 2303895</span> (MS Home Trends)
              </p>
              <p className="text-[11px] text-emerald-800">
                Transfer exact bill amount and send screenshot to WhatsApp +92 324 2303895 for instant confirmation.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Insured Delivery
            </span>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50">
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold text-center">Qty</th>
                  <th className="py-3 px-4 font-bold text-right">Unit Price</th>
                  <th className="py-3 px-4 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-500">Code: {item.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-4 px-4 text-right font-medium text-slate-700">
                      Rs. {(item.price ?? 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[#0A3825]">
                      Rs. {(item.subtotal || ((item.price || 0) * (item.quantity || 1))).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary & Barcode Section */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 border-t border-slate-200">
            {/* Visual Barcode */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 w-full sm:w-auto">
              <div className="font-mono text-lg tracking-widest text-slate-900 font-bold">
                |||| | || |||| | ||| ||| |
              </div>
              <p className="font-mono text-xs font-bold text-slate-700">* {order.orderId} *</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Verified Order Barcode</p>
            </div>

            {/* Price Calculations */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  Rs. {(order.pricing?.subtotal ?? order.subtotalAmount ?? order.subtotal ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-semibold text-slate-900">
                  Rs. {(order.pricing?.deliveryCharges ?? order.shippingFee ?? order.shipping ?? 0).toFixed(2)}
                </span>
              </div>

              {((order.pricing?.discount || order.discountAmount || 0) > 0) && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-Rs. {(order.pricing?.discount ?? order.discountAmount ?? 0).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[#0A3825] pt-3 border-t-2 border-[#0A3825]">
                <span>Grand Total</span>
                <span>Rs. {(order.pricing?.total ?? order.totalAmount ?? order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
            <p className="font-serif font-bold text-[#0A3825]">Thank you for shopping with MS Home Trends!</p>
            <p>For order queries, please contact our support team on WhatsApp (+92 324 2303895) or Email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
