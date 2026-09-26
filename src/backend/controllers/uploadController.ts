import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';

/**
 * Controller to handle single image upload to Cloudinary
 * POST /api/upload/image
 */
export const uploadImageController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided in request. Please select a valid image.',
      });
      return;
    }

    // Upload memory buffer to Cloudinary using upload_stream
    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        url: result.url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error: any) {
    console.error('[Upload Controller Error]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

/**
 * Controller to delete an image asset from Cloudinary by public_id
 * DELETE /api/upload/image
 */
export const deleteImageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const public_id = (req.body.public_id || req.params.public_id || req.query.public_id) as string;

    if (!public_id) {
      res.status(200).json({
        success: true,
        message: 'No public_id provided, skipped deletion.',
      });
      return;
    }

    await deleteFromCloudinary(public_id);

    res.status(200).json({
      success: true,
      message: 'Image asset removed successfully.',
    });
  } catch (error: any) {
    console.warn('[Upload Controller Delete Warning]', error?.message || error);
    res.status(200).json({
      success: true,
      message: 'Image deletion handled safely.',
    });
  }
};
