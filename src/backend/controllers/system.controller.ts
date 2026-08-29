import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import { connectDB } from '../config/db.js';
import { CategoryModel } from '../models/Category.js';
import { ProductModel } from '../models/Product.js';
import { ReviewModel } from '../models/Review.js';
import { CouponModel } from '../models/Coupon.js';
import { OrderModel } from '../models/Order.js';
import {
  mockCategories,
  mockProducts,
  mockReviews,
  mockCoupons,
  mockOrders,
} from '../../data/mockData.js';

/**
 * DB & CLOUDINARY LIVE HEALTH CHECK
 * Route: GET /api/db-status
 */
export const getDbStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const mongoHost = mongoose.connection.host || 'Disconnected';
    const dbName = mongoose.connection.name || 'mshometrends';

    let productCount = 0;
    let categoryCount = 0;
    let orderCount = 0;

    if (isMongoConnected) {
      productCount = await ProductModel.countDocuments();
      categoryCount = await CategoryModel.countDocuments();
      orderCount = await OrderModel.countDocuments();
    }

    res.json({
      success: true,
      mongo: {
        connected: isMongoConnected,
        readyState: mongoose.connection.readyState,
        host: mongoHost,
        database: dbName,
        counts: {
          products: productCount,
          categories: categoryCount,
          orders: orderCount,
        },
      },
      cloudinary: {
        configured: Boolean(cloudinary.config().cloud_name && cloudinary.config().api_key),
        cloudName: cloudinary.config().cloud_name,
        apiKeyPrefix: cloudinary.config().api_key ? `${String(cloudinary.config().api_key).substring(0, 4)}***` : 'None',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE CLOUDINARY CONFIGURATION AT RUNTIME
 * Route: POST /api/cloudinary-config
 */
export const updateCloudinaryConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cloud_name, api_key, api_secret, folder } = req.body;
    if (cloud_name) process.env.CLOUDINARY_CLOUD_NAME = cloud_name.trim();
    if (api_key) process.env.CLOUDINARY_API_KEY = api_key.trim();
    if (api_secret) process.env.CLOUDINARY_API_SECRET = api_secret.trim();
    if (folder) process.env.CLOUDINARY_FOLDER = folder.trim();

    const configured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);

    res.json({
      success: true,
      message: 'Cloudinary configuration updated in server environment',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: process.env.CLOUDINARY_FOLDER || 'mshometrends',
      configured,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * MONGODB ATLAS SEED & SAFE MIGRATION
 * Route: POST /api/migrate, POST /api/seed
 */
export const handleDatabaseMigration = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('[MongoDB Atlas Sync] Ensuring MongoDB connection...');
    await connectDB();

    console.log('[MongoDB Atlas Sync] Safely syncing dataset with MongoDB Atlas...');

    // 1. Sync Categories without deleting existing user categories
    for (const c of mockCategories) {
      const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = await CategoryModel.findOne({ $or: [{ slug }, { name: c.name }] });
      if (!exists) {
        await CategoryModel.create({
          name: c.name,
          slug,
          image: c.image,
          description: c.description || '',
          itemCount: c.itemCount || 0,
        });
      }
    }

    // 2. Sync Products without deleting custom products or uploaded images
    for (const p of mockProducts) {
      const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = await ProductModel.findOne({ $or: [{ slug }, { name: p.name }] });
      if (!exists) {
        await ProductModel.create({
          name: p.name,
          slug,
          category: p.category,
          price: p.price,
          oldPrice: p.oldPrice,
          stockQuantity: p.stockQuantity ?? 15,
          material: p.material || 'Bone China',
          color: p.color || 'White & Gold',
          description: p.description,
          images: p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop'],
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 1,
          featured: p.isFeatured ?? true,
          isFeatured: p.isFeatured ?? true,
          isBestseller: p.isBestSeller ?? false,
          isBestSeller: p.isBestSeller ?? false,
          isNewArrival: p.isNewArrival ?? false,
          isLimitedEdition: false,
          piecesCount: 24,
        });
      }
    }

    // 3. Sync Reviews safely
    const existingReviewsCount = await ReviewModel.countDocuments();
    if (existingReviewsCount === 0) {
      await ReviewModel.insertMany(
        mockReviews.map((r) => ({
          userName: r.userName,
          userAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: r.rating,
          comment: r.comment,
          productId: r.productId || 'prod-1',
          productName: 'Royal Golden Porcelain Dinner Set',
          verifiedPurchase: true,
          approved: true,
        }))
      );
    }

    // 4. Sync Coupons safely
    for (const c of mockCoupons) {
      const exists = await (CouponModel as any).findOne({ code: c.code });
      if (!exists) {
        await (CouponModel as any).create({
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minSpend: c.minSpend || 0,
          active: c.active ?? true,
          expiryDate: c.expiryDate || '2028-12-31',
          productId: c.productId || '',
          productName: c.productName || '',
        });
      }
    }

    // 5. Sync Orders safely
    const existingOrdersCount = await OrderModel.countDocuments();
    if (existingOrdersCount === 0) {
      await (OrderModel as any).insertMany(
        mockOrders.map((o, idx) => {
          const orderId = o.orderId || o.id || `MS-${new Date().getFullYear()}-${1001 + idx}`;
          const invoiceNumber = o.invoiceNumber || `INV-${new Date().getFullYear()}-${1001 + idx}`;
          const cust = o.customer || ({} as any);
          const subtotal = o.pricing?.subtotal ?? (o as any).subtotalAmount ?? 350;
          const delivery = o.pricing?.deliveryCharges ?? (o as any).shippingCost ?? 0;
          const discount = o.pricing?.discount ?? (o as any).discountAmount ?? 0;
          const total = o.pricing?.total ?? (o as any).totalAmount ?? subtotal + delivery - discount;

          return {
            orderId,
            invoiceNumber,
            customer: {
              fullName: cust.fullName || (o as any).customerName || 'Valued Customer',
              phone: cust.phone || '0300-1234567',
              whatsappNumber: cust.whatsappNumber || cust.phone || '0300-1234567',
              email: cust.email || (o as any).customerEmail || 'customer@mshometrends.com',
              address:
                cust.address ||
                (typeof (o as any).shippingAddress === 'string'
                  ? (o as any).shippingAddress
                  : `${(o as any).shippingAddress?.street || 'Clifton Block 5'}, ${(o as any).shippingAddress?.city || 'Karachi'}`) ||
                '742 Kensington High St, Clifton, Karachi',
              city: cust.city || (typeof (o as any).shippingAddress === 'object' ? (o as any).shippingAddress?.city : '') || 'Karachi',
              postalCode: cust.postalCode || '75600',
              notes: cust.notes || 'Seeded order',
            },
            items: (o.items || []).map((i: any, itemIdx: number) => ({
              productId: i.productId || i.id || `prod-${101 + itemIdx}`,
              name: i.name || i.productName || 'Empress Fine Bone China Dinner Set',
              image: i.image || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800',
              quantity: i.quantity || 1,
              price: i.price || 150,
              subtotal: (i.price || 150) * (i.quantity || 1),
            })),
            pricing: {
              subtotal,
              deliveryCharges: delivery,
              discount,
              total,
            },
            payment: {
              method: o.payment?.method || (o as any).paymentMethod || 'Bank Transfer',
              status: o.payment?.status || (idx === 0 ? 'Paid' : idx === 1 ? 'Screenshot Received' : 'Pending'),
              screenshotUrl:
                o.payment?.screenshotUrl ||
                (idx <= 1 ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800' : ''),
              transactionReference: o.payment?.transactionReference || '',
            },
            orderStatus: o.orderStatus || (idx === 0 ? 'Delivered' : idx === 1 ? 'Payment Under Review' : 'Pending Payment'),
            invoiceUrl: o.invoiceUrl || `/invoice/${orderId}`,
          };
        })
      );
    }

    const totalProducts = await ProductModel.countDocuments();
    const totalCategories = await CategoryModel.countDocuments();

    res.json({
      success: true,
      message: 'MongoDB Atlas is fully synchronized (all custom products & images preserved)!',
      counts: {
        categories: totalCategories,
        products: totalProducts,
      },
    });
  } catch (error: any) {
    console.error('[Migration Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
