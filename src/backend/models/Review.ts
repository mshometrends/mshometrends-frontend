import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview {
  productId: string;
  productName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date?: string;
  verifiedPurchase?: boolean;
  isVerifiedPurchase?: boolean;
  approved?: boolean;
}

export interface IReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, default: 'Fine Crockery Item' },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
    verifiedPurchase: { type: Boolean, default: true },
    isVerifiedPurchase: { type: Boolean, default: true },
    approved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ReviewModel: Model<IReviewDocument> =
  (mongoose.models.Review as Model<IReviewDocument>) ||
  mongoose.model<IReviewDocument>('Review', ReviewSchema);
