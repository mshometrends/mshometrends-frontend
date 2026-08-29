/**
 * Data Model Schemas (MongoDB / Mongoose Placeholders)
 * MS Home Trends Crockery Store
 */

export { CategoryModel } from './Category.js';
export { ProductModel } from './Product.js';
export { ReviewModel } from './Review.js';
export { CouponModel } from './Coupon.js';
export { OrderModel } from './Order.js';
export { ShippingRuleModel } from './ShippingRule.js';

export interface IUserModel {

  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface IAdminModel {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'manager';
  permissions: string[];
}

export interface IProductModel {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  material: string;
  sku: string;
}

export interface ICategoryModel {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface IBannerModel {
  id: string;
  title: string;
  subheading: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
}

export interface IOrderModel {
  id: string;
  orderNumber: string;
  customerEmail: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

export interface ICouponModel {
  id: string;
  code: string;
  discountValue: number;
  active: boolean;
}

export interface IReviewModel {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface ISettingsModel {
  storeName: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
}
