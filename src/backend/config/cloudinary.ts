import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  const rawCloudName = (process.env.CLOUDINARY_CLOUD_NAME || 'pljnmeck').trim().replace(/^@+/, '');
  const cloud_name = rawCloudName || 'pljnmeck';
  const api_key = (process.env.CLOUDINARY_API_KEY || '453388625493396').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || 'DK1XdY0jpmtbr-7SnqyzexfTpFk').trim();

  // If full CLOUDINARY_URL exists, cloudinary SDK can parse it, or we configure explicitly
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL.trim(),
      secure: true,
    });
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return cloudinary;
};

// Initial configuration
configureCloudinary();

export default cloudinary;


