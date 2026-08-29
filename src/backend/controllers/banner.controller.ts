import { Request, Response } from 'express';
import { BannerModel } from '../models/Banner.js';
import { mockBanners } from '../../data/mockData.js';

/**
 * GET all hero banners
 * Route: GET /api/banners
 */
export const getAllBanners = async (_req: Request, res: Response): Promise<void> => {
  try {
    let banners = await BannerModel.find().sort({ order: 1 });

    if (banners.length === 0) {
      console.log('[MongoDB] Seeding default hero banners...');
      const bannerDocs = mockBanners.map((b: any, idx) => ({
        title: b.title,
        subtitle: b.subtitle || b.description || 'Luxury Crockery & Fine Dining',
        image: b.image,
        ctaText: b.ctaText || b.buttonText || 'Explore Collection',
        ctaLink: b.ctaLink || b.buttonLink || '/shop',
        active: b.active ?? true,
        order: idx + 1,
      }));
      banners = await BannerModel.insertMany(bannerDocs);
    }

    res.json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error: any) {
    console.error('[Banners Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching banners' });
  }
};

/**
 * CREATE hero banner
 * Route: POST /api/banners
 */
export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, subheading, image, ctaText, ctaLink, ctaUrl, active, order } = req.body;

    if (!title || !image) {
      res.status(400).json({ success: false, message: 'Title and Image URL are required.' });
      return;
    }

    const newBanner = await BannerModel.create({
      title,
      subtitle: subtitle || subheading || 'Luxury Crockery & Fine Dining',
      image,
      ctaText: ctaText || 'Explore Collection',
      ctaLink: ctaLink || ctaUrl || '/shop',
      active: active !== undefined ? Boolean(active) : true,
      order: order ? Number(order) : 1,
    });

    res.status(201).json({
      success: true,
      message: 'Hero banner created in MongoDB',
      data: newBanner,
    });
  } catch (error: any) {
    console.error('[Banners Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating banner' });
  }
};

/**
 * UPDATE hero banner
 * Route: PUT /api/banners/:id
 */
export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, subtitle, subheading, image, ctaText, ctaLink, ctaUrl, active, order } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle || subheading) updateData.subtitle = subtitle || subheading;
    if (image !== undefined) updateData.image = image;
    if (ctaText !== undefined) updateData.ctaText = ctaText;
    if (ctaLink || ctaUrl) updateData.ctaLink = ctaLink || ctaUrl;
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined) updateData.order = Number(order);

    let updated = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await BannerModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!updated && title) {
      updated = await BannerModel.findOneAndUpdate({ title }, updateData, { new: true });
    }
    if (!updated && order) {
      updated = await BannerModel.findOneAndUpdate({ order: Number(order) }, updateData, { new: true });
    }

    if (!updated) {
      updated = await BannerModel.create({
        title: title || 'Hero Banner',
        subtitle: subtitle || subheading || 'Luxury Crockery & Fine Dining',
        image: image || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop',
        ctaText: ctaText || 'Explore Collection',
        ctaLink: ctaLink || ctaUrl || '/shop',
        active: active !== undefined ? Boolean(active) : true,
        order: order ? Number(order) : 1,
      });
    }

    res.json({
      success: true,
      message: 'Hero banner updated successfully in MongoDB',
      data: updated,
    });
  } catch (error: any) {
    console.error('[Banners Controller - PUT Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE hero banner
 * Route: DELETE /api/banners/:id
 */
export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await BannerModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    res.json({ success: true, message: 'Hero banner deleted successfully' });
  } catch (error: any) {
    console.error('[Banners Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * TOGGLE banner active status
 * Route: PUT /api/banners/:id/toggle
 */
export const toggleBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const banner = await BannerModel.findById(id);
    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    banner.active = !banner.active;
    await banner.save();
    res.json({ success: true, message: `Banner ${banner.active ? 'activated' : 'deactivated'}`, data: banner });
  } catch (error: any) {
    console.error('[Banners Controller - Toggle Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
