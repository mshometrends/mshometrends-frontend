import { Router } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductFeatured,
  deleteProduct,
} from '../controllers/product.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const productRouter = Router();

// Products Collection Routes (Public for shopping)
productRouter.get('/', getAllProducts);
productRouter.get('/featured', getFeaturedProducts);

// Product Document Routes (Public for product detail page)
productRouter.get('/:id', getProductById);

// Protected Administrative Routes (Require Admin Auth)
productRouter.post('/', requireAdminAuth, createProduct);
productRouter.put('/:id', requireAdminAuth, updateProduct);
productRouter.delete('/:id', requireAdminAuth, deleteProduct);

// Toggle Featured Status Aliases (Protected - Admin Only)
productRouter.put('/:id/featured', requireAdminAuth, toggleProductFeatured);
productRouter.patch('/:id/featured', requireAdminAuth, toggleProductFeatured);
productRouter.put('/:id/feature', requireAdminAuth, toggleProductFeatured);
productRouter.patch('/:id/feature', requireAdminAuth, toggleProductFeatured);
