import { Router } from 'express';
import {
  getAllCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';

export const couponRouter = Router();

// Coupon Collection & Validation Routes
couponRouter.get('/', getAllCoupons);
couponRouter.post('/', createCoupon);
couponRouter.post('/validate', validateCoupon);

// Coupon Document Routes
couponRouter.delete('/:id', deleteCoupon);
