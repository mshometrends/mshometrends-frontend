import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review.js';
import { mockReviews } from '../../data/mockData.js';

/**
 * GET all reviews
 * Route: GET /api/reviews
 */
export const getAllReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    let reviews = await ReviewModel.find().sort({ createdAt: -1 });

    if (reviews.length === 0) {
      console.log('[MongoDB] Seeding default reviews...');
      const reviewDocs = mockReviews.map((r) => ({
        userName: r.userName,
        userAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: r.rating,
        comment: r.comment,
        productId: r.productId || 'prod-1',
        productName: 'Royal Golden Porcelain Dinner Set',
        verifiedPurchase: r.verifiedPurchase ?? true,
        isVerifiedPurchase: r.verifiedPurchase ?? true,
        approved: true,
      }));
      reviews = await ReviewModel.insertMany(reviewDocs);
    }

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    console.error('[Reviews Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
};

/**
 * CREATE review
 * Route: POST /api/reviews
 */
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, rating, comment, productId, productName } = req.body;

    if (!userName || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Name, Rating, and Comment are required.' });
      return;
    }

    const newReview = await ReviewModel.create({
      userName,
      userAvatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?q=80&w=200&auto=format&fit=crop`,
      rating: Number(rating),
      comment,
      productId: productId || 'prod-1',
      productName: productName || 'Dinner Set',
      verifiedPurchase: true,
      isVerifiedPurchase: true,
      approved: typeof req.body.approved === 'boolean' ? req.body.approved : false,
    });

    res.status(201).json({
      success: true,
      message: 'Review created in MongoDB',
      data: newReview,
    });
  } catch (error: any) {
    console.error('[Reviews Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating review' });
  }
};

/**
 * APPROVE review
 * Route: PUT /api/reviews/:id/approve
 */
export const approveReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await ReviewModel.findByIdAndUpdate(id, { approved: true }, { new: true });
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.json({ success: true, message: 'Review approved', data: review });
  } catch (error: any) {
    console.error('[Reviews Controller - Approve Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE review
 * Route: DELETE /api/reviews/:id
 */
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await ReviewModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    console.error('[Reviews Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
