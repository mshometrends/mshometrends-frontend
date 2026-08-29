import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderCustomer {
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrderPricing {
  subtotal: number;
  deliveryCharges: number;
  discount: number;
  total: number;
}

export interface IOrderPayment {
  method: string;
  status: 'Pending' | 'Screenshot Received' | 'Under Review' | 'Paid' | 'Rejected';
  screenshotUrl?: string;
  transactionReference?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface IOrderDocument extends Document {
  orderId: string;
  invoiceNumber: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  pricing: IOrderPricing;
  payment: IOrderPayment;
  orderStatus:
    | 'Pending Payment'
    | 'Payment Under Review'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';
  invoiceUrl: string;
  adminNote?: string;
  // Legacy fields
  total?: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `MS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    },
    customer: {
      fullName: { type: String, required: true, default: 'Valued Customer' },
      phone: { type: String, required: true, default: '0300-1234567' },
      whatsappNumber: { type: String, required: true, default: '0300-1234567' },
      email: { type: String, default: '' },
      address: { type: String, required: true, default: 'Main Boulevard, Karachi' },
      city: { type: String, required: true, default: 'Karachi' },
      postalCode: { type: String, default: '75600' },
      notes: { type: String, default: '' },
    },
    items: [
      {
        productId: { type: String, required: true, default: 'prod-item' },
        name: { type: String, required: true, default: 'Royal Crockery Item' },
        image: { type: String, default: '' },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true, default: 0 },
        subtotal: { type: Number, required: true, default: 0 },
      },
    ],
    pricing: {
      subtotal: { type: Number, required: true, default: 0 },
      deliveryCharges: { type: Number, required: true, default: 0 },
      discount: { type: Number, required: true, default: 0 },
      total: { type: Number, required: true, default: 0 },
    },
    payment: {
      method: { type: String, default: 'Easypaisa' },
      status: {
        type: String,
        enum: ['Pending', 'Screenshot Received', 'Under Review', 'Paid', 'Rejected'],
        default: 'Pending',
      },
      screenshotUrl: { type: String, default: '' },
      transactionReference: { type: String, default: '' },
      verifiedBy: { type: String, default: '' },
      verifiedAt: { type: Date },
      rejectionReason: { type: String, default: '' },
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending Payment',
        'Payment Under Review',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending Payment',
    },
    invoiceUrl: { type: String, default: '' },
    adminNote: { type: String, default: '' },

    // Legacy fields mapping
    total: { type: Number },
    subtotal: { type: Number },
    shipping: { type: Number },
    tax: { type: Number },
    discount: { type: Number },
    status: { type: String },
    paymentMethod: { type: String },
    paymentStatus: { type: String },
    shippingAddress: { type: String },
  },
  { timestamps: true }
);

export const OrderModel =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

