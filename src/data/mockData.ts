import { Product, Category, Banner, Review, Order, Coupon, Offer, AdminStats } from '../types';

/**
 * Mock data has been completely cleared.
 * All products, categories, banners, reviews, coupons, and orders
 * are loaded directly from the database (MongoDB / Admin API).
 */

export const mockCategories: Category[] = [];
export const mockBanners: Banner[] = [];
export const mockProducts: Product[] = [];
export const mockReviews: Review[] = [];
export const mockCoupons: Coupon[] = [];
export const mockOrders: Order[] = [];
export const mockOffers: Offer[] = [];

export const mockAdminStats: AdminStats = {
  totalRevenue: 0,
  revenueGrowth: 0,
  totalOrders: 0,
  ordersGrowth: 0,
  totalProducts: 0,
  totalCategories: 0,
  lowStockCount: 0,
  recentOrders: [],
  salesData: [],
};

export const instagramPosts: any[] = [];
