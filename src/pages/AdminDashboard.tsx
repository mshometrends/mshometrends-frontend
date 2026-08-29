import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { AdminOrdersView } from '../components/AdminOrdersView';
import { Product, Category, Banner, Offer, Order, Coupon, User as UserType, ShippingRule, AdminTab } from '../types';
import { mockAdminStats } from '../data/mockData';
import { ProductFormPage } from '../components/admin/ProductFormPage';
import { CategoryFormPage } from '../components/admin/CategoryFormPage';
import { BannerFormPage } from '../components/admin/BannerFormPage';
import { OfferFormPage } from '../components/admin/OfferFormPage';
import { ShippingFormPage } from '../components/admin/ShippingFormPage';
import { CouponFormPage } from '../components/admin/CouponFormPage';
import { UserFormPage } from '../components/admin/UserFormPage';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Sparkles,
  Settings,
  User,
  LogOut,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  LogIn,
  ShieldAlert,
  Database,
  RefreshCw,
  Truck,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    products,
    categories,
    banners,
    offers,
    orders,
    coupons,
    reviews,
    shippingRules,
    registeredUsers,
    fetchRegisteredUsers,
    deleteUser,
    toggleProductFeatured,
    toggleProductBestSeller,
    toggleProductNewArrival,
    deleteProduct,
    deleteCategory,
    toggleBanner,
    deleteBanner,
    toggleOffer,
    deleteOffer,
    deleteShippingRule,
    approveReview,
    deleteReview,
    navigateToPage,
    showToast,
  } = useStore();

  // 2-Hour Session Expiration (7,200,000 ms)
  const SESSION_DURATION = 2 * 60 * 60 * 1000;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const isAuth = sessionStorage.getItem('ms_admin_auth') === 'true';
    const authTime = sessionStorage.getItem('ms_admin_auth_time');
    if (isAuth && authTime) {
      const elapsed = Date.now() - Number(authTime);
      if (elapsed >= 2 * 60 * 60 * 1000) {
        sessionStorage.removeItem('ms_admin_auth');
        sessionStorage.removeItem('ms_admin_auth_time');
        return false;
      }
      return true;
    }
    return isAuth;
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = () => {
      const authTime = sessionStorage.getItem('ms_admin_auth_time');
      if (authTime) {
        const elapsed = Date.now() - Number(authTime);
        if (elapsed >= SESSION_DURATION) {
          sessionStorage.removeItem('ms_admin_auth');
          sessionStorage.removeItem('ms_admin_auth_time');
          setIsAuthenticated(false);
          showToast('Session expired after 2 hours. Please log in again.', 'info');
        }
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, showToast]);

  const [emailInput, setEmailInput] = useState('admin@mshometrends.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dedicated Form Page States (No ugly popup div - clean dedicated full-page form views!)
  const [activeFormView, setActiveFormView] = useState<
    'none' | 'product' | 'category' | 'banner' | 'offer' | 'shipping' | 'coupon' | 'user'
  >('none');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingShipping, setEditingShipping] = useState<ShippingRule | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [isSyncingMongo, setIsSyncingMongo] = useState(false);

  // Handlers for Opening Dedicated Add/Edit Pages
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setActiveFormView('product');
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setActiveFormView('product');
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setActiveFormView('category');
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setActiveFormView('category');
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setActiveFormView('banner');
  };

  const handleOpenEditBanner = (ban: Banner) => {
    setEditingBanner(ban);
    setActiveFormView('banner');
  };

  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setActiveFormView('offer');
  };

  const handleOpenEditOffer = (off: Offer) => {
    setEditingOffer(off);
    setActiveFormView('offer');
  };

  const handleOpenAddShipping = () => {
    setEditingShipping(null);
    setActiveFormView('shipping');
  };

  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setActiveFormView('coupon');
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setActiveFormView('user');
  };

  const handleCloseFormView = () => {
    setActiveFormView('none');
    setEditingProduct(null);
    setEditingCategory(null);
    setEditingBanner(null);
    setEditingOffer(null);
    setEditingShipping(null);
    setEditingCoupon(null);
    setEditingUser(null);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both admin email and password.');
      return;
    }

    if (
      (emailInput.toLowerCase() === 'admin@mshometrends.com' && (passwordInput === 'admin123' || passwordInput === '1234')) ||
      passwordInput === 'admin123' ||
      passwordInput === '1234'
    ) {
      sessionStorage.setItem('ms_admin_auth', 'true');
      sessionStorage.setItem('ms_admin_auth_time', Date.now().toString());
      setIsAuthenticated(true);
      showToast('Admin access granted. Welcome to MS Home Trends Control Panel.', 'success');
    } else {
      setAuthError('Invalid credentials. (Demo Admin Pass: admin123 or PIN: 1234)');
      showToast('Authentication failed. Check password.', 'error');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('ms_admin_auth');
    sessionStorage.removeItem('ms_admin_auth_time');
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('Admin session terminated successfully.', 'info');
  };

  const fillDemoCredentials = () => {
    setEmailInput('admin@mshometrends.com');
    setPasswordInput('admin123');
    setAuthError('');
  };

  const handleSyncMongoDB = async () => {
    setIsSyncingMongo(true);
    try {
      const res = await fetch('/api/v1/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'MongoDB Atlas is in sync! All custom products & Cloudinary images are preserved.', 'success');
      } else {
        showToast(json.message || 'MongoDB synchronization notice', 'info');
      }
    } catch (err: any) {
      showToast('Failed to connect to MongoDB API endpoint', 'error');
    } finally {
      setIsSyncingMongo(false);
    }
  };

  // -------------------------------------------------------------
  // Unauthenticated Portal
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030F0A] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0A3825]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#051811]/90 border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-7 text-center"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#0A3825] border border-[#D4AF37] flex items-center justify-center text-amber-300 font-serif-title font-bold text-2xl shadow-xl">
              MS
            </div>
            <div>
              <h1 className="text-xl font-serif-title font-bold text-white tracking-wide">
                MS HOME TRENDS
              </h1>
              <p className="text-xs text-amber-300/80 font-medium tracking-widest uppercase mt-0.5">
                Restricted Administrator Portal
              </p>
            </div>
          </div>

          <div className="bg-[#0A3825]/50 border border-[#D4AF37]/30 rounded-2xl p-4 text-xs text-emerald-100/90 text-left flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Authorization Required</p>
              <p className="text-[11px] opacity-80 mt-0.5">
                Please enter administrator credentials to manage inventory, categories, pricing, and store orders.
              </p>
            </div>
          </div>

          {authError && (
            <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 text-xs text-red-200 text-left flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-emerald-200/90 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@mshometrends.com"
                className="w-full bg-[#030F0A] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-emerald-900 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200/90 mb-1.5">
                Admin Password / PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password or PIN"
                  className="w-full bg-[#030F0A] border border-[#D4AF37]/30 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-emerald-900 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A3825] font-bold py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-98 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Verify & Access Dashboard</span>
            </button>
          </form>

          <div className="pt-2 border-t border-emerald-900/40 text-center space-y-2">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] text-amber-300/80 hover:text-amber-300 underline font-medium transition-colors cursor-pointer"
            >
              ⚡ Auto-fill Demo Credentials (admin123)
            </button>
            <div>
              <button
                type="button"
                onClick={() => navigateToPage('home')}
                className="text-xs text-emerald-300/70 hover:text-white transition-colors"
              >
                ← Return to Public Storefront
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col lg:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <span className="w-9 h-9 rounded-xl bg-[#0A3825] border border-[#D4AF37]/40 flex items-center justify-center text-amber-300 font-serif-title font-bold text-lg shadow-sm">
              MS
            </span>
            <div>
              <h2 className="text-sm font-serif-title font-bold text-[#0A3825] tracking-wider">
                MS HOME TRENDS
              </h2>
              <span className="text-[10px] uppercase font-bold text-[#B45309] tracking-widest block">
                ADMIN CONTROL
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package, badge: products.length },
              { id: 'categories', label: 'Categories', icon: FolderTree, badge: categories.length },
              { id: 'banners', label: 'Hero Banners', icon: ImageIcon, badge: banners.length },
              { id: 'offers', label: 'Offers / Deals', icon: Sparkles, badge: offers.length },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'shipping', label: 'Shipping Rules', icon: Truck, badge: shippingRules.length },
              { id: 'customers', label: 'Customers', icon: Users, badge: registeredUsers.length },
              { id: 'reviews', label: 'Reviews', icon: Star, badge: reviews.length },
              { id: 'coupons', label: 'Coupons', icon: Tag, badge: coupons.length },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id && activeFormView === 'none';
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleCloseFormView();
                    setAdminTab(tab.id as AdminTab);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0A3825] text-amber-300 font-bold shadow-sm border border-[#D4AF37]/30'
                      : 'text-slate-600 hover:text-[#0A3825] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2">
          <button
            onClick={handleAdminLogout}
            className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-red-200 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-red-600" /> Lock Admin Session
          </button>
          <button
            onClick={() => navigateToPage('home')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#B45309]" /> Return To Storefront
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#0A3825] capitalize">
              {activeFormView !== 'none'
                ? `${editingProduct || editingCategory || editingBanner || editingShipping || editingCoupon || editingUser ? 'Edit' : 'Add New'} ${activeFormView}`
                : `${adminTab} Overview`}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              MS Home Trends Store Control Panel • Authenticated Administrator Mode
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncMongoDB}
              disabled={isSyncingMongo}
              title="Migrate / Seed all mock data to MongoDB Atlas"
              className="text-xs bg-[#0A3825] hover:bg-[#062418] text-amber-300 border border-[#D4AF37]/40 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSyncingMongo ? 'Syncing...' : 'Sync MongoDB Atlas'}</span>
              {isSyncingMongo && <RefreshCw className="w-3 h-3 animate-spin text-amber-300 ml-0.5" />}
            </button>

            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Authenticated Admin
            </span>

            <button
              onClick={handleAdminLogout}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Logout
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* DEDICATED FULL-PAGE FORM VIEWS (NO DIV POPUP MODALS)          */}
        {/* ============================================================= */}
        {activeFormView === 'product' && (
          <ProductFormPage productToEdit={editingProduct} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'category' && (
          <CategoryFormPage categoryToEdit={editingCategory} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'banner' && (
          <BannerFormPage bannerToEdit={editingBanner} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'offer' && (
          <OfferFormPage offerToEdit={editingOffer} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'shipping' && (
          <ShippingFormPage shippingToEdit={editingShipping} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'coupon' && (
          <CouponFormPage couponToEdit={editingCoupon} onClose={handleCloseFormView} />
        )}

        {activeFormView === 'user' && (
          <UserFormPage userToEdit={editingUser} onClose={handleCloseFormView} />
        )}

        {/* ============================================================= */}
        {/* STANDARD LIST / OVERVIEW VIEWS                                */}
        {/* ============================================================= */}
        {activeFormView === 'none' && (
          <>
            {/* -------------------- TAB 1: DASHBOARD -------------------- */}
            {adminTab === 'dashboard' && (
              <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span>Total Revenue</span>
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#0A3825]">${mockAdminStats.totalRevenue.toLocaleString()}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +{mockAdminStats.revenueGrowth}% this month
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span>Total Orders</span>
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#0A3825]">{orders.length + 1240}</div>
                    <div className="text-[11px] text-[#B45309] font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +{mockAdminStats.ordersGrowth}% this month
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span>Active Products</span>
                      <div className="p-2 bg-slate-100 text-[#0A3825] rounded-xl border border-slate-200">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#0A3825]">{products.length}</div>
                    <div className="text-[11px] text-slate-500 font-medium">In {categories.length} categories</div>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span>Low Stock Warning</span>
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#B45309]">4 Items</div>
                    <div className="text-[11px] text-slate-500 font-medium">Reorder recommended</div>
                  </div>
                </div>

                {/* Sales Chart (SVG Visual) */}
                <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Revenue & Sales Trends</h3>
                      <p className="text-xs text-slate-500">Monthly Crockery Revenue Performance</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0A3825] bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      Oct 2025 - Mar 2026
                    </span>
                  </div>

                  <div className="h-60 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-slate-100 px-4">
                    {mockAdminStats.salesData.map((d) => {
                      const heightPct = Math.round((d.revenue / 30000) * 100);
                      return (
                        <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="text-[10px] font-bold text-slate-500 group-hover:text-[#0A3825] transition-colors">
                            ${(d.revenue / 1000).toFixed(1)}k
                          </div>
                          <div className="w-full bg-slate-50 rounded-t-xl h-44 flex items-end p-1 border border-slate-100">
                            <div
                              className="w-full bg-gradient-to-t from-[#0A3825] to-[#145338] rounded-t-lg group-hover:from-[#062418] group-hover:to-[#0A3825] transition-all duration-500"
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{d.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Recent Orders</h3>
                    <button
                      onClick={() => setAdminTab('orders')}
                      className="text-xs font-bold text-[#0A3825] hover:text-[#B45309] cursor-pointer"
                    >
                      View All Orders &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Order #</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 5).map((ord, idx) => (
                          <tr key={ord.id || ord._id ? `${ord.id || ord._id}-${idx}` : `dash-ord-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-[#0A3825]">{ord.orderNumber}</td>
                            <td className="p-3">{ord.customerName}</td>
                            <td className="p-3 font-bold text-slate-900">${(ord.pricing?.total ?? ord.totalAmount ?? ord.total ?? 0).toFixed(2)}</td>
                            <td className="p-3">{ord.paymentMethod}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : ord.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- TAB 2: PRODUCTS MANAGEMENT -------------------- */}
            {adminTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Products Catalog</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Total Active Items: {products.length} Products
                    </span>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Add Product Page
                  </button>
                </div>

                {/* Products Data Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Product</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-center">Badges & Showcase</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map((p, idx) => {
                          const isProductFeatured = Boolean(p.isFeatured || p.featured);
                          const isBest = Boolean(p.isBestSeller);
                          const isNew = Boolean(p.isNewArrival);

                          return (
                            <tr key={p.id || p._id ? `${p.id || p._id}-${idx}` : `prod-${idx}`} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 flex items-center gap-3">
                                <img
                                  src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop'}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-50"
                                />
                                <div>
                                  <span className="font-serif-title font-bold text-[#0A3825] block">{p.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} • {p.material}</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-600">{p.category}</td>
                              <td className="p-4 font-bold text-[#0A3825]">${(p.price ?? 0).toFixed(2)}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    (p.stockQuantity ?? 0) < 10
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {p.stockQuantity ?? 0} in stock
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                  {/* Featured Toggle */}
                                  <button
                                    onClick={() => toggleProductFeatured(p.id)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-xs cursor-pointer ${
                                      isProductFeatured
                                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                    }`}
                                    title="Click to toggle Featured status"
                                  >
                                    <Star className={`w-3 h-3 ${isProductFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                                    {isProductFeatured ? 'Featured' : 'Standard'}
                                  </button>

                                  {/* Best Seller Toggle */}
                                  <button
                                    onClick={() => toggleProductBestSeller(p.id)}
                                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-xs cursor-pointer ${
                                      isBest
                                        ? 'bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200'
                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                    }`}
                                    title="Click to toggle Best Seller ribbon"
                                  >
                                    <span>🔥</span>
                                    <span>{isBest ? 'Best Seller' : 'Not Best'}</span>
                                  </button>

                                  {/* New Arrival Toggle */}
                                  <button
                                    onClick={() => toggleProductNewArrival(p.id)}
                                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-xs cursor-pointer ${
                                      isNew
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                    }`}
                                    title="Click to toggle New Arrival badge"
                                  >
                                    <span>✨</span>
                                    <span>{isNew ? 'New' : 'Standard'}</span>
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-2 bg-slate-100 hover:bg-[#0A3825] text-slate-600 hover:text-amber-300 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                                  title="Edit product page"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-semibold pr-0.5">Edit Page</span>
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-2 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-xl transition-colors cursor-pointer inline-flex items-center"
                                  aria-label="Delete product"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- TAB 3: CATEGORIES MANAGEMENT -------------------- */}
            {adminTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Product Categories</h3>
                    <span className="text-xs text-slate-500 font-medium">Total Categories: {categories.length}</span>
                  </div>
                  <button
                    onClick={handleOpenAddCategory}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Add Category Page
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id || cat._id ? `adm-cat-${cat.id || cat._id}-${idx}` : `adm-cat-${idx}`}
                      className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm group hover:border-[#D4AF37]/50 transition-colors"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-serif-title font-bold text-[#0A3825] truncate">{cat.name}</h4>
                        <span className="text-xs text-[#B45309] font-medium">{cat.itemCount || 0} Items</span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cat.description}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 bg-slate-100 hover:bg-[#0A3825] text-slate-600 hover:text-amber-300 rounded-xl transition-colors cursor-pointer"
                          title="Open Edit Category Page"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 4: HERO BANNERS MANAGEMENT -------------------- */}
            {adminTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825] flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-amber-600" />
                      Hero Slider Banners ({banners.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create, update, reorder, or delete high-resolution hero banners displayed on the main homepage carousel.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddBanner}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Add Banner Page
                  </button>
                </div>

                {banners.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3">
                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold">No Hero Banners Found.</p>
                    <button
                      onClick={handleOpenAddBanner}
                      className="bg-[#0A3825] text-amber-300 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Create First Banner
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {banners.map((b, idx) => {
                      const bannerId = (b.id || b._id) as string;
                      return (
                        <div
                          key={bannerId ? `${bannerId}-${idx}` : `adm-ban-${idx}`}
                          className={`p-5 bg-white border rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm transition-all ${
                            !b.active ? 'opacity-70 bg-slate-50 border-slate-200' : 'border-slate-200'
                          }`}
                        >
                          <div className="relative w-full md:w-56 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900 group">
                            <img
                              src={b.image}
                              alt={b.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 bg-[#0A3825]/90 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/40 shadow-sm">
                              Slide #{b.order || 1}
                            </div>
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  b.active
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-slate-200 text-slate-600 border-slate-300'
                                }`}
                              >
                                {b.active ? '● Live on Store' : '○ Hidden/Disabled'}
                              </span>
                              {b.ctaText && (
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                  CTA: {b.ctaText} → {b.ctaUrl || b.ctaLink || '/shop'}
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-serif-title font-bold text-[#0A3825]">
                              {b.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {b.subheading || b.subtitle || 'Luxury Crockery & Fine Dining'}
                            </p>
                          </div>

                          <div className="flex sm:flex-col md:flex-row items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <button
                              onClick={() => toggleBanner(bannerId)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                b.active
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}
                              title="Toggle banner visibility"
                            >
                              {b.active ? 'Disable' : 'Enable'}
                            </button>

                            <button
                              onClick={() => handleOpenEditBanner(b)}
                              className="bg-slate-100 hover:bg-[#0A3825] text-slate-700 hover:text-amber-300 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit Page
                            </button>

                            <button
                              onClick={() => deleteBanner(bannerId)}
                              className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Delete hero banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB: OFFERS & PROMO BAR MANAGEMENT -------------------- */}
            {adminTab === 'offers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Top Promo Offers & Announcement Bar ({offers.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage rotating announcements, discount codes, and flash deal tickers displayed directly between the navbar and hero banner.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddOffer}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Add Offer Page
                  </button>
                </div>

                {offers.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3">
                    <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold">No Promotional Offers Configured.</p>
                    <p className="text-xs text-slate-400">
                      Create promotional offer headlines to display in the live announcement bar.
                    </p>
                    <button
                      onClick={handleOpenAddOffer}
                      className="bg-[#0A3825] text-amber-300 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Create First Offer
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {offers.map((off, idx) => {
                      const offerId = (off.id || off._id) as string;
                      const badgeColors: Record<string, string> = {
                        amber: 'bg-amber-100 text-amber-900 border-amber-300',
                        gold: 'bg-yellow-100 text-yellow-900 border-yellow-300',
                        emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                        rose: 'bg-rose-100 text-rose-900 border-rose-300',
                      };
                      const badgeCls = badgeColors[off.badgeType || 'gold'] || badgeColors.gold;

                      return (
                        <div
                          key={offerId ? `${offerId}-${idx}` : `adm-off-${idx}`}
                          className={`p-5 bg-white border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm transition-all ${
                            !off.active ? 'opacity-65 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-amber-400/40'
                          }`}
                        >
                          <div className="flex-1 space-y-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200">
                                Order #{off.order || idx + 1}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${badgeCls}`}
                              >
                                {off.badge}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  off.active
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-slate-200 text-slate-600 border-slate-300'
                                }`}
                              >
                                {off.active ? '● Live in Offer Bar' : '○ Hidden/Disabled'}
                              </span>
                              {off.discountText && (
                                <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                                  {off.discountText}
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-serif-title font-bold text-[#0A3825]">
                                {off.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {off.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap pt-1">
                              {off.code && (
                                <span className="inline-flex items-center gap-1 bg-[#0A3825]/5 border border-[#0A3825]/20 text-[#0A3825] px-2.5 py-0.5 rounded-md font-mono font-bold">
                                  <Tag className="w-3 h-3 text-[#0A3825]" /> Code: {off.code}
                                </span>
                              )}
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                Destination: <strong className="text-slate-800 capitalize">{off.targetPage || 'products'}</strong>
                                {off.targetParam ? ` (${off.targetParam})` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <button
                              onClick={() => toggleOffer(offerId)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                off.active
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}
                              title="Toggle offer visibility in the top bar"
                            >
                              {off.active ? 'Disable' : 'Enable'}
                            </button>

                            <button
                              onClick={() => handleOpenEditOffer(off)}
                              className="bg-slate-100 hover:bg-[#0A3825] text-slate-700 hover:text-amber-300 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit Page
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete offer "${off.badge}"?`)) {
                                  deleteOffer(offerId);
                                }
                              }}
                              className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Delete promotional offer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 5: ORDERS MANAGEMENT -------------------- */}
            {adminTab === 'orders' && <AdminOrdersView />}

            {/* -------------------- TAB 6: CUSTOMERS / REGISTERED USERS -------------------- */}
            {adminTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">
                      Registered Store Users & Customer Contact Directory
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View and manage customer accounts, verified Gmail addresses, and contact numbers ({registeredUsers.length} users registered)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchRegisteredUsers()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-200 cursor-pointer"
                    >
                      Refresh List
                    </button>
                    <button
                      onClick={handleOpenAddUser}
                      className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-300" /> Open Add User Page
                    </button>
                  </div>
                </div>

                {registeredUsers.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold">No registered users found yet.</p>
                    <p className="text-xs text-slate-400">Users who register on the storefront will automatically appear here with their Gmail and phone number.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-800 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Gmail / Email</th>
                            <th className="p-4">Phone Number</th>
                            <th className="p-4">Registration Date</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {registeredUsers.map((u, idx) => {
                            const uid = (u.id || u._id) as string;
                            return (
                              <tr key={uid ? `${uid}-${idx}` : `adm-usr-${idx}`} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-[#0A3825]">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#0A3825] text-amber-300 font-bold flex items-center justify-center text-xs border border-[#D4AF37]/30">
                                      {u.name ? u.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span>{u.name}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono text-xs">
                                    {u.email}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-mono text-xs">
                                    {(u as any).phone || (u as any).phoneNumber || 'N/A'}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-500 font-mono">
                                  {(u as any).createdAt ? new Date((u as any).createdAt).toLocaleDateString() : 'Recent'}
                                </td>
                                <td className="p-4 text-center">
                                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    Verified Real Account
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-1">
                                  <button
                                    onClick={() => {
                                      setEditingUser(u);
                                      setActiveFormView('user');
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-[#0A3825] text-slate-600 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
                                    title="Edit customer account"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteUser(uid)}
                                    className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                    title="Remove User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* -------------------- TAB 7: SHIPPING RULES & ZONES -------------------- */}
            {adminTab === 'shipping' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">
                      City, Zip Code & Country Shipping Rates
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure custom shipping fees for Karachi, Lahore, Islamabad, Pakistan provinces, and international zip codes ({shippingRules.length} zones set)
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddShipping}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Add Shipping Zone Page
                  </button>
                </div>

                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A3825] text-amber-300 flex items-center justify-center font-bold shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Karachi Express Rate</span>
                      <p className="text-lg font-serif-title font-bold text-[#0A3825]">
                        ${shippingRules.find((r) => r.city.toLowerCase() === 'karachi')?.shippingFee || 5.00}
                        <span className="text-xs text-slate-500 font-sans font-normal ml-1">(Same/Next Day)</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-200 flex items-center justify-center font-bold shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Major Pakistan Cities</span>
                      <p className="text-lg font-serif-title font-bold text-[#0A3825]">
                        ${shippingRules.find((r) => r.city.toLowerCase() === 'lahore')?.shippingFee || 8.00}
                        <span className="text-xs text-slate-500 font-sans font-normal ml-1">(2-3 Business Days)</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">All Pakistan Standard</span>
                      <p className="text-lg font-serif-title font-bold text-[#0A3825]">
                        ${shippingRules.find((r) => r.city.toLowerCase() === 'all' && r.country.toLowerCase() === 'pakistan')?.shippingFee || 10.00}
                        <span className="text-xs text-slate-500 font-sans font-normal ml-1">(Nationwide)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Rules Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-800 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Country</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Zip Code / Area</th>
                          <th className="p-4">Shipping Fee</th>
                          <th className="p-4">Delivery Timeframe</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {shippingRules.map((sr, idx) => (
                          <tr key={sr.id || sr._id ? `${sr.id || sr._id}-${idx}` : `adm-ship-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-[#0A3825]">{sr.country}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                sr.city.toLowerCase() === 'karachi'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {sr.city}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-slate-500">{sr.zipCode || 'All'}</td>
                            <td className="p-4 font-serif-title font-bold text-base text-[#0A3825]">
                              ${(Number(sr.shippingFee) || 0).toFixed(2)}
                            </td>
                            <td className="p-4 text-slate-600">{sr.deliveryTime}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Active
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingShipping(sr);
                                  setActiveFormView('shipping');
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-[#0A3825] text-slate-600 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
                                title="Edit shipping zone"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteShippingRule((sr.id || sr._id) as string)}
                                className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete rule"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- TAB 8: REVIEWS MODERATION -------------------- */}
            {adminTab === 'reviews' && (() => {
              const pendingReviews = reviews.filter((r) => r.approved === false);
              const approvedReviews = reviews.filter((r) => r.approved !== false);
              const filteredReviews =
                reviewFilter === 'pending'
                  ? pendingReviews
                  : reviewFilter === 'approved'
                  ? approvedReviews
                  : reviews;

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <h3 className="text-base font-serif-title font-bold text-[#0A3825] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                        Customer Reviews Moderation & Verification
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Verify customer reviews before publishing them live to the storefront.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
                      <button
                        onClick={() => setReviewFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          reviewFilter === 'all'
                            ? 'bg-[#0A3825] text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({reviews.length})
                      </button>
                      <button
                        onClick={() => setReviewFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                          reviewFilter === 'pending'
                            ? 'bg-amber-600 text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>⏳ Pending</span>
                        {pendingReviews.length > 0 && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                            {pendingReviews.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setReviewFilter('approved')}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          reviewFilter === 'approved'
                            ? 'bg-emerald-700 text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ✅ Verified ({approvedReviews.length})
                      </button>
                    </div>
                  </div>

                  {filteredReviews.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2">
                      <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold">No reviews found in this category.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReviews.map((rev, idx) => {
                        const reviewId = (rev.id || rev._id) as string;
                        const isApproved = rev.approved !== false;
                        const prod = products.find((p) => p.id === rev.productId || p.sku === rev.productId);

                        return (
                          <div
                            key={reviewId ? `${reviewId}-${idx}` : `adm-rev-${idx}`}
                            className={`p-5 bg-white border rounded-2xl space-y-3 shadow-sm transition-all ${
                              !isApproved ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#0A3825] text-amber-300 font-bold flex items-center justify-center text-xs border border-[#D4AF37]/30 shadow-xs">
                                  {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <span className="font-bold text-[#0A3825] text-xs block">{rev.userName}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {prod ? prod.name : `Product ID: ${rev.productId}`}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    isApproved
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                  }`}
                                >
                                  {isApproved ? 'Verified Live' : 'Pending Verification'}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                              "{rev.comment}"
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                              <span>
                                {isApproved
                                  ? 'This review is live on the user storefront.'
                                  : 'Review requires admin verification before appearing on storefront.'}
                              </span>

                              <div className="flex items-center gap-2">
                                {!isApproved && (
                                  <button
                                    onClick={() => approveReview(reviewId)}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteReview(reviewId)}
                                  className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Reject / Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* -------------------- TAB 9: COUPONS -------------------- */}
            {adminTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Storewide & Product-Wise Coupons</h3>
                    <span className="text-xs text-slate-500">Active Promo Codes ({coupons.length})</span>
                  </div>
                  <button
                    onClick={handleOpenAddCoupon}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-[#D4AF37]/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Open Create Coupon Page
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map((c, idx) => (
                    <div key={c.id || c._id ? `${c.id || c._id}-${idx}` : `adm-coup-${idx}`} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-base text-[#0A3825] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                          {c.code}
                        </span>
                        <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                        </span>
                      </div>

                      {c.productId ? (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">Product-Wise Coupon</span>
                          <p className="font-semibold text-slate-800 line-clamp-1">{c.productName || c.productId}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Storewide Coupon</span>
                          <p className="font-medium text-slate-700">Applies to total cart subtotal</p>
                        </div>
                      )}

                      <div className="text-xs text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                        <span>Min Spend: ${c.minSpend || 0}</span>
                        <span>Valid thru: {c.expiryDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 10 & 11: SETTINGS & PROFILE -------------------- */}
            {(adminTab === 'settings' || adminTab === 'profile') && (
              <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-serif-title font-bold text-[#0A3825] capitalize">{adminTab} Configuration</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Store Name</label>
                    <input
                      type="text"
                      defaultValue="MS Home Trends"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      defaultValue="$ (USD)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Admin Concierge Email</label>
                    <input
                      type="email"
                      defaultValue="admin@mshometrends.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    onClick={() => showToast('Settings updated successfully', 'success')}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold px-6 py-3 rounded-xl shadow-sm border border-[#D4AF37]/30 text-xs cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* -------------------- VIEW ORDER DETAILS MODAL -------------------- */}
      <AnimatePresence>
        {viewingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 text-xs shadow-xl text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-serif-title font-bold text-[#0A3825]">Order Details #{viewingOrder.orderNumber}</h3>
                <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-800 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-slate-700">
                <p><strong className="text-[#0A3825]">Customer:</strong> {viewingOrder.customerName} ({viewingOrder.customerEmail})</p>
                <p><strong className="text-[#0A3825]">Payment:</strong> {viewingOrder.paymentMethod}</p>
                <p><strong className="text-[#0A3825]">Status:</strong> {viewingOrder.status}</p>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <strong className="text-[#0A3825] block">Items:</strong>
                  {viewingOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.quantity}x {i.name || i.productName || 'Product'}</span>
                      <span>${((i.price || 0) * (i.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#0A3825]">
                  <span>Total Amount</span>
                  <span>${(viewingOrder.pricing?.total ?? viewingOrder.totalAmount ?? viewingOrder.total ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
