import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/apiFetch';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  FileText,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  User,
  Building2,
  Truck,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { openWhatsAppOrderChat } from '../utils/whatsapp';
import { Order, PaymentStatus, OrderStatus } from '../types';

interface AdminStats {
  totalOrders: number;
  pendingPayments: number;
  screenshotsReceived: number;
  paymentsUnderReview: number;
  paidOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export const AdminOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Action states
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (activeFilter !== 'All') {
        if (
          ['Pending Payment', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(
            activeFilter
          )
        ) {
          queryParams.append('status', activeFilter);
        } else {
          queryParams.append('paymentStatus', activeFilter);
        }
      }
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const res = await apiFetch(`/api/admin/orders?${queryParams.toString()}`);
      const json = await res.json();

      if (json.success) {
        setOrders(json.data || []);
        if (json.stats) {
          setStats(json.stats);
        }
      } else {
        setError(json.message || 'Failed to fetch orders.');
      }
    } catch (err: any) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminOrders();
  };

  const handleConfirmPayment = async (orderId: string) => {
    try {
      setActionLoading(true);
      setActionMessage(null);

      const res = await apiFetch(`/api/admin/orders/${orderId}/confirm-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy: 'Admin', adminNote }),
      });

      const json = await res.json();

      if (json.success) {
        setActionMessage('Payment verified! Order marked as Paid & Confirmed.');
        fetchAdminOrders();
        if (selectedOrder) {
          setSelectedOrder(json.data);
        }
      } else {
        setActionMessage(`Error: ${json.message}`);
      }
    } catch (err) {
      setActionMessage('Failed to confirm payment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    if (!rejectionReason.trim()) {
      setActionMessage('Please enter a rejection reason.');
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage(null);

      const res = await apiFetch(`/api/admin/orders/${orderId}/reject-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason, adminNote }),
      });

      const json = await res.json();

      if (json.success) {
        setActionMessage('Payment rejected. Customer requested to re-upload proof.');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchAdminOrders();
        if (selectedOrder) {
          setSelectedOrder(json.data);
        }
      } else {
        setActionMessage(`Error: ${json.message}`);
      }
    } catch (err) {
      setActionMessage('Failed to reject payment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setActionLoading(true);
      setActionMessage(null);

      const res = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, adminNote }),
      });

      const json = await res.json();

      if (json.success) {
        setActionMessage(`Status updated to ${newStatus}`);
        fetchAdminOrders();
        if (selectedOrder) {
          setSelectedOrder(json.data);
        }
      } else {
        setActionMessage(`Error: ${json.message}`);
      }
    } catch (err) {
      setActionMessage('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">
            WhatsApp Payment & Order Verification
          </h2>
          <p className="text-xs text-slate-400">
            Review customer payment proof screenshots, confirm funds received, and manage shipping statuses.
          </p>
        </div>

        <button
          onClick={fetchAdminOrders}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-700 font-semibold cursor-pointer"
        >
          Refresh Orders
        </button>
      </div>

      {/* Stats Counter Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <p className="text-slate-400 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl space-y-1">
            <p className="text-amber-400 font-medium">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-300">{stats.pendingPayments}</p>
          </div>

          <div className="bg-slate-900 border border-blue-500/30 p-4 rounded-2xl space-y-1">
            <p className="text-blue-400 font-medium">Screenshots Received</p>
            <p className="text-2xl font-bold text-blue-300">{stats.screenshotsReceived}</p>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
            <p className="text-emerald-400 font-medium">Confirmed / Paid</p>
            <p className="text-2xl font-bold text-emerald-300">{stats.paidOrders}</p>
          </div>

          <div className="bg-slate-900 border border-purple-500/30 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
            <p className="text-purple-400 font-medium">Shipped & Delivered</p>
            <p className="text-2xl font-bold text-purple-300">
              {stats.shippedOrders + stats.deliveredOrders}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search Order ID, Invoice, Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-slate-200 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#0A3825] hover:bg-[#062418] text-white px-4 py-2 rounded-xl text-xs font-bold border border-[#D4AF37]/30"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
          {[
            'All',
            'Pending Payment',
            'Screenshot Received',
            'Under Review',
            'Paid',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Cancelled',
          ].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Data Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading orders database...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
          No orders found matching filter "{activeFilter}".
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/80">
                  <th className="py-3.5 px-4 font-bold">Order / Invoice ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer Details</th>
                  <th className="py-3.5 px-4 font-bold">Grand Total</th>
                  <th className="py-3.5 px-4 font-bold">Payment Proof</th>
                  <th className="py-3.5 px-4 font-bold">Order Status</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord, idx) => {
                  const payStat = ord.payment?.status || 'Pending';

                  return (
                    <tr key={ord.orderId || ord._id ? `${ord.orderId || ord._id}-${idx}` : `admin-ord-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-amber-300">
                        {ord.orderId}
                        <span className="block text-[10px] text-slate-500 font-sans">
                          {ord.invoiceNumber}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white text-xs">{ord.customer?.fullName}</p>
                        <p className="text-[11px] text-slate-400">{ord.customer?.phone}</p>
                        <p className="text-[10px] text-slate-500">{ord.customer?.city}</p>
                      </td>

                      <td className="py-4 px-4 font-bold text-white text-xs">
                        Rs. {(ord.pricing?.total ?? ord.totalAmount ?? ord.total ?? 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            payStat === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : payStat === 'Screenshot Received' || payStat === 'Under Review'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : payStat === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {payStat}
                        </span>
                        {ord.payment?.screenshotUrl && (
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setShowScreenshotModal(true);
                            }}
                            className="block text-[10px] text-emerald-400 underline font-medium mt-1 cursor-pointer"
                          >
                            View Screenshot
                          </button>
                        )}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-400 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActionMessage(null);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-xs text-white p-2 rounded-xl border border-slate-700 cursor-pointer"
                            title="Inspect Order"
                          >
                            <Eye className="w-4 h-4 text-emerald-400" />
                          </button>

                          <button
                            onClick={() =>
                              openWhatsAppOrderChat(ord.orderId, ord.invoiceUrl || `/invoice/${ord.orderId}`)
                            }
                            className="bg-emerald-700/80 hover:bg-emerald-600 text-xs text-white p-2 rounded-xl cursor-pointer"
                            title="Chat Customer on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Order Verification & Actions
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedOrder.orderId} • {selectedOrder.invoiceNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {actionMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium">
                {actionMessage}
              </div>
            )}

            {/* Customer & Shipping Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                Customer Information
              </h4>
              <p className="font-bold text-white text-sm">{selectedOrder.customer?.fullName}</p>
              <p className="text-slate-300">Phone: {selectedOrder.customer?.phone}</p>
              <p className="text-slate-300">WhatsApp: {selectedOrder.customer?.whatsappNumber}</p>
              <p className="text-slate-300">
                Address: {selectedOrder.customer?.address}, {selectedOrder.customer?.city}
              </p>
            </div>

            {/* Payment Proof Screenshot Section */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex justify-between items-center">
                <span>Payment Screenshot Proof</span>
                <span className="text-slate-400">Status: {selectedOrder.payment?.status}</span>
              </h4>

              {selectedOrder.payment?.screenshotUrl ? (
                <div className="space-y-3 text-center">
                  <div
                    onClick={() => setShowScreenshotModal(true)}
                    className="cursor-pointer group relative max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-800 bg-black p-1"
                  >
                    <img
                      src={selectedOrder.payment.screenshotUrl}
                      alt="Proof"
                      className="max-h-48 mx-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      Click to Enlarge
                    </div>
                  </div>

                  {selectedOrder.payment?.transactionReference && (
                    <p className="text-slate-300 font-mono">
                      Transaction Ref / TRX:{' '}
                      <strong className="text-amber-300">
                        {selectedOrder.payment.transactionReference}
                      </strong>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-amber-400 text-xs italic">
                  No payment screenshot has been uploaded by customer yet.
                </p>
              )}
            </div>

            {/* Verification Actions */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Admin Manual Verification
              </h4>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleConfirmPayment(selectedOrder.orderId)}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Payment & Mark Paid
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <XCircle className="w-4 h-4" /> Reject Payment Proof
                </button>
              </div>

              {/* Status Select */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                <span className="text-slate-400">Update Order Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Payment Under Review">Payment Under Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-400">Order Items ({selectedOrder.items?.length})</h4>
              <div className="divide-y divide-slate-800 border-t border-b border-slate-800 py-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 text-slate-200">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono text-amber-300">
                      Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-1">
                <span>Grand Total:</span>
                <span className="text-amber-300">
                  Rs. {(selectedOrder.pricing?.total ?? selectedOrder.totalAmount ?? selectedOrder.total ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Reject Payment Screenshot
            </h3>

            <p className="text-xs text-slate-300">
              Provide a clear reason so customer can re-upload their receipt.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Screenshot unreadable / Incorrect amount transferred / Duplicate receipt..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => handleRejectPayment(selectedOrder.orderId)}
                disabled={actionLoading || !rejectionReason.trim()}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Screenshot Modal */}
      {showScreenshotModal && selectedOrder?.payment?.screenshotUrl && (
        <div
          onClick={() => setShowScreenshotModal(false)}
          className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={selectedOrder.payment.screenshotUrl}
              alt="Payment Screenshot Proof"
              className="max-h-[85vh] w-auto object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
            <p className="text-center text-xs text-slate-400 mt-2">
              Click anywhere to close full screen view
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
