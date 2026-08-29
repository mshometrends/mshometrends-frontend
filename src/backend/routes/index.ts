import { Router } from 'express';
import { categoryRouter } from './category.routes.js';
import { productRouter } from './product.routes.js';
import { reviewRouter } from './review.routes.js';
import { couponRouter } from './coupon.routes.js';
import { orderRouter } from './order.routes.js';
import { shippingRouter } from './shipping.routes.js';
import { bannerRouter } from './banner.routes.js';
import { offerRouter } from './offer.routes.js';
import { userRouter } from './user.routes.js';
import { uploadRouter } from './upload.routes.js';
import { healthRouter } from './health.routes.js';
import { adminOrderRouter } from './adminOrder.routes.js';
import {
  getDbStatus,
  updateCloudinaryConfig,
  handleDatabaseMigration,
} from '../controllers/system.controller.js';

export const apiRouter = Router();

// ==========================================
// SYSTEM & HEALTH CHECK ROUTES
// ==========================================
apiRouter.use('/', healthRouter);
apiRouter.get('/db-status', getDbStatus);
apiRouter.post('/cloudinary-config', updateCloudinaryConfig);
apiRouter.post('/migrate', handleDatabaseMigration);
apiRouter.post('/seed', handleDatabaseMigration);

// ==========================================
// RESOURCE ROUTE MOUNTING
// ==========================================
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/admin/orders', adminOrderRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/coupons', couponRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/shipping-rules', shippingRouter);
apiRouter.use('/banners', bannerRouter);
apiRouter.use('/offers', offerRouter);
apiRouter.use('/users', userRouter);
