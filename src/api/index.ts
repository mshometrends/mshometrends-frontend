/**
 * MS Home Trends - Centralized API Service Export
 * 
 * Provides unified, typed, and structured access to all backend REST API endpoints.
 * All services are bundled self-contained to eliminate any missing subfolder / Rollup resolution issues on Vercel.
 */

import { apiClient, ApiError, apiFetch } from './client';
import { ENDPOINTS } from './endpoints';
import { API_CONFIG, getApiUrl, getApiV1Url } from './config';
import { Product, Order, Category, User, Coupon, Review, Banner, Offer, ShippingRule } from '../types';
import { uploadImage, deleteImage } from '../services/uploadService';

/* =========================================================================
   1. Product Service
   ========================================================================= */
export const productService = {
  getAll: (params?: { category?: string; search?: string }) => {
    let url = ENDPOINTS.PRODUCTS.BASE;
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
    return apiClient.get<Product[]>(url);
  },

  getById: (id: string) => {
    return apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  create: (productData: Partial<Product>) => {
    return apiClient.post<Product>(ENDPOINTS.PRODUCTS.BASE, productData);
  },

  update: (id: string, productData: Partial<Product>) => {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.BY_ID(id), productData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  toggleFeatured: (id: string) => {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.FEATURE(id));
  },
};

/* =========================================================================
   2. Order Service
   ========================================================================= */
export interface AdminOrderQueryParams {
  status?: string;
  paymentStatus?: string;
  source?: string;
  search?: string;
}

export interface AdminOrderResponse {
  success: boolean;
  data: Order[];
  stats?: any;
  message?: string;
}

export interface AdminOrderActionResponse {
  success: boolean;
  data?: Order;
  message?: string;
  order?: Order;
}

export const orderService = {
  getAll: (params?: AdminOrderQueryParams) => {
    let url = ENDPOINTS.ORDERS.BASE;
    if (params) {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.paymentStatus && params.paymentStatus !== 'all') query.append('paymentStatus', params.paymentStatus);
      if (params.source && params.source !== 'all') query.append('source', params.source);
      if (params.search) query.append('search', params.search);
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }
    return apiClient.get<Order[]>(url);
  },

  getAdminOrders: (params?: AdminOrderQueryParams | Record<string, string>) => {
    let url = ENDPOINTS.ADMIN_ORDERS.BASE;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'all') query.append(k, v);
      });
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }
    return apiClient.get<AdminOrderResponse>(url);
  },

  getById: (id: string) => {
    return apiClient.get<Order>(ENDPOINTS.ORDERS.BY_ID(id));
  },

  track: (trackingQuery: string) => {
    return apiClient.get<Order[]>(ENDPOINTS.ORDERS.TRACK(trackingQuery));
  },

  trackOrder: (trackingQuery: string) => {
    return apiClient.get<Order[]>(ENDPOINTS.ORDERS.TRACK(trackingQuery));
  },

  create: (orderData: Partial<Order>) => {
    return apiClient.post<{ success: boolean; data: Order; message?: string }>(ENDPOINTS.ORDERS.BASE, orderData);
  },

  updateStatus: (
    orderId: string,
    statusOrPayload: string | { orderStatus?: string; status?: string; adminNote?: string },
    notes?: string
  ) => {
    const payload = typeof statusOrPayload === 'string' ? { orderStatus: statusOrPayload, notes } : statusOrPayload;
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.STATUS(orderId), payload);
  },

  confirmPayment: (
    orderId: string,
    payloadOrTx?: string | { verifiedBy?: string; adminNote?: string; transactionId?: string }
  ) => {
    const payload = typeof payloadOrTx === 'string' ? { transactionId: payloadOrTx } : payloadOrTx || {};
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.CONFIRM_PAYMENT(orderId), payload);
  },

  rejectPayment: (
    orderId: string,
    payloadOrReason?: string | { rejectionReason?: string; adminNote?: string }
  ) => {
    const payload = typeof payloadOrReason === 'string' ? { rejectionReason: payloadOrReason } : payloadOrReason || {};
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.REJECT_PAYMENT(orderId), payload);
  },

  uploadPaymentScreenshot: (orderId: string, screenshotUrl: string, transactionId?: string) => {
    return apiClient.post<{ success: boolean; order: Order; message: string }>(
      ENDPOINTS.ORDERS.PAYMENT_SCREENSHOT(orderId),
      { screenshotUrl, transactionId }
    );
  },

  getInvoice: (orderId: string) => {
    return apiClient.get<{ success: boolean; invoiceNumber: string; order: Order }>(
      ENDPOINTS.ORDERS.INVOICE(orderId)
    );
  },
};

