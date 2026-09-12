import mongoose, { Schema, Document } from 'mongoose';

export interface IShippingRule extends Document {
  country: string;
  city: string;
  zipCode: string;
  categoryId?: string;
  categoryName?: string;
  productId?: string;
  productName?: string;
  shippingFee: number;
  deliveryTime: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ShippingRuleSchema: Schema = new Schema(
  {
    country: { type: String, required: true, default: 'Pakistan' },
    city: { type: String, required: true, default: 'All' },
    zipCode: { type: String, default: 'All' },
    categoryId: { type: String, default: 'All' },
    categoryName: { type: String, default: 'All Categories' },
    productId: { type: String, default: 'All' },
    productName: { type: String, default: 'All Products' },
    shippingFee: { type: Number, required: true, default: 10 },
    deliveryTime: { type: String, default: '2-4 Business Days' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ShippingRuleModel =
  mongoose.models.ShippingRule || mongoose.model<IShippingRule>('ShippingRule', ShippingRuleSchema);
