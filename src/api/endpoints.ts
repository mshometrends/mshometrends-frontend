/**
 * MS Home Trends - Centralized API Endpoint Definitions
 * Every backend REST endpoint is cleanly indexed here for transparency and maintainability.
 */

export const ENDPOINTS = {
  // Authentication & Users
  USERS: {
    BASE: '/api/v1/users',
    LOGIN: '/api/v1/users/login',
    REGISTER: '/api/v1/users/register',
    SEED_ADMIN: '/api/v1/users/seed-admin',
    BY_ID: (id: string) => `/api/v1/users/${encodeURIComponent(id)}`,
  },

  // Unified Admin API
  ADMIN: {
    BASE: '/api/v1/admin',
    STATS: '/api/v1/admin/stats',
    ORDERS: '/api/v1/admin/orders',
    USERS: '/api/v1/admin/users',
    SEED_ADMIN: '/api/v1/admin/seed-admin',
    LOGIN: '/api/v1/admin/login',
  },

  // Products
  PRODUCTS: {
    BASE: '/api/v1/products',
    BY_ID: (id: string) => `/api/v1/products/${encodeURIComponent(id)}`,
    FEATURE: (id: string) => `/api/v1/products/${encodeURIComponent(id)}/feature`,
    SEARCH: (query: string) => `/api/v1/products?search=${encodeURIComponent(query)}`,
    BY_CATEGORY: (category: string) => `/api/v1/products?category=${encodeURIComponent(category)}`,
  },

  // Categories
  CATEGORIES: {
    BASE: '/api/v1/categories',
    BY_ID: (id: string) => `/api/v1/categories/${encodeURIComponent(id)}`,
  },

  // Orders
  ORDERS: {
    BASE: '/api/v1/orders',
    LEGACY_BASE: '/api/v1/orders',
    BY_ID: (id: string) => `/api/v1/orders/${encodeURIComponent(id)}`,
    TRACK: (id: string) => `/api/v1/orders/track/${encodeURIComponent(id)}`,
    STATUS: (id: string) => `/api/v1/orders/${encodeURIComponent(id)}/status`,
    PAYMENT_SCREENSHOT: (id: string) => `/api/v1/orders/${encodeURIComponent(id)}/payment-screenshot`,
    INVOICE: (id: string) => `/api/v1/orders/${encodeURIComponent(id)}/invoice`,
  },

  // Admin Order Management
  ADMIN_ORDERS: {
    BASE: '/api/v1/admin/orders',
    CONFIRM_PAYMENT: (id: string) => `/api/v1/admin/orders/${encodeURIComponent(id)}/confirm-payment`,
    REJECT_PAYMENT: (id: string) => `/api/v1/admin/orders/${encodeURIComponent(id)}/reject-payment`,
    STATUS: (id: string) => `/api/v1/admin/orders/${encodeURIComponent(id)}/status`,
  },

  // Reviews
  REVIEWS: {
    BASE: '/api/v1/reviews',
    BY_ID: (id: string) => `/api/v1/reviews/${encodeURIComponent(id)}`,
    APPROVE: (id: string) => `/api/v1/reviews/${encodeURIComponent(id)}/approve`,
  },

  // Coupons & Discounts
  COUPONS: {
    BASE: '/api/v1/coupons',
    VALIDATE: '/api/v1/coupons/validate',
    BY_ID: (id: string) => `/api/v1/coupons/${encodeURIComponent(id)}`,
  },

  // Offers & Promotional Bars
  OFFERS: {
    BASE: '/api/v1/offers',
    BY_ID: (id: string) => `/api/v1/offers/${encodeURIComponent(id)}`,
    TOGGLE: (id: string) => `/api/v1/offers/${encodeURIComponent(id)}/toggle`,
  },

  // Banners & Sliders
  BANNERS: {
    BASE: '/api/v1/banners',
    BY_ID: (id: string) => `/api/v1/banners/${encodeURIComponent(id)}`,
    TOGGLE: (id: string) => `/api/v1/banners/${encodeURIComponent(id)}/toggle`,
  },

  // Shipping Rules
  SHIPPING: {
    BASE: '/api/v1/shipping-rules',
    CALCULATE: '/api/v1/shipping-rules/calculate',
    BY_ID: (id: string) => `/api/v1/shipping-rules/${encodeURIComponent(id)}`,
  },

  // Media & Cloudinary Uploads
  UPLOAD: {
    IMAGE: '/api/v1/upload/image',
  },

  // System & Database Diagnostics
  SYSTEM: {
    HEALTH: '/api/v1/health',
    DB_STATUS: '/api/v1/db-status',
    SEED: '/api/v1/seed',
    MIGRATE: '/api/v1/migrate',
    PURGE_MOCK: '/api/v1/purge-mock-data',
  },
} as const;
