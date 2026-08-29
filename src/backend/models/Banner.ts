import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  active?: boolean;
  order?: number;
}

export interface IBannerDocument extends IBanner, Document {}

const BannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/shop' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const BannerModel: Model<IBannerDocument> =
  (mongoose.models.Banner as Model<IBannerDocument>) ||
  mongoose.model<IBannerDocument>('Banner', BannerSchema);
