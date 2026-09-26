import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import { connectDB } from '../config/db.js';
import { CategoryModel } from '../models/Category.js';
import { ProductModel } from '../models/Product.js';
import { ReviewModel } from '../models/Review.js';
import { CouponModel } from '../models/Coupon.js';
import { OrderModel } from '../models/Order.js';

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
    const isConnected = await connectDB();

    const totalProducts = await ProductModel.countDocuments();
    const totalCategories = await CategoryModel.countDocuments();

    res.json({
      success: true,
      message: isConnected ? 'MongoDB Atlas is connected and active!' : 'MongoDB connection inactive',
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

/**
 * PURGE LEGACY MOCK DATA FROM DATABASE
 * Route: POST /api/purge-mock-data
 */
export const purgeMockData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const mockProductSlugs = [
      'royal-golden-porcelain-dinner-set',
      'imperial-24k-gold-bone-china-tea-set',
      'minimalist-nordic-matte-black-mugs',
      'sapphire-glaze-handcrafted-salad-bowls',
      'vintage-victorian-gold-rimmed-chargers',
      'crystal-amber-cut-glass-tumbler-set',
      'majestic-peacock-bone-china-serving-platter',
      'monarch-matte-gold-cutlery-set',
    ];

    const deletedProducts = await ProductModel.deleteMany({
      $or: [
        { slug: { $in: mockProductSlugs } },
        { name: { $in: [
          'Royal Golden Porcelain Dinner Set',
          'Imperial 24K Gold Bone China Tea Set',
          'Minimalist Nordic Matte Black Mugs',
          'Sapphire Glaze Handcrafted Salad Bowls',
          'Vintage Victorian Gold-Rimmed Chargers',
          'Crystal Amber Cut Glass Tumbler Set',
          'Majestic Peacock Bone China Serving Platter',
          'Monarch Matte Gold Cutlery Set',
        ] } }
      ]
    });

    const deletedOrders = await OrderModel.deleteMany({
      $or: [
        { 'customer.email': 'customer@mshometrends.com' },
        { 'customer.notes': 'Default seeded order' },
        { 'customer.notes': 'Seeded order' },
      ]
    });

    res.json({
      success: true,
      message: 'Mock data purged from database successfully.',
      deleted: {
        products: deletedProducts.deletedCount,
        orders: deletedOrders.deletedCount,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
