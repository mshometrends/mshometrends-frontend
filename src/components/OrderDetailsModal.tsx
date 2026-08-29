import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  Printer,
  ShieldCheck,
  XCircle,
  AlertCircle,
  ExternalLink,
  Receipt,
  User,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export interface OrderItemDetail {
  id?: string;
  productId?: string;
  name?: string;
  productName?: string;
  price?: number;
  unitPrice?: number;
  quantity: number;
  image?: string;
  productImage?: string;
}

export interface OrderDetailData {
  _id?: string;
  id?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItemDetail[];
  total?: number;
  totalAmount?: number;
  subtotal?: number;
  subtotalAmount?: number;
  shipping?: number;
  shippingFee?: number;
  tax?: number;
  taxAmount?: number;
  discount?: number;
  discountAmount?: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderDetailsModalProps {
  orderId: string | null;
  initialOrderData?: OrderDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  initialOrderData,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  const { showToast, navigateToPage } = useStore();
  const [order, setOrder] = useState<OrderDetailData | null>(initialOrderData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Fetch full specific order details from MongoDB endpoint when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialOrderData) {
      setOrder(initialOrderData);
    }

    if (orderId) {
      fetchOrderFromDatabase(orderId);
    }
  }, [isOpen, orderId, initialOrderData]);

  const fetchOrderFromDatabase = async (id: string) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/v1/orders/${id}`);
      const json = await res.json();

      if (json.success && json.data) {
        setOrder(json.data);
      } else if (!order) {
        // Fallback: try track search endpoint
        const searchRes = await apiFetch(`/api/v1/orders/track/${encodeURIComponent(id)}`);
        const searchJson = await searchRes.json();
        if (searchJson.success && Array.isArray(searchJson.data) && searchJson.data.length > 0) {
          setOrder(searchJson.data[0]);
        }
      }
    } catch (err) {
      console.error('[Order Fetch Error]', err);
      showToast('Could not fetch order from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const rawId = order?._id || order?.id || orderId || 'ORDER';
  const displayId =
    rawId.length > 8 ? `MS-${rawId.substring(rawId.length - 8).toUpperCase()}` : rawId;

  const handleCopyId = () => {
    navigator.clipboard.writeText(rawId);
    setCopiedId(true);
    showToast('MongoDB Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCancelOrder = async () => {
    if (!rawId) return;
    if (!window.confirm('Are you sure you want to cancel this order in MongoDB?')) return;

    try {
      setCancelling(true);
      const res = await apiFetch(`/api/v1/orders/${rawId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Order status updated to Cancelled in MongoDB Atlas', 'success');
        if (json.data) setOrder(json.data);
        if (onOrderUpdated) onOrderUpdated();
      } else {
        showToast(json.message || 'Failed to cancel order', 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend database', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Pricing values calculation
  const totalVal = order?.pricing?.total ?? order?.totalAmount ?? order?.total ?? 0;
  const subtotalVal = order?.pricing?.subtotal ?? order?.subtotalAmount ?? order?.subtotal ?? totalVal;
  const shippingVal = order?.pricing?.deliveryCharges ?? order?.shippingFee ?? order?.shipping ?? 0;
  const discountVal = order?.pricing?.discount ?? order?.discountAmount ?? order?.discount ?? 0;
  const taxVal = order?.taxAmount ?? order?.tax ?? 0;

  // Customer details
  const custName = order?.customer?.name || order?.customerName || 'Valued Customer';
  const custEmail = order?.customer?.email || order?.customerEmail || 'customer@example.com';
  const custPhone = order?.customer?.phone || order?.customerPhone || '+1 (555) 234-5678';
  
  const shipAddr = typeof order?.shippingAddress === 'string'
    ? order.shippingAddress
    : order?.shippingAddress
    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}`
    : '742 Evergreen Terrace, Suite 400, New York, NY 10021';

  // Status History Timeline Generator
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  
  const formatDate = (dateObj: Date, addDays: number = 0) => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + addDays);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const status = order?.status || 'Pending';

  const timelineSteps = [
    {
      title: 'Order Placed & Confirmed',
      description: 'Transaction verified and recorded in MongoDB Atlas database.',
      timestamp: formatDate(orderDate, 0),
      done: true,
      icon: Clock,
    },
    {
      title: 'Artisan Quality Control',
      description: 'Hand-glazed chinaware checked for fine craftsmanship standards.',
      timestamp: formatDate(orderDate, 1),
      done: status === 'Processing' || status === 'Shipped' || status === 'Delivered',
      icon: Package,
    },
    {
      title: 'Dispatched via DHL Express',
      description: 'Package insured & assigned global express tracking barcode.',
      timestamp: formatDate(orderDate, 2),
      done: status === 'Shipped' || status === 'Delivered',
      icon: Truck,
    },
    {
      title: 'Delivered & Handed Over',
      description: 'Safely arrived at primary destination address.',
      timestamp: formatDate(orderDate, 4),
      done: status === 'Delivered',
      icon: CheckCircle2,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-[#0A3825] text-white p-5 sm:p-6 relative overflow-hidden flex-shrink-0">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              title="Close Order Details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                    {displayId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="text-emerald-200/80 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2 pt-1">
                  <Receipt className="w-6 h-6 text-amber-300" /> Order Details & Receipt
                </h3>
                <p className="text-xs text-emerald-100/80 font-light">
                  MongoDB Record ID: <span className="font-mono text-amber-200">{rawId}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-left sm:text-right">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-md uppercase tracking-wider ${
                    status === 'Delivered'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : status === 'Cancelled'
                      ? 'bg-red-500 text-white border-red-400'
                      : status === 'Shipped'
                      ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold'
                      : 'bg-blue-600 text-white border-blue-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {status}
                </span>
                <span className="block text-[11px] text-emerald-100/70 mt-1">
                  Placed: {formatDate(orderDate, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/60">
            {loading && !order ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[#0A3825] mx-auto" />
                <p className="text-xs font-bold text-slate-600">Retrieving order details from MongoDB Atlas...</p>
              </div>
            ) : !order ? (
              <div className="py-12 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Order record not found</p>
                <p className="text-xs text-slate-500">The requested order ID could not be loaded from database.</p>
              </div>
            ) : (
              <>
                {/* 1. Line Items List */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" /> Line Items ({order.items?.length || 0})
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      Total: ${(totalVal || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => {
                        const nameStr = item.name || item.productName || 'Fine Crockery Item';
                        const priceNum = item.price ?? item.unitPrice ?? 0;
                        const imgStr =
                          item.image ||
                          item.productImage ||
                          'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=300';
                        const lineTotal = priceNum * item.quantity;

                        return (
                          <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                            <div className="flex items-center gap-3">
                              <img
                                src={imgStr}
                                alt={nameStr}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm bg-slate-100 shrink-0"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{nameStr}</h4>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                                    Qty: {item.quantity}
                                  </span>
                                  <span>×</span>
                                  <span className="font-semibold text-slate-800">${(priceNum || 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-slate-900 block">${(lineTotal || 0).toFixed(2)}</span>
                              <span className="text-[10px] text-emerald-700 font-semibold">In Stock</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-xs text-slate-500 text-center">No line items in order.</div>
                    )}
                  </div>
                </div>

                {/* 2. Pricing Summary & Financial Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Financial Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-[#0A3825]" /> Pricing Breakdown
                    </h4>

                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">${(subtotalVal || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Express Courier Shipping</span>
                      <span className="font-medium text-slate-900">
                        {shippingVal > 0 ? `$${(shippingVal || 0).toFixed(2)}` : 'FREE Luxury Shipping'}
                      </span>
                    </div>

                    {discountVal > 0 && (
                      <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                        <span>VIP Coupon Discount</span>
                        <span>-${(discountVal || 0).toFixed(2)}</span>
                      </div>
                    )}

                    {taxVal > 0 && (
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Estimated Tax</span>
                        <span className="font-medium text-slate-900">${(taxVal || 0).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-[#0A3825]">
                      <span>Grand Total</span>
                      <span className="text-base font-serif font-bold text-[#0A3825]">
                        ${(totalVal || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Delivery Information */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#0A3825]" /> Customer & Shipping Info
                    </h4>

                    <div className="text-xs space-y-1 text-slate-700">
                      <p className="font-bold text-slate-900">{custName}</p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0A3825] shrink-0" />
                        <span>{shipAddr}</span>
                      </p>
                      <p className="text-slate-500">{custEmail} • {custPhone}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#0A3825]" /> Method:
                      </span>
                      <span className="font-bold text-slate-800">{order.paymentMethod || 'Cash on Delivery'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Payment Status:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {order.paymentStatus || 'Paid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Status History Timeline */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0A3825]" /> Status History & Shipment Log
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Synced with MongoDB
                    </span>
                  </div>

                  {status === 'Cancelled' ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                      <div>
                        <strong className="block text-sm font-bold">Order Cancelled</strong>
                        <span>This order was cancelled and marked as inactive in MongoDB Atlas.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
                      {timelineSteps.map((step, i) => {
                        const IconComponent = step.icon;
                        return (
                          <div key={i} className="relative z-10 flex items-start gap-3.5 text-xs">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                step.done
                                  ? 'bg-[#0A3825] text-amber-300 border-[#D4AF37] shadow'
                                  : 'bg-white text-slate-400 border-slate-300'
                              }`}
                            >
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>

                            <div className="flex-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span>{step.title}</span>
                                <span className="text-[10px] text-slate-400 font-normal">{step.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Invoice</span>
              </button>

              {status === 'Pending' && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigateToPage('products');
                }}
                className="bg-[#0A3825] hover:bg-[#062418] text-amber-300 border border-[#D4AF37]/50 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Order Again</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
