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

export const productRouter = Router();

// Products Collection Routes
productRouter.get('/', getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.post('/', createProduct);

// Product Document Routes
productRouter.get('/:id', getProductById);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

// Toggle Featured Status Aliases
productRouter.put('/:id/featured', toggleProductFeatured);
productRouter.patch('/:id/featured', toggleProductFeatured);
productRouter.put('/:id/feature', toggleProductFeatured);
productRouter.patch('/:id/feature', toggleProductFeatured);
