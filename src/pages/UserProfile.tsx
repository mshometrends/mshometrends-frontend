import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  CreditCard,
  Search,
  RefreshCw,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Eye,
  Receipt,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderDetailsModal } from '../components/OrderDetailsModal';

interface OrderItem {
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

interface MongoOrder {
  _id?: string;
  id?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
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
}

export const UserProfile: React.FC = () => {
  const { currentUser, setIsAuthModalOpen, logoutUser, navigateToPage, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'tracking' | 'history' | 'settings'>('tracking');

  // MongoDB Orders state
  const [orders, setOrders] = useState<MongoOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Order Details Modal state
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<MongoOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenOrderModal = (order: MongoOrder) => {
    setSelectedOrderForModal(order);
    setIsModalOpen(true);
  };

  // User Profile details
  const userName = currentUser?.name || 'Customer';
  const userEmail = currentUser?.email || 'customer@example.com';
  const userRole = currentUser?.role === 'admin' ? 'MS Admin' : 'Gold Concierge VIP';

  const [userProfile, setUserProfile] = useState({
    name: userName,
    email: userEmail,
    phone: currentUser?.phone || '+92 300 1234567',
    membership: userRole,
    memberSince: 'March 2024',
    address: '742 Evergreen Terrace, Suite 400, Lahore, Pakistan',
  });

  // Fetch live orders from MongoDB API for current user
  const fetchMongoOrders = async (query?: string) => {
    try {
      setLoading(true);
      const userSearchQuery = query && query.trim() ? query.trim() : (currentUser?.email || '');
      const url = userSearchQuery
        ? `/api/v1/orders/track/${encodeURIComponent(userSearchQuery)}`
        : '/api/v1/orders';

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('[MongoDB Orders Fetch Error]', err);
      showToast('Could not sync live order status from MongoDB', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMongoOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMongoOrders(searchQuery);
    showToast('Synced active orders with MongoDB Atlas', 'info');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMongoOrders(searchQuery);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Order status updated to Cancelled in MongoDB', 'success');
        fetchMongoOrders(searchQuery);
      } else {
        showToast(json.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast('Order ID copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper for tracking progress percentages & steps
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0A3825]/10 border border-[#0A3825]/20 text-[#0A3825] flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Login or Sign In Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order tracking and account profile are available for logged-in customers. Please log in or register to view your live orders and shipping status.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-[#0A3825] hover:bg-[#062418] text-white font-bold py-3.5 px-6 rounded-2xl text-xs border border-[#D4AF37]/30 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            Log In / Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User Profile Header Header Card */}
        <div className="bg-[#0A3825] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D4AF37]/30 relative overflow-hidden">
          {/* Subtle Background Glow Accent */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] p-1 shadow-lg">
                <div className="w-full h-full bg-[#0A3825] rounded-[14px] flex items-center justify-center text-amber-300 font-bold text-2xl border border-amber-300/30">
                  {userProfile.name.charAt(0)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {userProfile.name}
                  </h1>
                  <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    {userProfile.membership}
                  </span>
                </div>
                <p className="text-emerald-100/80 text-sm mt-1 flex items-center gap-2">
                  <span>{userProfile.email}</span>
                  <span>•</span>
                  <span>Member since {userProfile.memberSince}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-emerald-800/60">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Syncing...' : 'Sync MongoDB'}</span>
              </button>

              <button
                onClick={() => navigateToPage('products')}
                className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A3825] px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#0A3825]" />
                <span>Browse Store</span>
              </button>

              <button
                onClick={() => logoutUser()}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Log Out of Account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-300" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-emerald-800/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-amber-400 text-[#0A3825] shadow-md'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Live Order Tracking ({activeOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-[#0A3825] shadow-md'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-[#0A3825] shadow-md'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account Preferences</span>
            </button>
          </div>
        </div>

        {/* Search Bar for Mongo Orders */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Track order by Order ID, Email, or Customer Name in MongoDB Atlas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchMongoOrders('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="bg-[#0A3825] hover:bg-[#062418] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Track Order
          </button>
        </form>

        {/* Tab 1: Live Order Tracking */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#0A3825]" /> Active Order Tracking
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status synced directly with MongoDB Atlas database
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MongoDB Live Connection
              </span>
            </div>

            {loading ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center py-16 space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-[#0A3825] mx-auto" />
                <p className="text-sm font-semibold text-slate-600">Fetching live order status from MongoDB...</p>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center py-14 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-[#0A3825]">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-800">No active shipments right now</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    All your orders have been fulfilled or you haven't placed an order recently. Place a new order to see live tracking in real time!
                  </p>
                </div>
                <button
                  onClick={() => navigateToPage('products')}
                  className="bg-[#0A3825] hover:bg-[#062418] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md inline-block cursor-pointer"
                >
                  Explore Crockery Collection
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order, idx) => {
                  const orderIdStr = order._id || order.id ? String(order._id || order.id) : `ORDER-${idx}`;
                  const displayId = orderIdStr.length > 8 ? `MS-${orderIdStr.substring(orderIdStr.length - 6).toUpperCase()}` : orderIdStr;
                  const stepIndex = getStepIndex(order.status);
                  const isExpanded = expandedOrderId === orderIdStr;

                  const totalVal = order.pricing?.total ?? order.totalAmount ?? order.total ?? 0;
                  const subtotalVal = order.pricing?.subtotal ?? order.subtotalAmount ?? order.subtotal ?? totalVal;
                  const shippingVal = order.pricing?.deliveryCharges ?? order.shippingFee ?? order.shipping ?? 0;
                  const discountVal = order.pricing?.discount ?? order.discountAmount ?? order.discount ?? 0;
                  const custName = order.customer?.name || order.customerName || 'Eleanor Vance';
                  const custEmail = order.customer?.email || order.customerEmail || 'eleanor.vance@example.com';
                  const shipAddr = typeof order.shippingAddress === 'string'
                    ? order.shippingAddress
                    : order.shippingAddress
                    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}`
                    : 'Standard Address';

                  return (
                    <div
                      key={`active-${orderIdStr}-${idx}`}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all overflow-hidden"
                    >
                      {/* Top Header */}
                      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
                              {displayId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(orderIdStr)}
                              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                              title="Copy raw MongoDB ID"
                            >
                              {copiedId === orderIdStr ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span className="text-[11px]">Copy ID</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'} • {custName}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Total Amount</span>
                            <span className="text-lg font-serif font-bold text-amber-300">${(totalVal || 0).toFixed(2)}</span>
                          </div>

                          <button
                            onClick={() => handleOpenOrderModal(order)}
                            className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A3825] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            title="View Full Order Details & Line Items"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : orderIdStr)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl transition-all cursor-pointer"
                            title="Expand inline summary"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Visual Order Progress Pipeline */}
                      <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Live Shipment Status
                          </span>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              order.status === 'Processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : order.status === 'Shipped'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Step Bar */}
                        <div className="relative my-6">
                          {/* Background Track Bar */}
                          <div className="h-2 bg-slate-200 rounded-full w-full absolute top-1/2 -translate-y-1/2" />

                          {/* Active Progress Bar */}
                          <div
                            className="h-2 bg-gradient-to-r from-[#0A3825] to-[#D4AF37] rounded-full transition-all duration-500 absolute top-1/2 -translate-y-1/2"
                            style={{
                              width:
                                stepIndex === 1
                                  ? '15%'
                                  : stepIndex === 2
                                  ? '50%'
                                  : stepIndex === 3
                                  ? '80%'
                                  : '100%',
                            }}
                          />

                          {/* 4 Steps Indicators */}
                          <div className="relative z-10 flex justify-between">
                            {/* Step 1: Placed */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                                  stepIndex >= 1
                                    ? 'bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37]'
                                    : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}
                              >
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 mt-2">Order Placed</span>
                              <span className="text-[10px] text-slate-400">Confirmed</span>
                            </div>

                            {/* Step 2: Processing */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                                  stepIndex >= 2
                                    ? 'bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37]'
                                    : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}
                              >
                                <Package className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 mt-2">Crafting & Packing</span>
                              <span className="text-[10px] text-slate-400">Quality Checked</span>
                            </div>

                            {/* Step 3: Shipped */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                                  stepIndex >= 3
                                    ? 'bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37]'
                                    : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}
                              >
                                <Truck className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 mt-2">In Transit</span>
                              <span className="text-[10px] text-slate-400">Express Delivery</span>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                                  stepIndex >= 4
                                    ? 'bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37]'
                                    : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 mt-2">Delivered</span>
                              <span className="text-[10px] text-slate-400">Safely Received</span>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Delivery Note */}
                        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 mt-4">
                          <div className="flex items-center gap-2.5">
                            <Truck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                            <span>
                              <strong>Estimated Arrival:</strong> 2 to 4 business days via DHL Luxury Express.
                            </span>
                          </div>
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelOrder(orderIdStr)}
                              className="text-red-700 hover:text-red-900 font-bold underline cursor-pointer text-[11px]"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Order Details Breakdown */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 space-y-6"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Purchased Items ({order.items?.length || 0})
                              </h4>
                              <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                {order.items?.map((item, idx) => {
                                  const nameStr = item.name || item.productName || 'Crockery Item';
                                  const priceNum = item.price ?? item.unitPrice ?? 0;
                                  const imgStr = item.image || item.productImage || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=300';

                                  return (
                                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={imgStr}
                                          alt={nameStr}
                                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                        />
                                        <div>
                                          <h5 className="text-xs font-bold text-slate-800">{nameStr}</h5>
                                          <p className="text-[11px] text-slate-500">Qty: {item.quantity || 1} × ${(priceNum || 0).toFixed(2)}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs font-bold text-slate-900">
                                        ${((priceNum || 0) * (item.quantity || 1)).toFixed(2)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Address & Payment Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#0A3825]" /> Shipping Address
                                </span>
                                <p className="text-xs font-semibold text-slate-800">{custName}</p>
                                <p className="text-xs text-slate-600">{shipAddr}</p>
                                <p className="text-xs text-slate-500">{custEmail}</p>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                  <CreditCard className="w-3.5 h-3.5 text-[#0A3825]" /> Payment Details
                                </span>
                                <p className="text-xs font-semibold text-slate-800">
                                  Method: {order.paymentMethod || 'Credit Card'}
                                </p>
                                <p className="text-xs text-slate-600">
                                  Status: <span className="text-emerald-700 font-bold">{order.paymentStatus || 'Paid'}</span>
                                </p>
                                <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
                                  <span>Subtotal: ${(subtotalVal || 0).toFixed(2)}</span>
                                  <span>Shipping: ${(shippingVal || 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Order History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0A3825]" /> Complete Order History
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Historical log of all transactions stored in MongoDB Atlas
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center py-16 space-y-3">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No past orders found in MongoDB</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {orders.map((o, idx) => {
                        const oid = o._id || o.id ? String(o._id || o.id) : `MS-ORD-${idx}`;
                        const displayId = oid.length > 8 ? `MS-${oid.substring(oid.length - 6).toUpperCase()}` : oid;
                        const totalVal = o.totalAmount ?? o.total ?? 0;

                        return (
                          <tr key={`hist-${oid}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#0A3825]">{displayId}</td>
                            <td className="p-4 text-slate-500">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="p-4 font-semibold text-slate-800">
                              {o.items?.length || 0} item(s)
                            </td>
                            <td className="p-4 font-bold text-slate-900">${(totalVal || 0).toFixed(2)}</td>
                            <td className="p-4 text-slate-600">{o.paymentMethod || 'Credit Card'}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                  o.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : o.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleOpenOrderModal(o)}
                                className="bg-[#0A3825] hover:bg-[#062418] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-300" />
                                <span>View Details</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Account Preferences */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0A3825]" /> Account Profile & Shipping Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0A3825]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0A3825]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block font-bold text-slate-700">Primary Delivery Address</label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#0A3825]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => showToast('Profile preferences updated!', 'success')}
                className="bg-[#0A3825] hover:bg-[#062418] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Save Changes
              </button>

              <button
                onClick={() => logoutUser()}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          orderId={selectedOrderForModal?._id || selectedOrderForModal?.id || null}
          initialOrderData={selectedOrderForModal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOrderUpdated={() => fetchMongoOrders(searchQuery)}
        />

      </div>
    </div>
  );
};
