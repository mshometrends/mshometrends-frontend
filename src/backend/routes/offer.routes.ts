import { Router } from 'express';
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
} from '../controllers/offer.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const offerRouter = Router();

// Offer Collection Routes (Public for promo ticker / banners)
offerRouter.get('/', getAllOffers);

// Protected Administrative Routes (Require Admin Auth)
offerRouter.post('/', requireAdminAuth, createOffer);
offerRouter.put('/:id', requireAdminAuth, updateOffer);
offerRouter.delete('/:id', requireAdminAuth, deleteOffer);
offerRouter.put('/:id/toggle', requireAdminAuth, toggleOffer);
