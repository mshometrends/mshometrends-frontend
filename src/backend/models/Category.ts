import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICloudinaryImage, CloudinaryImageSchema } from './Image.js';

export interface ICategory {
  name: string;
  slug: string;
  image: string;
  imageDetails?: ICloudinaryImage;
  description?: string;
  itemCount?: number;
}

export interface ICategoryDocument extends ICategory, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    imageDetails: { type: CloudinaryImageSchema },
    description: { type: String, default: '' },
    itemCount: { type: Number, default: 0 },
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

export const CategoryModel: Model<ICategoryDocument> =
  (mongoose.models.Category as Model<ICategoryDocument>) ||
  mongoose.model<ICategoryDocument>('Category', CategorySchema);
