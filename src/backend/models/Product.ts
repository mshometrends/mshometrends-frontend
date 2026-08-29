import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICloudinaryImage, CloudinaryImageSchema } from './Image.js';

export interface IProduct {
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  material: string;
  color?: string;
  description: string;
  images: string[];
  imageDetails?: ICloudinaryImage[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
  piecesCount?: number;
  features?: string[];
  sku?: string;
  tags?: string[];
  createdAt?: string;
}

export interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    stockQuantity: { type: Number, required: true, default: 10 },
    material: { type: String, required: true, default: 'Bone China' },
    color: { type: String, default: 'Classic White' },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    imageDetails: { type: [CloudinaryImageSchema], default: [] },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    piecesCount: { type: Number, default: 24 },
    features: { type: [String], default: ['Hand-gilded 24K Gold Trim', 'High Thermal Shock Resistance', 'Dishwasher Safe Fine China', 'Lead-Free Eco Glaze'] },
    sku: { type: String, default: 'MS-SKU-001' },
    tags: { type: [String], default: [] },
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

export const ProductModel: Model<IProductDocument> =
  (mongoose.models.Product as Model<IProductDocument>) ||
  mongoose.model<IProductDocument>('Product', ProductSchema);
