import { Router } from 'express';
import {
  getAllShippingRules,
  calculateShippingFee,
  createShippingRule,
  updateShippingRule,
  deleteShippingRule,
} from '../controllers/shipping.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const shippingRouter = Router();

// Public Routes (For store checkout shipping fee calculation)
shippingRouter.get('/', getAllShippingRules);
shippingRouter.post('/calculate', calculateShippingFee);

// Protected Administrative Routes (Admin only)
shippingRouter.post('/', requireAdminAuth, createShippingRule);
shippingRouter.put('/:id', requireAdminAuth, updateShippingRule);
shippingRouter.delete('/:id', requireAdminAuth, deleteShippingRule);
