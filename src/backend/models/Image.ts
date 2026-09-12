import { Schema } from 'mongoose';

export interface ICloudinaryImage {
  url: string;
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export const CloudinaryImageSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    public_id: { type: String, default: '' },
    format: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    bytes: { type: Number, default: 0 },
  },
  { _id: false }
);
