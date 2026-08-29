import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SEOHead } from '../components/SEOHead';
import { buildBreadcrumbSchema } from '../utils/seoSchemas';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  PackageX,
  FileText,
  MessageSquare,
  Upload,
  ShieldCheck,
  Building2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { openWhatsAppOrderChat } from '../utils/whatsapp';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

export const TrackOrderPage: React.FC = () => {
  const { currentUser, setIsAuthModalOpen } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload screenshot modal/inline for specific order
  const [activeUploadOrder, setActiveUploadOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders/track/${encodeURIComponent(queryToSearch.trim())}`);
      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        setOrders(json.data);
      } else {
        setOrders([]);
        setError('No order found matching your search query. Please check your Order ID or Phone number.');
      }
    } catch (err) {
      setError('Error searching order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [queryParam]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery.trim() });
      handleSearch(searchQuery.trim());
    }
  };

  const handleUploadScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !activeUploadOrder) return;

    try {
      setUploading(true);
      setUploadMessage(null);

      const formData = new FormData();
      formData.append('screenshot', selectedFile);

      const res = await fetch(`/api/orders/${activeUploadOrder.orderId}/payment-screenshot`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setUploadMessage('Screenshot uploaded! Status updated to Payment Under Review.');
        setSelectedFile(null);
        setFilePreview(null);
        // Refresh search results
        handleSearch(searchQuery);
        setTimeout(() => setActiveUploadOrder(null), 2000);
      } else {
        setUploadMessage(`Upload failed: ${json.message}`);
      }
    } catch (err: any) {
      setUploadMessage('Failed to upload screenshot.');
    } finally {
      setUploading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending Payment':
        return 0;
      case 'Payment Under Review':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Processing':
        return 3;
      case 'Shipped':
        return 4;
      case 'Out for Delivery':
        return 5;
      case 'Delivered':
        return 6;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const orderSteps = [
    'Pending Payment',
    'Payment Under Review',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-16 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Login Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Order tracking is available for logged-in customers. Please log in to your account to track active orders and shipping status.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-[#0A3825] hover:bg-[#062418] text-white font-bold py-3.5 px-6 rounded-2xl text-xs border border-[#D4AF37]/30 transition-all cursor-pointer shadow-lg"
          >
            Log In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Live Shipment Tracking & Order Status"
        description="Track your MS Home Trends luxury tableware order in real-time. View courier transit milestones and delivery progress."
        keywords="track crockery order, tableware shipping tracking, MS Home Trends delivery status"
        canonicalUrl="/track-order"
        noIndex={false}
        jsonLd={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Order Tracking', url: '/track-order' },
          ]),
        ]}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" /> Real-time Order Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Track Your Order Status
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Enter your <strong>Order ID</strong> (e.g. MS-2026-12345), <strong>Invoice Number</strong>,
            or <strong>Phone Number</strong> to view payment and shipping status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto">
          <div className="flex items-center bg-slate-900 border border-slate-800 focus-within:border-emerald-500 rounded-2xl p-2 shadow-xl transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order ID or Phone Number..."
              className="w-full bg-transparent border-none px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0A3825] hover:bg-[#062418] text-white font-bold px-6 py-2.5 rounded-xl text-xs border border-[#D4AF37]/30 transition-all cursor-pointer shrink-0"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Order Results List */}
        <div className="space-y-6">
          {orders.map((ord, idx) => {
            const currentStep = getStepIndex(ord.orderStatus);

            return (
              <motion.div
                key={ord.orderId || ord._id ? `${ord.orderId || ord._id}-${idx}` : `track-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Order Number:{' '}
                      <strong className="text-amber-300 font-mono text-sm">{ord.orderId}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Placed on: {new Date(ord.createdAt).toLocaleDateString()} • Customer:{' '}
                      <span className="text-slate-300 font-medium">{ord.customer?.fullName}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate(ord.invoiceUrl || `/invoice/${ord.orderId}`)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-700 font-medium flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> Invoice
                    </button>

                    <button
                      onClick={() =>
                        openWhatsAppOrderChat(ord.orderId, ord.invoiceUrl || `/invoice/${ord.orderId}`)
                      }
                      className="bg-emerald-700/80 hover:bg-emerald-600 text-xs text-white px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
                    </button>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Fulfillment Progress
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                    {orderSteps.map((stepName, idx) => {
                      const isCompleted = currentStep > idx;
                      const isCurrent = currentStep === idx;

                      return (
                        <div
                          key={stepName}
                          className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                            isCompleted
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                              : isCurrent
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 text-slate-600'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] font-bold">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <p className="text-[10px] leading-tight font-medium line-clamp-2">
                            {stepName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Badges & Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block font-medium">Payment Status:</span>
                    <span className="font-bold text-amber-300 text-sm mt-0.5 block">
                      {ord.payment?.status || 'Pending'}
                    </span>
                    {ord.payment?.screenshotUrl && (
                      <p className="text-[11px] text-emerald-400 mt-1">✓ Screenshot submitted</p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block font-medium">Order Total:</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      Rs. {(ord.pricing?.total ?? ord.totalAmount ?? ord.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Upload Payment Screenshot Button if status allows */}
                {(ord.payment?.status === 'Pending' || ord.payment?.status === 'Rejected') && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-300">Payment Pending / Proof Required</p>
                      <p className="text-amber-200/80">
                        Upload your payment screenshot to notify admin for fast verification.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveUploadOrder(ord);
                        setSelectedFile(null);
                        setFilePreview(null);
                        setUploadMessage(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Upload Payment Proof
                    </button>
                  </div>
                )}

                {/* Items Summary */}
                <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
                  <p className="font-bold text-slate-400">Order Items ({ord.items?.length}):</p>
                  <div className="space-y-2">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono text-slate-400">
                          Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upload Modal */}
        {activeUploadOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-serif font-bold text-white">
                  Upload Payment Screenshot
                </h3>
                <button
                  onClick={() => setActiveUploadOrder(null)}
                  className="text-slate-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Order ID: <strong className="text-amber-300">{activeUploadOrder.orderId}</strong>
              </p>

              <form onSubmit={handleUploadScreenshot} className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setFilePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg border border-slate-700"
                    />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs font-semibold text-slate-300">
                        Select screenshot image file
                      </p>
                    </div>
                  )}
                </div>

                {uploadMessage && (
                  <p className="text-xs text-amber-300 text-center font-medium">{uploadMessage}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveUploadOrder(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
                  >
                    {uploading ? 'Uploading...' : 'Submit Screenshot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
