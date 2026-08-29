import { Router } from 'express';
import {
  getAllReviews,
  createReview,
  approveReview,
  deleteReview,
} from '../controllers/review.controller.js';

export const reviewRouter = Router();

// Review Collection Routes
reviewRouter.get('/', getAllReviews);
reviewRouter.post('/', createReview);

// Review Document Routes
reviewRouter.put('/:id/approve', approveReview);
reviewRouter.delete('/:id', deleteReview);
