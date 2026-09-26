import { Router } from 'express';
import {
  getAllCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const couponRouter = Router();

// Public Routes (For store checkout coupon application)
couponRouter.get('/', getAllCoupons);
couponRouter.post('/validate', validateCoupon);

// Protected Administrative Routes (Admin only)
couponRouter.post('/', requireAdminAuth, createCoupon);
couponRouter.delete('/:id', requireAdminAuth, deleteCoupon);