/* =========================================================================
   3. Admin Service
   ========================================================================= */
export interface AdminStats {
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

export interface AdminOrdersResponse {
  success: boolean;
  count: number;
  stats?: AdminStats;
  data: Order[];
  message?: string;
}

export const adminService = {
  getOverview: () => {
    return apiClient.get<{
      success: boolean;
      message: string;
      endpoint: string;
      data: {
        totalOrders: number;
        pendingOrders: number;
        totalProducts: number;
        totalUsers: number;
        totalRevenue: number;
      };
    }>(ENDPOINTS.ADMIN.BASE);
  },

  getStats: () => {
    return apiClient.get<AdminOrdersResponse>(ENDPOINTS.ADMIN.STATS);
  },

  getOrders: (params?: Record<string, string>) => {
    let url = ENDPOINTS.ADMIN.ORDERS;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return apiClient.get<AdminOrdersResponse>(url);
  },

  getOrderById: (orderId: string) => {
    return apiClient.get<{ success: boolean; data: Order; message?: string }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}`
    );
  },

  confirmPayment: (orderId: string, data?: { verifiedBy?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/confirm-payment`,
      data
    );
  },

  rejectPayment: (orderId: string, data?: { rejectionReason?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/reject-payment`,
      data
    );
  },

  updateOrderStatus: (orderId: string, data: { orderStatus?: string; status?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/status`,
      data
    );
  },

  getUsers: () => {
    return apiClient.get(ENDPOINTS.ADMIN.USERS);
  },

  deleteUser: (userId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `${ENDPOINTS.ADMIN.USERS}/${encodeURIComponent(userId)}`
    );
  },

  seedAdmin: (credentials?: { email?: string; password?: string; name?: string; phone?: string }) => {
    return apiClient.post<{ success: boolean; message: string; data: any }>(
      ENDPOINTS.ADMIN.SEED_ADMIN,
      credentials
    );
  },

  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<{ success: boolean; message: string; user?: any; token?: string }>(
      ENDPOINTS.ADMIN.LOGIN,
      credentials
    );
  },
};

/* =========================================================================
   4. Category Service
   ========================================================================= */
export const categoryService = {
  getAll: () => {
    return apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.BASE);
  },

  getById: (id: string) => {
    return apiClient.get<Category>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  create: (categoryData: Partial<Category>) => {
    return apiClient.post<Category>(ENDPOINTS.CATEGORIES.BASE, categoryData);
  },

  update: (id: string, categoryData: Partial<Category>) => {
    return apiClient.put<Category>(ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

/* =========================================================================
   5. User Service
   ========================================================================= */
export const userService = {
  getAll: () => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE);
  },

  login: (credentials: { email?: string; phone?: string; password?: string; name?: string }) => {
    return apiClient.post<{ user: User; token?: string }>(ENDPOINTS.USERS.LOGIN, credentials);
  },

  register: (userData: Partial<User> & { password?: string }) => {
    return apiClient.post<{ user: User; token?: string }>(ENDPOINTS.USERS.REGISTER, userData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.USERS.BY_ID(id));
  },

  seedAdmin: (credentials?: { email?: string; password?: string; name?: string; phone?: string }) => {
    return apiClient.post<{ success: boolean; message: string; data: any }>(ENDPOINTS.USERS.SEED_ADMIN, credentials);
  },
};

/* =========================================================================
   6. Coupon Service
   ========================================================================= */
export const couponService = {
  getAll: () => {
    return apiClient.get<Coupon[]>(ENDPOINTS.COUPONS.BASE);
  },

  create: (couponData: Partial<Coupon>) => {
    return apiClient.post<Coupon>(ENDPOINTS.COUPONS.BASE, couponData);
  },

  validate: (code: string, cartTotal: number) => {
    return apiClient.post<{ valid: boolean; coupon?: Coupon; discountAmount?: number; message?: string }>(
      ENDPOINTS.COUPONS.VALIDATE,
      { code, cartTotal }
    );
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.COUPONS.BY_ID(id));
  },
};

/* =========================================================================
   7. Review Service
   ========================================================================= */
