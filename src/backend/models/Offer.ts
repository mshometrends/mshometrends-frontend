import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer {
  badge: string;
  badgeType?: string;
  title: string;
  description: string;
  code?: string;
  discountText?: string;
  targetPage?: string;
  targetParam?: string;
  active?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
}

export interface IOfferDocument extends IOffer, Document {}

const OfferSchema = new Schema<IOfferDocument>(
  {
    badge: { type: String, required: true, trim: true },
    badgeType: { type: String, enum: ['gold', 'emerald', 'amber', 'rose'], default: 'gold' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    code: { type: String, uppercase: true, trim: true },
    discountText: { type: String, trim: true },
    targetPage: { type: String, default: 'products' },
    targetParam: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    startDate: { type: String },
    endDate: { type: String },
  },
  { timestamps: true }
);

export const OfferModel: Model<IOfferDocument> =
  (mongoose.models.Offer as Model<IOfferDocument>) ||
  mongoose.model<IOfferDocument>('Offer', OfferSchema);
