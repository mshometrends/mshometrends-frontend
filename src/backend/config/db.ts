import mongoose from 'mongoose';

/**
 * MongoDB Mongoose Database Connection
 * MS Home Trends Crockery Store
 */

const DEFAULT_MONGO_URI = 'mongodb+srv://MS:Fahad@mshometrends.y5lbkot.mongodb.net/mshometrends?retryWrites=true&w=majority&appName=MSHomeTrends';

export const connectDB = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
    console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'mshometrends',
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.error('[MongoDB Connection Error]', error?.message || error);
    return false;
  }
};

