import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary Media Storage Configuration
 * Credentials are read dynamically from environment variables.
 */
export const configureCloudinary = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim().replace(/^@+/, '');
  const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  // If full CLOUDINARY_URL exists, cloudinary SDK can parse it
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL.trim(),
      secure: true,
    });
    return cloudinary;
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



