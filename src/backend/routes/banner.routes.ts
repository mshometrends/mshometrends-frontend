import { Router } from 'express';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from '../controllers/banner.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const bannerRouter = Router();

// Banner Collection Routes (Public for storefront display)
bannerRouter.get('/', getAllBanners);

// Protected Administrative Routes (Require Admin Auth)
bannerRouter.post('/', requireAdminAuth, createBanner);
bannerRouter.put('/:id', requireAdminAuth, updateBanner);
bannerRouter.delete('/:id', requireAdminAuth, deleteBanner);
bannerRouter.put('/:id/toggle', requireAdminAuth, toggleBanner);
