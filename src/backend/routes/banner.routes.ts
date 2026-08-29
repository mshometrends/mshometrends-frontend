import { Router } from 'express';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from '../controllers/banner.controller.js';

export const bannerRouter = Router();

// Banner Collection Routes
bannerRouter.get('/', getAllBanners);
bannerRouter.post('/', createBanner);

// Banner Document Routes
bannerRouter.put('/:id', updateBanner);
bannerRouter.delete('/:id', deleteBanner);
bannerRouter.put('/:id/toggle', toggleBanner);
