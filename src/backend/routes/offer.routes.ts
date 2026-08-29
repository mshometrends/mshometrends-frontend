import { Router } from 'express';
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
} from '../controllers/offer.controller.js';

export const offerRouter = Router();

// Offer Collection Routes
offerRouter.get('/', getAllOffers);
offerRouter.post('/', createOffer);

// Offer Document Routes
offerRouter.put('/:id', updateOffer);
offerRouter.delete('/:id', deleteOffer);
offerRouter.put('/:id/toggle', toggleOffer);
