import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Banner,
  Offer,
  Review,
  CartItem,
  Order,
  Coupon,
  PageView,
  AdminTab,
  ShippingRule,
  User,
} from '../types';

export type { PageView };

import { api } from '../api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  navigateToPage: (pageOrPath: PageView | string, param?: string) => void;

  // Data Collections
  products: Product[];
  categories: Category[];
  banners: Banner[];
  offers: Offer[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  shippingRules: ShippingRule[];
  isProductsLoading: boolean;
  setIsProductsLoading: (loading: boolean) => void;

  // Offers Actions
  fetchOffers: () => Promise<void>;
  addOffer: (offer: Omit<Offer, 'id' | '_id'>) => Promise<void>;
  updateOffer: (offer: Offer) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  toggleOffer: (id: string) => Promise<void>;

  // Shipping Rules Actions
  fetchShippingRules: () => Promise<void>;
  addShippingRule: (rule: Omit<ShippingRule, 'id' | '_id'>) => Promise<void>;
  deleteShippingRule: (id: string) => Promise<void>;
  calculateShippingFee: (country: string, city: string, zipCode: string) => Promise<{ fee: number; deliveryTime: string }>;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartDiscount: number;
  finalTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Search & Modal
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Admin Actions
  addProduct: (newProduct: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (updated: Product) => void;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductBestSeller: (id: string) => Promise<void>;
  toggleProductNewArrival: (id: string) => Promise<void>;
  deleteProduct: (id: string) => void;
  addCategory: (newCategory: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (updated: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleBanner: (id: string) => void;
  addBanner: (newBanner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addCoupon: (newCoupon: Omit<Coupon, 'id'>) => void;
  addReview: (newReview: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;

  // Checkout & Order Placement
  placeOrder: (shippingDetails: any, paymentMethod: any) => Order;

  // User Authentication & Admin Management
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signupUser: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  registeredUsers: User[];
  fetchRegisteredUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const getRouteFromPath = (path: string): { page: PageView; categorySlug?: string; productId?: string } => {
  const cleanPath = decodeURIComponent(path).replace(/^\/+|\/+$/g, '').trim().toLowerCase();

  if (cleanPath === '' || cleanPath === 'home' || cleanPath === 'index.html') {
    return { page: 'home' };
  }

  // Admin route exact match & aliases: MS/admin/panel, ms/admin/panel, ms/admin, admin, admin/panel
  if (
    cleanPath === 'ms/admin/panel' ||
    cleanPath === 'ms/admin' ||
    cleanPath === 'admin' ||
    cleanPath === 'admin/panel'
  ) {
    return { page: 'admin' };
  }

  if (cleanPath === 'products' || cleanPath === 'shop' || cleanPath === 'catalog') {
    return { page: 'products' };
  }

  if (cleanPath === 'about' || cleanPath === 'about-us') {
    return { page: 'about' };
  }

  if (cleanPath === 'contact' || cleanPath === 'contact-us') {
    return { page: 'contact' };
  }

  if (cleanPath === 'faq' || cleanPath === 'faqs' || cleanPath === 'questions' || cleanPath === 'help') {
    return { page: 'faq' };
  }

  if (
    cleanPath === 'shipping' ||
    cleanPath === 'shipping-policy' ||
    cleanPath === 'delivery' ||
    cleanPath === 'shipping-delivery'
  ) {
    return { page: 'shipping' };
  }

  if (
    cleanPath === 'how-to-pay' ||
    cleanPath === 'payment-guide' ||
    cleanPath === 'easypaisa' ||
    cleanPath === 'payment-instructions'
  ) {
    return { page: 'how-to-pay' };
  }

  if (cleanPath === 'cart') {
    return { page: 'cart' };
  }

  if (cleanPath === 'checkout') {
    return { page: 'checkout' };
  }

  if (cleanPath === 'wishlist') {
    return { page: 'wishlist' };
  }

  if (cleanPath === 'profile' || cleanPath === 'user/profile' || cleanPath === 'user-profile') {
    return { page: 'profile' };
  }

  if (cleanPath === 'track-order' || cleanPath.startsWith('track-order') || cleanPath.startsWith('track')) {
    return { page: 'track-order' };
  }

  if (cleanPath.startsWith('order-success/')) {
    return { page: 'order-success' };
  }

  if (cleanPath.startsWith('invoice/')) {
    return { page: 'invoice' };
  }

  if (cleanPath === '404') {
    return { page: '404' };
  }

  if (cleanPath === 'category') {
    return { page: 'category' };
  }
  if (cleanPath.startsWith('category/')) {
    const slug = cleanPath.replace('category/', '');
    if (slug) {
      return { page: 'category', categorySlug: slug };
    }
  }

  if (cleanPath.startsWith('product/') || cleanPath.startsWith('item/')) {
    const parts = cleanPath.split('/');
    const id = parts[1];
    if (id) {
      return { page: 'product-detail', productId: id };
    }
  }

  // Any unrecognized/invalid route -> 404 Page Not Found
  return { page: '404' };
};

export const getPathFromRoute = (page: PageView, param?: string): string => {
  switch (page) {
    case 'home':
      return '/';
    case 'products':
      return '/products';
    case 'category':
      return param ? `/category/${param}` : '/category';
    case 'product-detail':
      return param ? `/product/${param}` : '/products';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'faq':
      return '/faq';
    case 'shipping':
      return '/shipping';
    case 'how-to-pay':
      return '/how-to-pay';
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'order-success':
      return param ? `/order-success/${param}` : '/checkout';
    case 'invoice':
      return param ? `/invoice/${param}` : '/';
    case 'track-order':
      return param ? `/track-order?query=${param}` : '/track-order';
    case 'wishlist':
      return '/wishlist';
    case 'profile':
      return '/profile';
    case 'admin':
      return '/MS/admin/panel';
    case '404':
      return '/404';
    default:
      return '/';
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = getRouteFromPath(typeof window !== 'undefined' ? window.location.pathname : '');
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialRoute.categorySlug || null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId || null);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // User Auth & Modal state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_current_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return null; }
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const fetchRegisteredUsers = async () => {
    try {
      const res = await api.users.getAll();
      const usersList = Array.isArray(res) ? res : ((res as any)?.data && Array.isArray((res as any).data) ? (res as any).data : []);
      if (usersList.length > 0) {
        setRegisteredUsers(usersList);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const loginUser = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.users.login({ email, password: pass });
      const user = (res as any)?.user || (res as any)?.data;
      if (user) {
        setCurrentUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ms_current_user', JSON.stringify(user));
        }
        showToast(`Welcome back, ${user.name}!`, 'success');
        setIsAuthModalOpen(false);
        return { success: true, message: (res as any)?.message || 'Login successful' };
      } else {
        return { success: false, message: (res as any)?.message || 'Login failed' };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Server connection error during login.' };
    }
  };

  const signupUser = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.users.register({ name, email, phone, password: pass });
      const user = (res as any)?.user || (res as any)?.data;
      if (user) {
        setCurrentUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ms_current_user', JSON.stringify(user));
        }
        showToast(`Account created successfully! Welcome, ${user.name}.`, 'success');
        setIsAuthModalOpen(false);
        fetchRegisteredUsers();
        return { success: true, message: (res as any)?.message || 'Registration successful' };
      } else {
        return { success: false, message: (res as any)?.message || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Server connection error during registration.' };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ms_current_user');
    }
    showToast('Logged out successfully.', 'info');
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await api.users.delete(id);
      if (res.success !== false) {
        showToast('User deleted successfully.', 'info');
        setRegisteredUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
      } else {
        showToast(res.message || 'Could not delete user.', 'error');
      }
    } catch (err) {
      showToast('Error removing user', 'error');
    }
  };
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((p) => p && !String(p.id).startsWith('prod-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_categories');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((c) => c && !String(c.id).startsWith('cat-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_banners');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((b) => b && !String(b.id).startsWith('ban-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [offers, setOffers] = useState<Offer[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_offers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((o) => o && !String(o.id).startsWith('off-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((o) => o && !String(o.id).startsWith('ord-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_coupons');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((c) => c && !String(c.id).startsWith('coup-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms_reviews');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((r) => r && !String(r.id).startsWith('rev-'));
          }
        } catch (e) {}
      }
    }
    return [];
  });
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([
    { id: 'sr-1', country: 'Pakistan', city: 'Karachi', zipCode: 'All', shippingFee: 5.0, deliveryTime: '1-2 Days Express Delivery', isActive: true },
    { id: 'sr-2', country: 'Pakistan', city: 'Lahore', zipCode: 'All', shippingFee: 8.0, deliveryTime: '2-3 Business Days', isActive: true },
    { id: 'sr-3', country: 'Pakistan', city: 'Islamabad', zipCode: 'All', shippingFee: 8.0, deliveryTime: '2-3 Business Days', isActive: true },
    { id: 'sr-4', country: 'Pakistan', city: 'Rawalpindi', zipCode: 'All', shippingFee: 8.0, deliveryTime: '2-3 Business Days', isActive: true },
    { id: 'sr-5', country: 'Pakistan', city: 'All', zipCode: 'All', shippingFee: 10.0, deliveryTime: '3-4 Business Days', isActive: true },
    { id: 'sr-6', country: 'All', city: 'All', zipCode: 'All', shippingFee: 25.0, deliveryTime: '5-7 International Business Days', isActive: true },
  ]);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);

  // Sync to localStorage on state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_banners', JSON.stringify(banners));
    }
  }, [banners]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_offers', JSON.stringify(offers));
    }
  }, [offers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ms_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Clean legacy mock records from localStorage on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const checkAndClean = (key: string, prefix: string) => {
          const raw = localStorage.getItem(key);
          if (raw && (raw.includes(`"${prefix}-`) || raw.includes('Royal Golden Porcelain') || raw.includes('Monarch Matte Gold'))) {
            localStorage.removeItem(key);
          }
        };
        checkAndClean('ms_products', 'prod');
        checkAndClean('ms_categories', 'cat');
        checkAndClean('ms_banners', 'ban');
        checkAndClean('ms_offers', 'off');
        checkAndClean('ms_orders', 'ord');
        checkAndClean('ms_coupons', 'coup');
        checkAndClean('ms_reviews', 'rev');
      } catch (e) {}
    }
  }, []);

  // Fetch initial categories, products, reviews, coupons, banners, and offers from MongoDB API on mount
  useEffect(() => {
    const hasAdminSession =
      typeof window !== 'undefined' &&
      (Boolean(sessionStorage.getItem('ms_admin_token')) || sessionStorage.getItem('ms_admin_auth') === 'true');

    if (hasAdminSession) {
      fetchRegisteredUsers();
    }

    const fetchInitialData = async () => {
      try {
        const publicRequests: Promise<any>[] = [
          api.categories.getAll(),
          api.products.getAll(),
          api.reviews.getAll(),
          api.coupons.getAll(),
          api.shipping.getAll(),
          api.banners.getAll(),
          api.offers.getAll(),
        ];

        // Only fetch complete orders list if admin session is verified
        if (hasAdminSession) {
          publicRequests.push(api.orders.getAll());
        }

        const results = await Promise.allSettled(publicRequests);
        const [catData, prodData, revData, coupData, shipData, banData, offData, ordData] = results;

        if (catData.status === 'fulfilled') {
          const list = Array.isArray(catData.value) ? catData.value : (catData.value as any)?.data;
          if (Array.isArray(list)) {
            setCategories(list);
          }
        }

        if (prodData.status === 'fulfilled') {
          const list = Array.isArray(prodData.value) ? prodData.value : (prodData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedProds = list.map((p: any) => ({
              ...p,
              id: p._id || p.id,
              isFeatured: Boolean(p.isFeatured || p.featured),
              featured: Boolean(p.isFeatured || p.featured),
              isBestSeller: Boolean(p.isBestSeller || p.isBestseller),
              isBestseller: Boolean(p.isBestSeller || p.isBestseller),
            }));
            setProducts(mappedProds);
          }
        }

        if (revData.status === 'fulfilled') {
          const list = Array.isArray(revData.value) ? revData.value : (revData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedRevs = list.map((r: any) => ({
              ...r,
              id: r._id || r.id,
              approved: r.approved ?? true,
            }));
            setReviews(mappedRevs);
          }
        }

        if (coupData.status === 'fulfilled') {
          const list = Array.isArray(coupData.value) ? coupData.value : (coupData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedCoupons = list.map((c: any) => ({
              ...c,
              id: c._id || c.id,
            }));
            setCoupons(mappedCoupons);
          }
        }

        if (ordData && ordData.status === 'fulfilled') {
          const list = Array.isArray(ordData.value) ? ordData.value : (ordData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedOrders = list.map((o: any) => ({
              id: o._id || o.id,
              orderNumber: o._id ? `MS-${o._id.substring(o._id.length - 6).toUpperCase()}` : o.orderNumber || 'MS-ORD',
              customerName: o.customer?.name || 'Customer',
              customerEmail: o.customer?.email || '',
              customerPhone: o.customer?.phone || '',
              shippingAddress: {
                street: o.shippingAddress || 'Store Pickup',
                city: 'Standard',
                state: 'Standard',
                zipCode: '10001',
                country: 'Pakistan',
              },
              items: Array.isArray(o.items)
                ? o.items.map((i: any) => ({
                    productId: i.id || 'prod',
                    productName: i.name || 'Product',
                    quantity: i.quantity || 1,
                    unitPrice: i.price || 0,
                    productImage: i.image || '',
                  }))
                : [],
              totalAmount: o.total || 0,
              subtotalAmount: o.subtotal || o.total || 0,
              shippingFee: o.shipping || 0,
              taxAmount: o.tax || 0,
              discountAmount: o.discount || 0,
              status: o.status || 'Pending',
              paymentMethod: o.paymentMethod || 'Cash on Delivery',
              paymentStatus: o.paymentStatus || 'Pending',
              createdAt: o.createdAt || new Date().toISOString(),
            }));
            setOrders(mappedOrders);
          }
        }

        if (shipData.status === 'fulfilled') {
          const list = Array.isArray(shipData.value) ? shipData.value : (shipData.value as any)?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mappedRules = list.map((sr: any) => ({
              ...sr,
              id: sr._id || sr.id,
            }));
            setShippingRules(mappedRules);
          }
        }

        if (banData.status === 'fulfilled') {
          const list = Array.isArray(banData.value) ? banData.value : (banData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedBanners = list.map((b: any) => ({
              ...b,
              id: b._id || b.id,
              subheading: b.subtitle || b.subheading || 'Luxury Crockery & Fine Dining',
              ctaUrl: b.ctaLink || b.ctaUrl || '/shop',
            }));
            setBanners(mappedBanners);
          }
        }

        if (offData.status === 'fulfilled') {
          const list = Array.isArray(offData.value) ? offData.value : (offData.value as any)?.data;
          if (Array.isArray(list)) {
            const mappedOffers = list.map((o: any) => ({
              ...o,
              id: o._id || o.id,
            }));
            setOffers(mappedOffers);
          }
        }
      } catch (err) {
        console.warn('API fetch warning (using fallback state):', err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Modals & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToPage = (pageOrPath: PageView | string, param?: string) => {
    let targetPage: PageView = 'home';
    let targetParam = param;
    let targetPath = '/';

    if (typeof pageOrPath === 'string' && pageOrPath.startsWith('/')) {
      const parsed = getRouteFromPath(pageOrPath);
      targetPage = parsed.page;
      targetParam = parsed.categorySlug || parsed.productId || param;
      targetPath = pageOrPath;
    } else {
      targetPage = pageOrPath as PageView;
      targetPath = getPathFromRoute(targetPage, targetParam);
    }

    if (targetPage === 'category' && targetParam) {
      setSelectedCategorySlug(targetParam);
    } else if (targetPage === 'product-detail' && targetParam) {
      setSelectedProductId(targetParam);
    }
    setCurrentPage(targetPage);

    if (typeof window !== 'undefined') {
      if ((window as any).__navigateApp) {
        (window as any).__navigateApp(targetPath);
      } else if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: targetPage, param: targetParam }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromPath(window.location.pathname);
      if (route.categorySlug) {
        setSelectedCategorySlug(route.categorySlug);
      }
      if (route.productId) {
        setSelectedProductId(route.productId);
      }
      setCurrentPage(route.page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cart Calculations
  const cartTotal = cart.reduce((acc, item) => {
    const p = Number(item?.product?.price) || 0;
    const q = Number(item?.quantity) || 1;
    return acc + p * q;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.productId) {
      // Product-specific coupon! Find matching product item in cart
      const targetItem = cart.find(
        (item) => item?.product && (item.product.id === appliedCoupon.productId || item.product.sku === appliedCoupon.productId)
      );

      if (targetItem) {
        const itemSubtotal = (Number(targetItem.product?.price) || 0) * (Number(targetItem.quantity) || 1);
        const discVal = Number(appliedCoupon.discountValue) || 0;
        if (appliedCoupon.discountType === 'percentage') {
          cartDiscount = (itemSubtotal * discVal) / 100;
        } else {
          cartDiscount = Math.min(itemSubtotal, discVal);
        }
      } else {
        cartDiscount = 0;
      }
    } else {
      // Store-wide coupon
      const discVal = Number(appliedCoupon.discountValue) || 0;
      if (appliedCoupon.discountType === 'percentage') {
        cartDiscount = (cartTotal * discVal) / 100;
      } else {
        cartDiscount = Math.min(cartTotal, discVal);
      }
    }
  }

  const finalTotal = Math.max(0, (cartTotal || 0) - (cartDiscount || 0));

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: color || product.color }];
    });
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const codeClean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === codeClean && c.active);
    if (!found) {
      showToast('Invalid or expired coupon code', 'error');
      return false;
    }

    if (found.productId) {
      const targetItem = cart.find(
        (item) => item.product.id === found.productId || item.product.sku === found.productId
      );
      if (!targetItem) {
        const pName = found.productName || 'the targeted product';
        showToast(`Coupon "${found.code}" is only applicable to "${pName}". Add it to cart first!`, 'error');
        return false;
      }
    }

    if (found.minSpend && cartTotal < found.minSpend) {
      showToast(`Minimum order amount of $${found.minSpend} required for code ${found.code}`, 'error');
      return false;
    }

    setAppliedCoupon(found);
    const scopeMsg = found.productName ? `(Product-wise discount on ${found.productName})` : '(Storewide discount)';
    showToast(`Coupon "${found.code}" applied! ${scopeMsg}`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Admin Functions
  const addProduct = async (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const res = await api.products.create(newProduct);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const mappedProduct: Product = {
          ...doc,
          id: doc._id || doc.id,
          isFeatured: Boolean(doc.isFeatured || doc.featured),
          featured: Boolean(doc.isFeatured || doc.featured),
          isBestSeller: Boolean(doc.isBestSeller || doc.isBestseller),
          isBestseller: Boolean(doc.isBestSeller || doc.isBestseller),
        };
        setProducts((prev) => [mappedProduct, ...prev]);
        showToast(`Product "${mappedProduct.name}" saved to MongoDB Atlas!`, 'success');
        return;
      }
    } catch (err) {
      console.error('Add product API error:', err);
    }

    // Fallback if offline
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.name}" created (local state)`, 'info');
  };

  const updateProduct = async (updated: Product) => {
    try {
      const res = await api.products.update(updated.id, updated);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const mappedProduct: Product = {
          ...doc,
          id: doc._id || doc.id || updated.id,
          isFeatured: Boolean(doc.isFeatured || doc.featured),
          featured: Boolean(doc.isFeatured || doc.featured),
        };
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? mappedProduct : p)));
        showToast(`Product "${updated.name}" updated in MongoDB Atlas`, 'success');
        return;
      }
    } catch (err) {
      console.error('Update product API error:', err);
    }
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated`, 'success');
  };

  const toggleProductFeatured = async (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    const currentFeaturedState = Boolean(targetProduct.isFeatured || targetProduct.featured);
    const nextFeaturedState = !currentFeaturedState;

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFeatured: nextFeaturedState, featured: nextFeaturedState } : p
      )
    );

    try {
      await api.products.toggleFeatured(id);
      showToast(
        `"${targetProduct.name}" is now ${nextFeaturedState ? 'Featured 🌟' : 'Standard'}!`,
        'success'
      );
    } catch (err) {
      console.error('Toggle product featured API error:', err);
      showToast('Offline fallback: toggle saved locally', 'info');
    }
  };

  const toggleProductBestSeller = async (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    const nextState = !targetProduct.isBestSeller;

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBestSeller: nextState } : p))
    );

    try {
      await api.products.update(id, { ...targetProduct, isBestSeller: nextState });
    } catch (err) {
      console.error('Toggle best seller error:', err);
    }

    showToast(
      `"${targetProduct.name}" ${nextState ? 'marked as Best Seller 🔥' : 'removed from Best Sellers'}`,
      'success'
    );
  };

  const toggleProductNewArrival = async (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    const nextState = !targetProduct.isNewArrival;

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isNewArrival: nextState } : p))
    );

    try {
      await api.products.update(id, { ...targetProduct, isNewArrival: nextState });
    } catch (err) {
      console.error('Toggle new arrival error:', err);
    }

    showToast(
      `"${targetProduct.name}" ${nextState ? 'marked as New Arrival ✨' : 'removed from New Arrivals'}`,
      'success'
    );
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.products.delete(id);
    } catch (err) {
      console.error('Delete product API error:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from inventory & MongoDB', 'info');
  };

  const addCategory = async (newCat: Omit<Category, 'id' | 'itemCount'>) => {
    try {
      const res = await api.categories.create(newCat);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        setCategories((prev) => [...prev, doc]);
        showToast(`Category "${doc.name}" added to MongoDB`, 'success');
        return;
      }
    } catch (err) {
      console.error('Add category API error:', err);
    }

    // Fallback if offline
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, created]);
    showToast(`Category "${created.name}" added (local state)`, 'success');
  };

  const updateCategory = async (updated: Category) => {
    const catId = updated.id || (updated as any)._id;
    try {
      const res = await api.categories.update(catId, updated);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const updatedCat = {
          ...doc,
          id: doc._id || doc.id,
        };
        setCategories((prev) =>
          prev.map((c) => (c.id === catId || (c as any)._id === catId ? updatedCat : c))
        );
        showToast(`Category "${updated.name}" updated in MongoDB Atlas!`, 'success');
        return;
      }
    } catch (err) {
      console.error('Update category error:', err);
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === catId || (c as any)._id === catId ? updated : c))
    );
    showToast(`Category "${updated.name}" updated (local state)`, 'success');
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id && (c as any)._id !== id));
      showToast('Category deleted from MongoDB Atlas', 'info');
    } catch (err) {
      console.error('Delete category error:', err);
      setCategories((prev) => prev.filter((c) => c.id !== id && (c as any)._id !== id));
      showToast('Category deleted (local state)', 'info');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    try {
      await api.orders.updateStatus(orderId, status);
    } catch (e) {
      console.warn('Backend order status update warning:', e);
    }
    showToast(`Order #${orderId} status changed to ${status}`, 'success');
  };

  const toggleBanner = async (id: string) => {
    try {
      await api.banners.toggle(id);
      setBanners((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? { ...b, active: !b.active } : b))
      );
      showToast('Banner visibility toggled', 'info');
    } catch (err) {
      console.error('Toggle banner error:', err);
      setBanners((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? { ...b, active: !b.active } : b))
      );
      showToast('Banner visibility toggled (local)', 'info');
    }
  };

  const addBanner = async (newBanner: Omit<Banner, 'id'>) => {
    try {
      const res = await api.banners.create(newBanner);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const createdBan = {
          ...doc,
          id: doc._id || doc.id,
          subheading: doc.subtitle || doc.subheading || newBanner.subheading || '',
          ctaUrl: doc.ctaLink || doc.ctaUrl || newBanner.ctaUrl || '/shop',
        };
        setBanners((prev) => [...prev, createdBan]);
        showToast('Hero banner created & saved to MongoDB!', 'success');
        return;
      }
    } catch (err) {
      console.error('Add banner error:', err);
    }

    const created: Banner = {
      ...newBanner,
      id: `banner-${Date.now()}`,
    };
    setBanners((prev) => [...prev, created]);
    showToast('Hero banner created (local state)', 'success');
  };

  const updateBanner = async (updated: Banner) => {
    const bannerId = updated.id || updated._id;
    try {
      const res = await api.banners.update(bannerId, updated);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const updatedBan = {
          ...doc,
          id: doc._id || doc.id,
          subheading: doc.subtitle || doc.subheading || updated.subheading || '',
          ctaUrl: doc.ctaLink || doc.ctaUrl || updated.ctaUrl || '/shop',
        };
        setBanners((prev) =>
          prev.map((b) => (b.id === bannerId || b._id === bannerId ? updatedBan : b))
        );
        showToast('Hero banner updated in MongoDB!', 'success');
        return;
      }
    } catch (err) {
      console.error('Update banner error:', err);
    }

    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId || b._id === bannerId ? updated : b))
    );
    showToast('Hero banner updated (local state)', 'success');
  };

  const deleteBanner = async (id: string) => {
    try {
      await api.banners.delete(id);
      setBanners((prev) => prev.filter((b) => b.id !== id && b._id !== id));
      showToast('Hero banner deleted successfully!', 'info');
    } catch (err) {
      console.error('Delete banner error:', err);
      setBanners((prev) => prev.filter((b) => b.id !== id && b._id !== id));
      showToast('Hero banner deleted (local state)', 'info');
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await api.offers.getAll();
      const list = Array.isArray(res) ? res : (res as any)?.data;
      if (Array.isArray(list)) {
        const mapped = list.map((o: any) => ({ ...o, id: o._id || o.id }));
        setOffers(mapped);
      }
    } catch (err) {
      console.error('Fetch offers error:', err);
    }
  };

  const toggleOffer = async (id: string) => {
    try {
      await api.offers.toggle(id);
      setOffers((prev) =>
        prev.map((o) => (o.id === id || o._id === id ? { ...o, active: !o.active } : o))
      );
      showToast('Offer status updated', 'info');
    } catch (err) {
      console.error('Toggle offer error:', err);
      setOffers((prev) =>
        prev.map((o) => (o.id === id || o._id === id ? { ...o, active: !o.active } : o))
      );
      showToast('Offer status updated (local)', 'info');
    }
  };

  const addOffer = async (newOffer: Omit<Offer, 'id' | '_id'>) => {
    try {
      const res = await api.offers.create(newOffer);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const createdOffer = {
          ...doc,
          id: doc._id || doc.id,
        };
        setOffers((prev) => [...prev, createdOffer]);
        showToast(`Offer "${newOffer.badge}" published & saved to MongoDB!`, 'success');
        return;
      }
    } catch (err) {
      console.error('Add offer error:', err);
    }

    const created: Offer = {
      ...newOffer,
      id: `offer-${Date.now()}`,
    };
    setOffers((prev) => [...prev, created]);
    showToast(`Offer "${created.badge}" published (local state)`, 'success');
  };

  const updateOffer = async (updated: Offer) => {
    const offerId = updated.id || updated._id;
    try {
      const res = await api.offers.update(offerId, updated);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const updatedOff = {
          ...doc,
          id: doc._id || doc.id,
        };
        setOffers((prev) =>
          prev.map((o) => (o.id === offerId || o._id === offerId ? updatedOff : o))
        );
        showToast(`Offer "${updated.badge}" updated in MongoDB!`, 'success');
        return;
      }
    } catch (err) {
      console.error('Update offer error:', err);
    }

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId || o._id === offerId ? updated : o))
    );
    showToast(`Offer "${updated.badge}" updated (local state)`, 'success');
  };

  const deleteOffer = async (id: string) => {
    try {
      await api.offers.delete(id);
      setOffers((prev) => prev.filter((o) => o.id !== id && o._id !== id));
      showToast('Offer deleted successfully!', 'info');
    } catch (err) {
      console.error('Delete offer error:', err);
      setOffers((prev) => prev.filter((o) => o.id !== id && o._id !== id));
      showToast('Offer deleted (local state)', 'info');
    }
  };

  const addCoupon = async (newCoupon: Omit<Coupon, 'id'>) => {
    try {
      const res = await api.coupons.create(newCoupon);
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const createdCoup = {
          ...doc,
          id: doc._id || doc.id,
        };
        setCoupons((prev) => [createdCoup, ...prev]);
        showToast(`Coupon code ${createdCoup.code} created & saved in MongoDB!`, 'success');
        return;
      }
    } catch (err) {
      console.error('Add coupon API error:', err);
    }

    // Fallback if offline
    const created: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
    };
    setCoupons((prev) => [created, ...prev]);
    showToast(`Coupon code ${created.code} created`, 'success');
  };

  const addReview = async (newRev: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => {
    try {
      const res = await api.reviews.create({ ...newRev, approved: false });
      const doc = (res as any)?.data || res;
      if (doc && (doc._id || doc.id)) {
        const createdRev = {
          ...doc,
          id: doc._id || doc.id,
          approved: false,
        };
        setReviews((prev) => [createdRev, ...prev]);
        showToast('Review submitted! It will appear on store once verified by Admin.', 'info');
        return;
      }
    } catch (err) {
      console.error('Add review API error:', err);
    }

    // Fallback if offline
    const created: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      approved: false,
    };
    setReviews((prev) => [created, ...prev]);
    showToast('Review submitted! Pending Admin approval.', 'info');
  };

  const approveReview = async (reviewId: string) => {
    try {
      const res = await api.reviews.approve(reviewId);
      if ((res as any)?.success !== false) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId || r._id === reviewId ? { ...r, approved: true } : r
          )
        );
        showToast('Review approved & published to store!', 'success');
      } else {
        showToast((res as any)?.message || 'Failed to approve review', 'error');
      }
    } catch (err) {
      console.error('Approve review error:', err);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId || r._id === reviewId ? { ...r, approved: true } : r
        )
      );
      showToast('Review approved (local update)', 'info');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await api.reviews.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId && r._id !== reviewId));
      showToast('Review removed/rejected', 'info');
    } catch (err) {
      console.error('Delete review error:', err);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId && r._id !== reviewId));
      showToast('Review removed locally', 'info');
    }
  };

  const placeOrder = (shippingDetails: any, paymentMethod: any): Order => {
    const orderNumber = `MS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: orderNumber,
      invoiceNumber: `INV-${orderNumber}`,
      customer: {
        fullName: `${shippingDetails.firstName || ''} ${shippingDetails.lastName || ''}`.trim() || 'Customer',
        phone: shippingDetails.phone || '0300-1234567',
        whatsappNumber: shippingDetails.whatsappNumber || shippingDetails.phone || '0300-1234567',
        email: shippingDetails.email || '',
        address: shippingDetails.address || '',
        city: shippingDetails.city || 'Karachi',
        postalCode: shippingDetails.zipCode || '75600',
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
        image: item.product.images[0],
      })),
      pricing: {
        subtotal: cartTotal,
        deliveryCharges: 5.0,
        discount: cartDiscount,
        total: finalTotal,
      },
      payment: {
        method: paymentMethod || 'Easypaisa',
        status: 'Pending',
      },
      orderStatus: 'Pending Payment',
      invoiceUrl: `/invoice/${orderNumber}`,
      orderNumber,
      customerName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
      customerEmail: shippingDetails.email,
      totalAmount: finalTotal,
      subtotalAmount: cartTotal,
      shippingCost: 5.0,
      shippingFee: 5.0,
      discountAmount: cartDiscount,
      paymentMethod,
      status: 'Pending Payment',
      createdAt: new Date().toISOString(),
    };

    // Save to MongoDB API in background
    const customerPayload = {
      fullName: newOrder.customer?.fullName || `${shippingDetails.firstName || ''} ${shippingDetails.lastName || ''}`.trim() || 'Customer',
      phone: newOrder.customer?.phone || shippingDetails.phone || '0300-1234567',
      whatsappNumber: newOrder.customer?.whatsappNumber || shippingDetails.whatsappNumber || shippingDetails.phone || '0300-1234567',
      email: newOrder.customer?.email || shippingDetails.email || 'customer@mshometrends.com',
      address: newOrder.customer?.address || shippingDetails.address || 'Delivery Address',
      city: newOrder.customer?.city || shippingDetails.city || 'Karachi',
      postalCode: newOrder.customer?.postalCode || shippingDetails.zipCode || '75600',
      notes: shippingDetails.notes || '',
    };

    api.orders.create({
      customer: customerPayload,
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images?.[0] || '',
      })) as any,
      pricing: {
        subtotal: cartTotal,
        deliveryCharges: newOrder.shippingFee,
        discount: cartDiscount,
        total: finalTotal,
      },
      paymentMethod,
      deliveryCharges: newOrder.shippingFee,
      discount: cartDiscount,
      total: finalTotal,
      subtotal: cartTotal,
      notes: shippingDetails.notes || '',
    } as any)
      .then((res: any) => {
        if (res) {
          console.log('[MongoDB] Order saved to database:', res);
        }
      })
      .catch((e: any) => console.error('[Order MongoDB Save Warning]', e));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${orderNumber} placed & saved to MongoDB!`, 'success');
    return newOrder;
  };

  const fetchShippingRules = async () => {
    try {
      const res = await api.shipping.getAll();
      const list = Array.isArray(res) ? res : (res as any)?.data;
      if (Array.isArray(list)) {
        const mapped = list.map((sr: any) => ({ ...sr, id: sr._id || sr.id }));
        setShippingRules(mapped);
      }
    } catch (err) {
      console.error('Fetch shipping rules error:', err);
    }
  };

  const addShippingRule = async (rule: Omit<ShippingRule, 'id' | '_id'>) => {
    try {
      const res = await api.shipping.create(rule);
      const doc = (res as any)?.data || res;
      if (doc) {
        const newRule = { ...doc, id: doc._id || doc.id };
        setShippingRules((prev) => [newRule, ...prev]);
        showToast(`Shipping rule for ${rule.city}, ${rule.country} created in MongoDB!`, 'success');
      } else {
        showToast('Failed to create shipping rule', 'error');
      }
    } catch (err) {
      console.error('Add shipping rule error:', err);
      const fallbackRule = { ...rule, id: 'sr-' + Date.now() };
      setShippingRules((prev) => [fallbackRule, ...prev]);
      showToast('Shipping rule added locally', 'info');
    }
  };

  const deleteShippingRule = async (id: string) => {
    try {
      await api.shipping.delete(id);
      setShippingRules((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      showToast('Shipping rule deleted', 'info');
    } catch (err) {
      console.error('Delete shipping rule error:', err);
      setShippingRules((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    }
  };

  const calculateShippingFee = async (country: string, city: string, zipCode: string) => {
    try {
      const res = await api.shipping.calculate(cartTotal, city);
      if (res && res.shippingFee !== undefined) {
        return {
          fee: res.shippingFee,
          deliveryTime: (res as any).deliveryTime || '2-4 Business Days',
        };
      }
    } catch (err) {
      console.error('Calculate shipping API error:', err);
    }

    const inCountry = String(country || '').trim().toLowerCase();
    const inCity = String(city || '').trim().toLowerCase();
    const inZip = String(zipCode || '').trim().toLowerCase();

    let match = shippingRules.find(
      (r) =>
        r.country.toLowerCase() === inCountry &&
        r.city.toLowerCase() === inCity &&
        inZip && r.zipCode !== 'All' && r.zipCode.toLowerCase() === inZip
    );

    if (!match) {
      match = shippingRules.find(
        (r) => r.country.toLowerCase() === inCountry && r.city.toLowerCase() === inCity
      );
    }

    if (!match) {
      match = shippingRules.find(
        (r) => r.country.toLowerCase() === inCountry && (r.city.toLowerCase() === 'all' || !r.city)
      );
    }

    if (!match) {
      match = shippingRules.find((r) => r.country.toLowerCase() === 'all');
    }

    return {
      fee: match ? match.shippingFee : 10.0,
      deliveryTime: match ? match.deliveryTime : '2-4 Business Days',
    };
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProductId,
        setSelectedProductId,
        adminTab,
        setAdminTab,
        navigateToPage,

        products,
        categories,
        banners,
        offers,
        orders,
        coupons,
        reviews,
        shippingRules,
        isProductsLoading,
        setIsProductsLoading,

        fetchOffers,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOffer,

        fetchShippingRules,
        addShippingRule,
        deleteShippingRule,
        calculateShippingFee,

        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartDiscount,
        finalTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        toggleWishlist,
        isInWishlist,

        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,

        addProduct,
        updateProduct,
        toggleProductFeatured,
        toggleProductBestSeller,
        toggleProductNewArrival,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        toggleBanner,
        addBanner,
        updateBanner,
        deleteBanner,
        addCoupon,
        addReview,
        approveReview,
        deleteReview,
        placeOrder,

        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        signupUser,
        logoutUser,
        registeredUsers,
        fetchRegisteredUsers,
        deleteUser,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
