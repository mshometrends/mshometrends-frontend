import multer from 'multer';
import { Request } from 'express';

// Memory storage keeps uploaded file buffer in memory
const storage = multer.memoryStorage();

// File filter validation: MIME type check
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: any
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP image formats are supported.'));
  }
};

// Multer upload middleware configuration (Max file size: 10MB)
export const uploadMiddleware: any = multer({
  storage,
  fileFilter: fileFilter as any,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Megabytes limit
  },
});
