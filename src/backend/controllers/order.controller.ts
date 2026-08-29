import { Request, Response } from 'express';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { mockOrders } from '../../data/mockData.js';

// In-memory orders cache for instant retrieval & zero 404s
const memoryOrdersCache = new Map<string, any>();

// Helper to generate unique order ID & invoice number
export const generateOrderIdentifiers = () => {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(1000 + Math.random() * 9000);
  const orderId = `MS-${new Date().getFullYear()}-${timestamp}${random}`;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${timestamp}${random}`;
  return { orderId, invoiceNumber };
};

/**
 * GET all orders
 * Route: GET /api/orders
 */
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    let orders = await OrderModel.find().sort({ createdAt: -1 });

    if (orders.length === 0) {
      console.log('[MongoDB] Seeding initial orders with WhatsApp payment schema...');
      const orderDocs = mockOrders.map((o, idx) => {
        const { orderId, invoiceNumber } = generateOrderIdentifiers();
        const total = o.totalAmount || 150;
        const subtotal = o.subtotalAmount || total - 10;

        return {
          orderId: o.orderNumber || orderId,
          invoiceNumber: `INV-${orderId}`,
          customer: {
            fullName: o.customerName || 'Valued Customer',
            phone: '0300-1234567',
            whatsappNumber: '0300-1234567',
            email: o.customerEmail || 'customer@mshometrends.com',
            address: typeof o.shippingAddress === 'string'
              ? o.shippingAddress
              : `${o.shippingAddress?.street || 'Clifton Block 5'}, ${o.shippingAddress?.city || 'Karachi'}`,
            city: typeof o.shippingAddress === 'object' ? o.shippingAddress?.city || 'Karachi' : 'Karachi',
            postalCode: '75600',
            notes: 'Default seeded order',
          },
          items: (o.items || []).map((i: any) => ({
            productId: i.productId || 'p_default',
            name: i.name || i.productName || 'Royal Crockery Set',
            image: i.image || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800',
            quantity: i.quantity || 1,
            price: i.price || 100,
            subtotal: (i.price || 100) * (i.quantity || 1),
          })),
          pricing: {
            subtotal,
            deliveryCharges: 10,
            discount: 0,
            total,
          },
          payment: {
            method: o.paymentMethod || 'Bank Transfer',
            status: idx === 0 ? 'Screenshot Received' : 'Pending',
            screenshotUrl: idx === 0 ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800' : '',
            transactionReference: '',
          },
          orderStatus: idx === 0 ? 'Payment Under Review' : 'Pending Payment',
          invoiceUrl: `/invoice/${o.orderNumber || orderId}`,
        };
      });

      orders = await (OrderModel as any).insertMany(orderDocs);
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error('[Orders Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching orders' });
  }
};

/**
 * CREATE customer order
 * Route: POST /api/orders
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer, items, paymentMethod, notes, deliveryCharges = 0, discount = 0 } = req.body;

    if (
      !customer ||
      !customer.fullName ||
      !customer.phone ||
      !customer.whatsappNumber ||
      !customer.address ||
      !customer.city
    ) {
      res.status(400).json({
        success: false,
        message: 'fullName, phone, whatsappNumber, address, and city are required customer details.',
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one item is required to place an order.',
      });
      return;
    }

    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let unitPrice = Number(item.price) || 0;
      let name = item.name || item.productName || 'MS Product';
      let image = item.image || item.images?.[0] || '';

      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        const dbProduct = await ProductModel.findById(item.productId);
        if (dbProduct) {
          unitPrice = dbProduct.price;
          name = dbProduct.name;
          image = dbProduct.images?.[0] || image;
        }
      }

      const itemSubtotal = unitPrice * quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        productId: String(item.productId || 'p_' + Date.now()),
        name,
        image,
        quantity,
        price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const parsedDelivery = Math.max(0, Number(deliveryCharges) || 0);
    const parsedDiscount = Math.max(0, Number(discount) || 0);
    const calculatedTotal = Math.max(0, calculatedSubtotal + parsedDelivery - parsedDiscount);

    const { orderId, invoiceNumber } = generateOrderIdentifiers();
    const invoiceUrl = `/invoice/${orderId}`;

    const newOrder = await OrderModel.create({
      orderId,
      invoiceNumber,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        whatsappNumber: customer.whatsappNumber.trim(),
        email: customer.email ? customer.email.trim() : '',
        address: customer.address.trim(),
        city: customer.city.trim(),
        postalCode: customer.postalCode ? customer.postalCode.trim() : '',
        notes: notes || customer.notes || '',
      },
      items: verifiedItems,
      pricing: {
        subtotal: calculatedSubtotal,
        deliveryCharges: parsedDelivery,
        discount: parsedDiscount,
        total: calculatedTotal,
      },
      payment: {
        method: paymentMethod || 'Easypaisa',
        status: 'Pending',
        screenshotUrl: '',
        transactionReference: '',
      },
      orderStatus: 'Pending Payment',
      invoiceUrl,
    });

    // Save in memory cache
    memoryOrdersCache.set(orderId, newOrder);
    memoryOrdersCache.set(invoiceNumber, newOrder);
    if (newOrder._id) {
      memoryOrdersCache.set(String(newOrder._id), newOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully. Please share payment screenshot on WhatsApp or upload on website.',
      data: newOrder,
    });
  } catch (error: any) {
    console.error('[Orders Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to place order.' });
  }
};

/**
 * GET order details by ID / OrderId / InvoiceNumber
 * Route: GET /api/orders/:orderId
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    // Check memory cache first
    if (memoryOrdersCache.has(orderId)) {
      res.json({
        success: true,
        data: memoryOrdersCache.get(orderId),
      });
      return;
    }

    let order = null;
    try {
      order = await OrderModel.findOne({
        $or: [
          { orderId },
          { invoiceNumber: orderId },
          { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
        ].filter(Boolean),
      } as any);
    } catch (e) {
      console.warn('[Mongo Query Warning]', e);
    }

    if (!order) {
      // Check if any mock orders match
      const matchedMock = mockOrders.find((o) => o.orderNumber === orderId || o.id === orderId);
      if (matchedMock) {
        order = matchedMock;
      }
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('[Orders Controller - GetById Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET order invoice details
 * Route: GET /api/orders/:orderId/invoice
 */
export const getOrderInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    let order = memoryOrdersCache.get(orderId) || null;

    if (!order) {
      try {
        order = await OrderModel.findOne({
          $or: [
            { orderId },
            { invoiceNumber: orderId },
            { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
          ].filter(Boolean),
        } as any);
      } catch (e) {
        console.warn('[Mongo Query Warning]', e);
      }
    }

    if (!order) {
      const matchedMock = mockOrders.find((o) => o.orderNumber === orderId || o.id === orderId);
      if (matchedMock) {
        order = matchedMock;
      }
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        company: {
          name: 'MS Home Trends',
          tagline: 'Luxury Household & Fine Crockery',
          website: 'https://mshometrends.com',
          phone: process.env.VITE_STORE_WHATSAPP_NUMBER || '+92 324 2303895',
        },
        order,
      },
    });
  } catch (error: any) {
    console.error('[Orders Controller - Invoice Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPLOAD and attach payment screenshot
 * Route: POST /api/orders/:orderId/payment-screenshot
 */
export const uploadPaymentScreenshot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { transactionReference } = req.body;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No screenshot file provided. Please attach a valid image file.',
      });
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
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'ms-home-trends/payment-proofs'
    );

    order.payment.screenshotUrl = uploadResult.url;
    order.payment.status = 'Screenshot Received';
    order.orderStatus = 'Payment Under Review';
    if (transactionReference) {
      order.payment.transactionReference = String(transactionReference).trim();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment screenshot submitted successfully! Admin will review and confirm your order shortly.',
      data: order,
      image: uploadResult,
    });
  } catch (error: any) {
    console.error('[Orders Controller - Screenshot Error]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload payment screenshot.',
    });
  }
};

/**
 * SEARCH / TRACK orders by query (Phone, WhatsApp, Email, OrderId)
 * Route: GET /api/orders/track/:query
 */
export const trackOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.params;
    const cleanQuery = String(query).trim();

    const isMongoId = cleanQuery.match(/^[0-9a-fA-F]{24}$/);
    const searchConditions: any[] = [
      { orderId: { $regex: cleanQuery, $options: 'i' } },
      { invoiceNumber: { $regex: cleanQuery, $options: 'i' } },
      { 'customer.phone': { $regex: cleanQuery, $options: 'i' } },
      { 'customer.whatsappNumber': { $regex: cleanQuery, $options: 'i' } },
      { 'customer.email': { $regex: cleanQuery, $options: 'i' } },
      { 'customer.fullName': { $regex: cleanQuery, $options: 'i' } },
    ];

    if (isMongoId) {
      searchConditions.push({ _id: cleanQuery });
    }

    const orders = await OrderModel.find({ $or: searchConditions } as any).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error('[Orders Controller - Track Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
