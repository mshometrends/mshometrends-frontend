import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { mockProducts } from '../../data/mockData.js';

/**
 * GET all products
 * Route: GET /api/products
 */
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    let products = await ProductModel.find().sort({ createdAt: -1 });

    if (products.length === 0) {
      console.log('[MongoDB] Seeding default products...');
      const productDocs = mockProducts.map((p) => ({
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice,
        stockQuantity: p.stockQuantity ?? 15,
        material: p.material || 'Bone China',
        color: p.color || 'White & Gold',
        description: p.description,
        images: p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop'],
        rating: p.rating || 5.0,
        reviewCount: p.reviewCount || 1,
        featured: p.isFeatured ?? true,
        isFeatured: p.isFeatured ?? true,
        isBestseller: p.isBestSeller ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isNewArrival: p.isNewArrival ?? false,
        isLimitedEdition: false,
        piecesCount: 24,
      }));
      products = await ProductModel.insertMany(productDocs);
    }

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error('[Products Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching products' });
  }
};

/**
 * GET featured products
 * Route: GET /api/products/featured
 */
export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const featured = await ProductModel.find({ featured: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: featured.length, data: featured });
  } catch (error: any) {
    console.error('[Products Controller - Featured Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET product by ID or Slug
 * Route: GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let product = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await ProductModel.findById(id);
    }
    if (!product && id) {
      product = await ProductModel.findOne({ $or: [{ slug: id }, { name: id }] });
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    console.error('[Products Controller - GetById Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CREATE new product
 * Route: POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      stockQuantity,
      material,
      color,
      description,
      images,
      piecesCount,
      featured,
      isFeatured,
      features,
      sku,
      tags,
      inStock,
      isBestSeller,
      isBestseller,
      isNewArrival,
    } = req.body;

    if (!name || price === undefined || !category) {
      res.status(400).json({ success: false, message: 'Name, Category, and Price are required' });
      return;
    }

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const isFeat = Boolean(featured ?? isFeatured ?? false);
    const isBest = Boolean(isBestSeller ?? isBestseller ?? false);

    const newProduct = await ProductModel.create({
      name,
      slug,
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 15,
      material: material || 'Bone China',
      color: color || 'White & Gold',
      description: description || 'Luxurious fine crockery piece designed for special occasions.',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop'],
      rating: 5.0,
      reviewCount: 1,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      featured: isFeat,
      isFeatured: isFeat,
      isBestseller: isBest,
      isBestSeller: isBest,
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : false,
      piecesCount: piecesCount ? Number(piecesCount) : 24,
      features: Array.isArray(features) ? features : ['Hand-gilded 24K Gold Trim', 'Dishwasher Safe Fine China'],
      sku: sku || `MS-${Date.now().toString().slice(-4)}`,
      tags: Array.isArray(tags) ? tags : ['Luxury', 'Crockery'],
    });

    console.log(`[MongoDB Atlas] Created Product in database: ${newProduct.name} (ID: ${newProduct._id})`);

    res.status(201).json({
      success: true,
      message: 'Product created and saved to MongoDB Atlas',
      data: newProduct,
    });
  } catch (error: any) {
    console.error('[Products Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating product' });
  }
};

/**
 * UPDATE existing product
 * Route: PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.price !== undefined) body.price = Number(body.price);
    if (body.oldPrice !== undefined) body.oldPrice = Number(body.oldPrice);
    if (body.stockQuantity !== undefined) body.stockQuantity = Number(body.stockQuantity);
    if (body.isFeatured !== undefined) {
      body.featured = Boolean(body.isFeatured);
    } else if (body.featured !== undefined) {
      body.isFeatured = Boolean(body.featured);
    }
    if (body.isBestSeller !== undefined) {
      body.isBestseller = Boolean(body.isBestSeller);
    } else if (body.isBestseller !== undefined) {
      body.isBestSeller = Boolean(body.isBestseller);
    }

    let updated = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await ProductModel.findByIdAndUpdate(id, body, { new: true });
    }
    if (!updated && id) {
      updated = await ProductModel.findOneAndUpdate(
        { $or: [{ slug: id }, { name: id }] },
        body,
        { new: true }
      );
    }
    if (!updated && body.name) {
      updated = await ProductModel.findOneAndUpdate({ name: body.name }, body, { new: true });
    }

    if (!updated) {
      const slug = body.slug || (body.name ? body.name.toLowerCase().replace(/\s+/g, '-') : `prod-${Date.now()}`);
      updated = await ProductModel.create({
        ...body,
        slug,
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully in MongoDB Atlas',
      data: updated,
    });
  } catch (error: any) {
    console.error('[Products Controller - PUT Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating product' });
  }
};

/**
 * TOGGLE FEATURED status of a product
 * Route: PUT/PATCH /api/products/:id/featured, /api/products/:id/feature
 */
export const toggleProductFeatured = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    let product = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await ProductModel.findById(id);
    }
    if (!product) {
      product = await ProductModel.findOne({ $or: [{ slug: id }, { name: id }] });
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const nextState = typeof featured === 'boolean' ? featured : !Boolean(product.featured || product.isFeatured);
    product.featured = nextState;
    product.isFeatured = nextState;
    await product.save();

    res.json({
      success: true,
      message: `Product ${nextState ? 'marked as Featured' : 'removed from Featured'}`,
      data: product,
    });
  } catch (error: any) {
    console.error('[Products Controller - Toggle Featured Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * DELETE a product
 * Route: DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await ProductModel.findByIdAndDelete(id);
    }
    if (!deleted && id) {
      deleted = await ProductModel.findOneAndDelete({ $or: [{ slug: id }, { name: id }] });
    }

    res.json({
      success: true,
      message: 'Product deleted from MongoDB',
    });
  } catch (error: any) {
    console.error('[Products Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting product' });
  }
};
