import { Router } from 'express';
import {
  getAllOrders,
  createOrder,
  getOrderById,
  getOrderInvoice,
  uploadPaymentScreenshot,
  trackOrder,
} from '../controllers/order.controller.js';
import { uploadMiddleware } from '../middleware/upload.js';

export const orderRouter = Router();

// Order Collection Routes
orderRouter.get('/', getAllOrders);
orderRouter.post('/', createOrder);

// Tracking Route
orderRouter.get('/track/:query', trackOrder);

// Order Document Routes
orderRouter.get('/:orderId', getOrderById);
orderRouter.get('/:orderId/invoice', getOrderInvoice);
orderRouter.post('/:orderId/payment-screenshot', uploadMiddleware.single('screenshot'), uploadPaymentScreenshot);
