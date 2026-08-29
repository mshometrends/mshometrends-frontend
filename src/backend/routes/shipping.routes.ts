import { Router } from 'express';
import {
  getAllShippingRules,
  calculateShippingFee,
  createShippingRule,
  updateShippingRule,
  deleteShippingRule,
} from '../controllers/shipping.controller.js';

export const shippingRouter = Router();

// Shipping Rules Collection Routes
shippingRouter.get('/', getAllShippingRules);
shippingRouter.post('/', createShippingRule);
shippingRouter.post('/calculate', calculateShippingFee);

// Shipping Rule Document Routes
shippingRouter.put('/:id', updateShippingRule);
shippingRouter.delete('/:id', deleteShippingRule);
