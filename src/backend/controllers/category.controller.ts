import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category.js';
import { mockCategories } from '../../data/mockData.js';

/**
 * GET all categories
 * Route: GET /api/categories
 */
export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    let categories = await CategoryModel.find().sort({ createdAt: -1 });

    if (categories.length === 0) {
      console.log('[MongoDB] Seeding default categories...');
      const categoryDocs = mockCategories.map((cat) => ({
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        image: cat.image,
        description: cat.description || '',
        itemCount: cat.itemCount || 0,
      }));
      categories = await CategoryModel.insertMany(categoryDocs);
    }

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('[Categories Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching categories' });
  }
};

/**
 * GET category by ID or Slug
 * Route: GET /api/categories/:id
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let category = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await CategoryModel.findById(id);
    }
    if (!category && id) {
      category = await CategoryModel.findOne({ $or: [{ slug: id }, { name: id }] });
    }

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error: any) {
    console.error('[Categories Controller - GetById Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CREATE category
 * Route: POST /api/categories
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = await CategoryModel.create({
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop',
      description: description || '',
      itemCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created in MongoDB',
      data: newCategory,
    });
  } catch (error: any) {
    console.error('[Categories Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating category' });
  }
};

/**
 * UPDATE category
 * Route: PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updated = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!updated && id) {
      updated = await CategoryModel.findOneAndUpdate(
        { $or: [{ slug: id }, { name: id }] },
        req.body,
        { new: true }
      );
    }
    if (!updated && req.body.name) {
      updated = await CategoryModel.findOneAndUpdate(
        { name: req.body.name },
        req.body,
        { new: true }
      );
    }

    if (!updated) {
      const slug = req.body.name ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`;
      updated = await CategoryModel.create({
        ...req.body,
        slug,
      });
    }

    res.json({
      success: true,
      message: 'Category updated in MongoDB',
      data: updated,
    });
  } catch (error: any) {
    console.error('[Categories Controller - PUT Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating category' });
  }
};

/**
 * DELETE category
 * Route: DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await CategoryModel.findByIdAndDelete(id);
    }
    if (!deleted && id) {
      deleted = await CategoryModel.findOneAndDelete({ $or: [{ slug: id }, { name: id }] });
    }

    res.json({
      success: true,
      message: 'Category deleted from MongoDB',
    });
  } catch (error: any) {
    console.error('[Categories Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting category' });
  }
};
