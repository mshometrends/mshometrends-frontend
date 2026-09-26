import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { uploadImageController, deleteImageController } from '../controllers/uploadController.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const uploadRouter = Router();

// POST /api/upload/image OR /api/v1/upload/image (Protected - Admin Only)
uploadRouter.post('/image', requireAdminAuth, uploadMiddleware.single('image'), uploadImageController);

// DELETE /api/upload/image OR /api/v1/upload/image (Protected - Admin Only)
uploadRouter.delete('/image', requireAdminAuth, deleteImageController);
uploadRouter.delete('/image/:public_id(*)', requireAdminAuth, deleteImageController);
