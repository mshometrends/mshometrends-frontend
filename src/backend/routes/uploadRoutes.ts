import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { uploadImageController, deleteImageController } from '../controllers/uploadController.js';

export const uploadRouter = Router();

// POST /api/upload/image OR /api/v1/upload/image
uploadRouter.post('/image', uploadMiddleware.single('image'), uploadImageController);

// DELETE /api/upload/image OR /api/v1/upload/image
uploadRouter.delete('/image', deleteImageController);
uploadRouter.delete('/image/:public_id(*)', deleteImageController);
