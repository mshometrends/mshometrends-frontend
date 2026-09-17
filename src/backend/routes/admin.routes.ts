import { Router, Request, Response } from 'express';
import {
  getAdminOrders,
  getAdminOrderById,
  confirmOrderPayment,
  rejectOrderPayment,
  updateOrderStatus,
} from '../controllers/adminOrder.controller.js';
import {
  getAllUsers,
  deleteUser,
  seedAdminUser,
  loginUser,
} from '../controllers/user.controller.js';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const adminRouter = Router();

/**
 * POST /api/v1/admin/login
 * Public Admin Login to authenticate and retrieve session token
 */
adminRouter.post('/login', loginUser);

/**
 * GET /api/v1/admin
 * Root admin overview & quick statistics (Protected)
 */
adminRouter.get('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const [allOrders, productCount, userCount] = await Promise.all([
      OrderModel.find().lean().catch(() => []),
      ProductModel.countDocuments().catch(() => 0),
      UserModel.countDocuments().catch(() => 0),
    ]);

    const totalRevenue = allOrders
      .filter((o: any) => o.payment?.status === 'Paid')
      .reduce((sum: number, o: any) => sum + (Number(o.pricing?.total) || 0), 0);

    const pendingOrders = allOrders.filter(
      (o: any) => o.orderStatus === 'Pending Payment' || o.payment?.status === 'Pending'
    ).length;

    res.json({
      success: true,
      message: 'MS Home Trends Admin API v1 is active',
      endpoint: '/api/v1/admin',
      data: {
        totalOrders: allOrders.length,
        pendingOrders,
        totalProducts: productCount,
        totalUsers: userCount,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Error fetching admin overview',
    });
  }
});

/**
 * GET /api/v1/admin/stats
 * Detailed admin stats (Protected)
 */
adminRouter.get('/stats', requireAdminAuth, async (req: Request, res: Response) => {
  return getAdminOrders(req, res);
});

// Admin Orders (Protected)
adminRouter.get('/orders', requireAdminAuth, getAdminOrders);
adminRouter.get('/orders/:orderId', requireAdminAuth, getAdminOrderById);
adminRouter.patch('/orders/:orderId/confirm-payment', requireAdminAuth, confirmOrderPayment);
adminRouter.patch('/orders/:orderId/reject-payment', requireAdminAuth, rejectOrderPayment);
adminRouter.patch('/orders/:orderId/status', requireAdminAuth, updateOrderStatus);
adminRouter.put('/orders/:orderId/status', requireAdminAuth, updateOrderStatus);

// Admin Users (Protected - Requires Superadmin Privileges)
adminRouter.get('/users', requireAdminAuth, getAllUsers);
adminRouter.delete('/users/:id', requireAdminAuth, deleteUser);
adminRouter.post('/seed-admin', seedAdminUser);
adminRouter.get('/seed-admin', seedAdminUser);
