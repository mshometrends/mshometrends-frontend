import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

export const categoryRouter = Router();

// Category Collection Routes (Public for shopping)
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getCategoryById);

// Protected Administrative Routes (Require Admin Auth)
categoryRouter.post('/', requireAdminAuth, createCategory);
categoryRouter.put('/:id', requireAdminAuth, updateCategory);
categoryRouter.delete('/:id', requireAdminAuth, deleteCategory);
