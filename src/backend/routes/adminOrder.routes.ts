import { Router } from 'express';
import {
  getAdminOrders,
  getAdminOrderById,
  confirmOrderPayment,
  rejectOrderPayment,
  updateOrderStatus,
} from '../controllers/adminOrder.controller.js';

export const adminOrderRouter = Router();

// Admin Orders Collection & Stats
adminOrderRouter.get('/', getAdminOrders);

// Admin Order Document Details
adminOrderRouter.get('/:orderId', getAdminOrderById);

// Payment Review Actions
adminOrderRouter.patch('/:orderId/confirm-payment', confirmOrderPayment);
adminOrderRouter.patch('/:orderId/reject-payment', rejectOrderPayment);

// Order Fulfillment Status Update
adminOrderRouter.patch('/:orderId/status', updateOrderStatus);
