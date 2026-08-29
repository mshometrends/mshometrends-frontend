import mongoose, { Schema, Document } from 'mongoose';

export interface ICouponDocument extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  active: boolean;
  expiryDate: string;
  productId?: string;
  productName?: string;
  createdAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiryDate: { type: String, required: true },
    productId: { type: String, default: '' },
    productName: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CouponModel =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema);
