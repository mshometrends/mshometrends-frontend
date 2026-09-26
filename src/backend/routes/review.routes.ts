import { Router } from 'express';
import {
  getAllReviews,
  createReview,
  approveReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const reviewRouter = Router();

// Review Collection Routes (Public for testimonials display & submitting feedback)
reviewRouter.get('/', getAllReviews);
reviewRouter.post('/', createReview);

// Review Moderation Routes (Protected - Admin Only)
reviewRouter.put('/:id/approve', requireAdminAuth, approveReview);
reviewRouter.delete('/:id', requireAdminAuth, deleteReview);
