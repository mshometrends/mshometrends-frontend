import mongoose from 'mongoose';

/**
 * MongoDB Mongoose Database Connection
 * MS Home Trends Crockery Store
 * All connection details are strictly loaded from environment variables (process.env.MONGODB_URI)
 */

export const connectDB = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongoUri = process.env.MONGODB_URI?.trim();
    if (!mongoUri) {
      console.warn('[MongoDB Notice] MONGODB_URI environment variable is not configured. Real-time DB sync will be inactive until configured.');
      return false;
    }

    console.log('[MongoDB] Connecting to MongoDB database...');

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'mshometrends',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.error('[MongoDB Connection Error]', error?.message || error);
    return false;
  }
};