export const reviewService = {
  getAll: (productId?: string) => {
    let url = ENDPOINTS.REVIEWS.BASE;
    if (productId) {
      url += `?productId=${encodeURIComponent(productId)}`;
    }
    return apiClient.get<Review[]>(url);
  },

  create: (reviewData: Partial<Review>) => {
    return apiClient.post<Review>(ENDPOINTS.REVIEWS.BASE, reviewData);
  },

  approve: (reviewId: string) => {
    return apiClient.put<Review>(ENDPOINTS.REVIEWS.APPROVE(reviewId));
  },

  delete: (reviewId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.REVIEWS.BY_ID(reviewId));
  },
};

/* =========================================================================
   8. Banner Service
   ========================================================================= */
export const bannerService = {
  getAll: () => {
    return apiClient.get<Banner[]>(ENDPOINTS.BANNERS.BASE);
  },

  create: (bannerData: Partial<Banner>) => {
    return apiClient.post<Banner>(ENDPOINTS.BANNERS.BASE, bannerData);
  },

  update: (id: string, bannerData: Partial<Banner>) => {
    return apiClient.put<Banner>(ENDPOINTS.BANNERS.BY_ID(id), bannerData);
  },

  toggle: (id: string) => {
    return apiClient.put<{ success: boolean; banner: Banner }>(ENDPOINTS.BANNERS.TOGGLE(id));
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.BANNERS.BY_ID(id));
  },
};

/* =========================================================================
   9. Offer Service
   ========================================================================= */
export const offerService = {
  getAll: () => {
    return apiClient.get<Offer[]>(ENDPOINTS.OFFERS.BASE);
  },

  create: (offerData: Partial<Offer>) => {
    return apiClient.post<Offer>(ENDPOINTS.OFFERS.BASE, offerData);
  },

  update: (id: string, offerData: Partial<Offer>) => {
    return apiClient.put<Offer>(ENDPOINTS.OFFERS.BY_ID(id), offerData);
  },

  toggle: (id: string) => {
    return apiClient.put<{ success: boolean; offer: Offer }>(ENDPOINTS.OFFERS.TOGGLE(id));
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.OFFERS.BY_ID(id));
  },
};

/* =========================================================================
   10. Shipping Service
   ========================================================================= */
export const shippingService = {
  getAll: () => {
    return apiClient.get<ShippingRule[]>(ENDPOINTS.SHIPPING.BASE);
  },

  create: (ruleData: Partial<ShippingRule>) => {
    return apiClient.post<ShippingRule>(ENDPOINTS.SHIPPING.BASE, ruleData);
  },

  calculate: (cartTotal: number, city?: string) => {
    return apiClient.post<{ shippingFee: number; appliedRule?: ShippingRule; freeShippingEligible?: boolean }>(
      ENDPOINTS.SHIPPING.CALCULATE,
      { cartTotal, city }
    );
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.SHIPPING.BY_ID(id));
  },
};

/* =========================================================================
   11. System Service
   ========================================================================= */
export const systemService = {
  getDbStatus: () => {
    return apiClient.get<{
      connected: boolean;
      status: string;
      counts: {
        products: number;
        categories: number;
        orders: number;
        reviews: number;
        coupons: number;
      };
      database: string;
      cloudinary: {
        configured: boolean;
        cloudName?: string;
      };
    }>(ENDPOINTS.SYSTEM.DB_STATUS);
  },

  seedDatabase: () => {
    return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.SYSTEM.SEED);
  },

  purgeMockData: () => {
    return apiClient.post<{ success: boolean; message: string; deleted: any }>(ENDPOINTS.SYSTEM.PURGE_MOCK);
  },

  checkHealth: () => {
    return apiClient.get<{ status: string; uptime: number; timestamp: string }>(ENDPOINTS.SYSTEM.HEALTH);
  },
};

/* =========================================================================
   Centralized API Facade Export
   ========================================================================= */
export const api = {
  products: productService,
  orders: orderService,
  admin: adminService,
  categories: categoryService,
  users: userService,
  coupons: couponService,
  reviews: reviewService,
  banners: bannerService,
  offers: offerService,
  shipping: shippingService,
  system: systemService,
  upload: {
    uploadImage,
    deleteImage,
  },
};

export { apiClient, ApiError, apiFetch };
export { ENDPOINTS };
export { API_CONFIG, getApiUrl, getApiV1Url };
