import { Request, Response } from 'express';
import { OrderModel } from '../models/Order.js';

/**
 * GET all admin orders with filters, search, and aggregated statistics
 * Route: GET /api/admin/orders
 */
export const getAdminOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, paymentStatus, search } = req.query;

    const queryFilter: any = {};

    if (status && status !== 'All') {
      queryFilter.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      queryFilter['payment.status'] = paymentStatus;
    }

    if (search) {
      const cleanSearch = String(search).trim();
      queryFilter.$or = [
        { orderId: { $regex: cleanSearch, $options: 'i' } },
        { invoiceNumber: { $regex: cleanSearch, $options: 'i' } },
        { 'customer.fullName': { $regex: cleanSearch, $options: 'i' } },
        { 'customer.phone': { $regex: cleanSearch, $options: 'i' } },
        { 'customer.whatsappNumber': { $regex: cleanSearch, $options: 'i' } },
        { 'customer.email': { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    const orders = await OrderModel.find(queryFilter).sort({ createdAt: -1 });

    // Calculate aggregated statistics
    const allOrders = await OrderModel.find();
    const stats = {
      totalOrders: allOrders.length,
      pendingPayments: allOrders.filter(
        (o) => o.payment?.status === 'Pending' || o.orderStatus === 'Pending Payment'
      ).length,
      screenshotsReceived: allOrders.filter(
        (o) => o.payment?.status === 'Screenshot Received'
      ).length,
      paymentsUnderReview: allOrders.filter(
        (o) => o.payment?.status === 'Under Review' || o.orderStatus === 'Payment Under Review'
      ).length,
      paidOrders: allOrders.filter((o) => o.payment?.status === 'Paid').length,
      confirmedOrders: allOrders.filter((o) => o.orderStatus === 'Confirmed').length,
      shippedOrders: allOrders.filter((o) => o.orderStatus === 'Shipped').length,
      deliveredOrders: allOrders.filter((o) => o.orderStatus === 'Delivered').length,
      cancelledOrders: allOrders.filter((o) => o.orderStatus === 'Cancelled').length,
    };

    res.json({
      success: true,
      stats,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error('[Admin Orders Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin orders' });
  }
};

/**
 * GET admin single order by ID / OrderId
 * Route: GET /api/admin/orders/:orderId
 */
export const getAdminOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({
      $or: [
        { orderId },
        { invoiceNumber: orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
      ].filter(Boolean),
    } as any);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('[Admin Orders Controller - GetById Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CONFIRM verified payment
 * Route: PATCH /api/admin/orders/:orderId/confirm-payment
 */
export const confirmOrderPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { verifiedBy, adminNote } = req.body;

    const order = await OrderModel.findOne({
      $or: [
        { orderId },
        { invoiceNumber: orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
      ].filter(Boolean),
    } as any);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    order.payment.status = 'Paid';
    order.payment.verifiedAt = new Date();
    order.payment.verifiedBy = verifiedBy || 'Admin';
    order.orderStatus = 'Confirmed';
    if (adminNote) {
      order.adminNote = adminNote;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully. Order is now marked as Confirmed.',
      data: order,
    });
  } catch (error: any) {
    console.error('[Admin Orders Controller - Confirm Payment Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to confirm payment' });
  }
};

/**
 * REJECT payment proof
 * Route: PATCH /api/admin/orders/:orderId/reject-payment
 */
export const rejectOrderPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { rejectionReason, adminNote } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      res.status(400).json({ success: false, message: 'A rejection reason is required.' });
      return;
    }

    const order = await OrderModel.findOne({
      $or: [
        { orderId },
        { invoiceNumber: orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
      ].filter(Boolean),
    } as any);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    order.payment.status = 'Rejected';
    order.payment.rejectionReason = rejectionReason.trim();
    order.orderStatus = 'Pending Payment';
    if (adminNote) {
      order.adminNote = adminNote;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment proof rejected. Customer must provide valid payment proof.',
      data: order,
    });
  } catch (error: any) {
    console.error('[Admin Orders Controller - Reject Payment Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to reject payment' });
  }
};

/**
 * UPDATE order fulfillment status
 * Route: PATCH /api/admin/orders/:orderId/status
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { orderStatus, adminNote } = req.body;

    const validStatuses = [
      'Pending Payment',
      'Payment Under Review',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(orderStatus)) {
      res.status(400).json({ success: false, message: 'Invalid order status provided.' });
      return;
    }

    const order = await OrderModel.findOne({
      $or: [
        { orderId },
        { invoiceNumber: orderId },
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
      ].filter(Boolean),
    } as any);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    order.orderStatus = orderStatus;
    if (adminNote) {
      order.adminNote = adminNote;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  } catch (error: any) {
    console.error('[Admin Orders Controller - Update Status Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
