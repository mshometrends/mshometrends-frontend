import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Upload,
  Search,
  Building2,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { openWhatsAppOrderChat } from '../utils/whatsapp';
import { downloadOrderPDF, shareOrOpenWhatsAppWithPDF } from '../utils/pdfInvoice';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Screenshot upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [transRef, setTransRef] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrder(json.data);
      } else {
        setError(json.message || 'Order not found.');
      }
    } catch (err: any) {
      setError('Unable to fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds maximum limit of 5MB.');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleUploadScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !orderId) return;

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const formData = new FormData();
      formData.append('screenshot', selectedFile);
      if (transRef) {
        formData.append('transactionReference', transRef);
      }

      const res = await apiFetch(`/api/orders/${orderId}/payment-screenshot`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setUploadSuccess('Payment screenshot uploaded! Admin is reviewing your payment.');
        setSelectedFile(null);
        setFilePreview(null);
        setTransRef('');
        // Refresh order details
        fetchOrderDetails();
      } else {
        setUploadError(json.message || 'Failed to upload payment screenshot.');
      }
    } catch (err: any) {
      setUploadError('Error uploading screenshot. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-300">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-200">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested order ID does not exist.'}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#0A3825] hover:bg-[#062418] text-white px-6 py-2.5 rounded-xl text-sm font-medium border border-[#D4AF37]/30 transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const paymentStatus = order.payment?.status || 'Pending';
  const orderStatus = order.orderStatus || 'Pending Payment';
  const invoiceUrl = order.invoiceUrl || `/invoice/${order.orderId}`;
  const totalAmount = order.pricing?.total ?? order.totalAmount ?? order.total ?? 0;
  const customerName = order.customer?.fullName || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Thank You For Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Order ID:{' '}
                <span className="font-mono font-bold text-amber-300">{order.orderId}</span> • Invoice:{' '}
                <span className="font-mono text-slate-300">{order.invoiceNumber}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <button
                onClick={() => shareOrOpenWhatsAppWithPDF(order)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer border border-emerald-400/40"
                title="Send Bill & Details to WhatsApp (+92 324 2303895)"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Send Bill on WhatsApp</span>
              </button>

              <button
                onClick={() => navigate(invoiceUrl)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                title="View Online Invoice"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Invoice</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Payment Status
              </p>
              <p className="text-lg font-bold text-white mt-1">{paymentStatus}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                paymentStatus === 'Paid'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : paymentStatus === 'Screenshot Received' || paymentStatus === 'Under Review'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : paymentStatus === 'Rejected'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {paymentStatus}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Order Status
              </p>
              <p className="text-lg font-bold text-white mt-1">{orderStatus}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {orderStatus}
            </span>
          </div>
        </div>

        {/* Bill & Quick Actions Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A3825]/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Official Invoice Generated
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                MS Home Trends Official Bill
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Your order bill is ready. Send it directly to our official WhatsApp (+92 324 2303895) with your payment screenshot for immediate processing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => shareOrOpenWhatsAppWithPDF(order)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 transition-all cursor-pointer border border-emerald-400/40"
              >
                <MessageSquare className="w-4 h-4 fill-white" /> Send Bill on WhatsApp (+92 324 2303895)
              </button>

              <button
                onClick={() => navigate(invoiceUrl)}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" /> View Online
              </button>

              <button
                onClick={() => downloadOrderPDF(order)}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                title="Download PDF copy (Optional)"
              >
                <Download className="w-4 h-4 text-amber-400" /> PDF Copy
              </button>
            </div>
          </div>

          {/* Mini Bill Preview Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Order Items</span>
              <p className="font-bold text-white text-sm">{order.items?.length || 1} Item(s)</p>
              <p className="text-slate-400 text-[11px] truncate">
                {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Bill Amount</span>
              <p className="font-mono font-bold text-amber-300 text-base">
                Rs. {totalAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-emerald-400 text-[11px]">Delivery & Charges Included</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Barcode & Security</span>
              <p className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                ||| || | |||| | {order.orderId} |||
              </p>
              <p className="text-emerald-300 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Insured & Breakage Protected
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps Info Box */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-xs text-emerald-200/90 space-y-2 flex gap-3 items-start">
          <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-300 text-sm">How Easypaisa Payment Works:</h4>
            <p className="leading-relaxed">
              1. Transfer the exact amount <strong>Rs. {totalAmount.toFixed(2)}</strong> to
              our official <strong>Easypaisa Account (0324-2303895 / MS Home Trends)</strong> below.
            </p>
            <p className="leading-relaxed">
              2. Click <strong>"Send Bill on WhatsApp"</strong> to send your complete bill details directly to <strong>+92 324 2303895</strong> along with your transfer screenshot for rapid confirmation!
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => shareOrOpenWhatsAppWithPDF(order)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-emerald-400/40 shadow-lg transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Send Bill on WhatsApp (+92 324 2303895)
            </button>

            <button
              onClick={() => navigate(invoiceUrl)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" /> View Online Invoice
            </button>

            <button
              onClick={() => downloadOrderPDF(order)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" /> Download PDF (Optional)
            </button>
          </div>

          <button
            onClick={() => navigate(`/track-order?query=${order.orderId}`)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-emerald-400" /> Track Order Status
          </button>
        </div>

        {/* Easypaisa Payment Account Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              EP
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Official Easypaisa Payment Account
              </h3>
              <p className="text-xs text-slate-400">
                Send Easypaisa transfer to the verified account below
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl relative group shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                  Easypaisa Direct Account
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white pt-1">
                  MS Home Trends
                </h4>
                <p className="text-slate-400 text-xs font-medium">
                  Verified Merchant / Mobile Wallet Account
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-slate-300 bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4 min-w-[260px]">
                <div>
                  <p className="text-[10px] text-slate-400 font-sans">Easypaisa Number:</p>
                  <p className="text-base font-bold text-amber-300 tracking-wider">0324 2303895</p>
                  <p className="text-[10px] text-slate-500 font-sans">+92 324 2303895</p>
                </div>
                <button
                  onClick={() => handleCopy('03242303895', 'easy')}
                  className="px-3 py-2 bg-emerald-700/40 hover:bg-emerald-600 text-white rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  title="Copy Easypaisa number"
                >
                  {copiedKey === 'easy' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary WhatsApp Payment Proof Section */}
        <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-6 h-6 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  Send Invoice & Transfer Proof on WhatsApp
                </h3>
                <p className="text-xs text-slate-300">
                  Fastest way to get your order confirmed! Open WhatsApp and attach your transfer screenshot.
                </p>
              </div>
            </div>

            <button
              onClick={() => shareOrOpenWhatsAppWithPDF(order)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2.5 shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer border border-emerald-400/30"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Send PDF Bill & Screenshot on WhatsApp</span>
            </button>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span className="text-emerald-300 font-medium">
              💡 Tip: Click above to automatically send Order #{order.orderId} invoice details & send your transfer receipt.
            </span>
            <span className="text-slate-400 text-[11px] font-mono">Store WhatsApp: +92 324 2303895</span>
          </div>
        </div>

        {/* Payment Screenshot Upload Section (Optional Web Upload) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Upload className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Optionally Upload Screenshot on Website
              </h3>
              <p className="text-xs text-slate-400">
                You can also upload your Easypaisa payment transfer receipt here for record-keeping
              </p>
            </div>
          </div>

          {order.payment?.screenshotUrl ? (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
                <Check className="w-4 h-4" /> Screenshot Currently Uploaded
              </div>

              <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-2">
                <img
                  src={order.payment.screenshotUrl}
                  alt="Payment Screenshot"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <p className="text-xs text-slate-400">
                Status: <strong className="text-amber-300">{paymentStatus}</strong>. Admin is reviewing your submitted payment proof.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUploadScreenshot} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition-all relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {filePreview ? (
                  <div className="space-y-3">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-xl border border-slate-700 object-contain"
                    />
                    <p className="text-xs text-emerald-400 font-medium">
                      Selected: {selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(0)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">
                      Click or drag payment screenshot here
                    </p>
                    <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction Reference / TRX ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 982371923"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  {uploadSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading Screenshot...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Submit Payment Proof
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Customer Shipping Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-serif font-bold text-white border-b border-slate-800 pb-3">
            Shipping & Customer Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div>
              <p className="text-slate-500 font-medium">Customer Name:</p>
              <p className="font-bold text-white">{order.customer?.fullName}</p>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Phone & WhatsApp:</p>
              <p className="font-bold text-white">
                {order.customer?.phone} / {order.customer?.whatsappNumber}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-500 font-medium">Delivery Address:</p>
              <p className="font-bold text-white">
                {order.customer?.address}, {order.customer?.city} {order.customer?.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
