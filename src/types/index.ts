export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  material: 'Bone China' | 'Porcelain' | 'Ceramic' | 'Crystal Glass' | 'Stoneware' | 'Stainless Steel';
  color: string;
  isFeatured?: boolean;
  featured?: boolean;
  features?: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  dimensions?: string;
  careInstructions?: string;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  description?: string;
  isFeatured?: boolean;
}

export interface Banner {
  id: string;
  _id?: string;
  title: string;
  subheading?: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaLink?: string;
  active: boolean;
  order: number;
}

export interface Review {
  id: string;
  _id?: string;
  productId: string;
  productName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
  verifiedPurchase: boolean;
  approved?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderPricing {
  subtotal: number;
  deliveryCharges: number;
  discount: number;
  total: number;
}

export type PaymentStatus = 'Pending' | 'Screenshot Received' | 'Under Review' | 'Paid' | 'Rejected';

export interface OrderPayment {
  method: string;
  status: PaymentStatus;
  screenshotUrl?: string;
  transactionReference?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Under Review'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  _id?: string;
  orderId: string;
  invoiceNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  pricing: OrderPricing;
  payment: OrderPayment;
  orderStatus: OrderStatus;
  invoiceUrl: string;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;

  // Backward compatibility fields
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  totalAmount?: number;
  subtotalAmount?: number;
  shippingCost?: number;
  shippingFee?: number;
  discountAmount?: number;
  paymentMethod?: string;
  status?: string;
  shippingAddress?: any;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  active: boolean;
  expiryDate: string;
  productId?: string;
  productName?: string;
}

export interface Offer {
  id: string;
  _id?: string;
  badge: string;
  badgeType?: 'gold' | 'emerald' | 'amber' | 'rose';
  title: string;
  description: string;
  code?: string;
  discountText?: string;
  targetPage?: string;
  targetParam?: string;
  active: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface AdminStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  recentOrders: Order[];
  salesData: { month: string; revenue: number; orders: number }[];
}

export type PageView = 
  | 'home'
  | 'products'
  | 'category'
  | 'product-detail'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping'
  | 'how-to-pay'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'invoice'
  | 'track-order'
  | 'wishlist'
  | 'profile'
  | 'admin'
  | '404';

export interface ShippingRule {
  id?: string;
  _id?: string;
  country: string;
  city: string;
  zipCode: string;
  categoryId?: string;
  categoryName?: string;
  productId?: string;
  productName?: string;
  shippingFee: number;
  deliveryTime: string;
  isActive: boolean;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'banners'
  | 'offers'
  | 'orders'
  | 'shipping'
  | 'customers'
  | 'reviews'
  | 'coupons'
  | 'settings'
  | 'profile';
