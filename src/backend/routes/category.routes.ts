import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

export const categoryRouter = Router();

// Category Collection Routes
categoryRouter.get('/', getAllCategories);
categoryRouter.post('/', createCategory);

// Category Document Routes
categoryRouter.get('/:id', getCategoryById);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);
