import { Router } from 'express';
import {
  getAllOrders,
  createOrder,
  getOrderById,
  getOrderInvoice,
  uploadPaymentScreenshot,
  trackOrder,
} from '../controllers/order.controller.js';
import { updateOrderStatus } from '../controllers/adminOrder.controller.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const orderRouter = Router();

// Order Collection Routes
// Dumping all customer orders requires admin privileges
orderRouter.get('/', requireAdminAuth, getAllOrders);
// Placing a new order is public for customer checkout
orderRouter.post('/', createOrder);

// Tracking Route (Public for customer tracking with their order ID / phone)
orderRouter.get('/track/:query', trackOrder);

// Order Document Routes
orderRouter.get('/:orderId', getOrderById);
orderRouter.get('/:orderId/invoice', getOrderInvoice);
orderRouter.post('/:orderId/payment-screenshot', uploadMiddleware.single('screenshot'), uploadPaymentScreenshot);

// Order Status Updates (Protected - Admin Only)
orderRouter.put('/:orderId/status', requireAdminAuth, updateOrderStatus);
orderRouter.patch('/:orderId/status', requireAdminAuth, updateOrderStatus);
