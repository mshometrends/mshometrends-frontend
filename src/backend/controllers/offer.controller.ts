import { Request, Response } from 'express';
import { OfferModel } from '../models/Offer.js';
import { mockOffers } from '../../data/mockData.js';

/**
 * GET all promotional offers
 * Route: GET /api/offers or /api/v1/offers
 */
export const getAllOffers = async (_req: Request, res: Response): Promise<void> => {
  try {
    let offers = await OfferModel.find().sort({ order: 1, createdAt: -1 });

    if (offers.length === 0) {
      console.log('[MongoDB] Seeding default promotional offers...');
      const offerDocs = mockOffers.map((o: any, idx: number) => ({
        badge: o.badge || 'SPECIAL OFFER',
        badgeType: o.badgeType || 'gold',
        title: o.title,
        description: o.description || '',
        code: o.code ? o.code.toUpperCase() : undefined,
        discountText: o.discountText || undefined,
        targetPage: o.targetPage || 'products',
        targetParam: o.targetParam || '',
        active: o.active ?? true,
        order: o.order ?? idx + 1,
      }));
      offers = await OfferModel.insertMany(offerDocs);
    }

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error: any) {
    console.error('[Offers Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching offers' });
  }
};

/**
 * CREATE promotional offer
 * Route: POST /api/offers or /api/v1/offers
 */
export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { badge, badgeType, title, description, code, discountText, targetPage, targetParam, active, order, startDate, endDate } = req.body;

    if (!badge || !title || !description) {
      res.status(400).json({ success: false, message: 'Badge, Title, and Description are required.' });
      return;
    }

    const newOffer = await OfferModel.create({
      badge: badge.trim(),
      badgeType: badgeType || 'gold',
      title: title.trim(),
      description: description.trim(),
      code: code ? code.trim().toUpperCase() : undefined,
      discountText: discountText ? discountText.trim() : undefined,
      targetPage: targetPage || 'products',
      targetParam: targetParam || '',
      active: active !== undefined ? Boolean(active) : true,
      order: order ? Number(order) : 1,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Promotional offer created in MongoDB',
      data: newOffer,
    });
  } catch (error: any) {
    console.error('[Offers Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating offer' });
  }
};

/**
 * UPDATE promotional offer
 * Route: PUT /api/offers/:id or /api/v1/offers/:id
 */
export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { badge, badgeType, title, description, code, discountText, targetPage, targetParam, active, order, startDate, endDate } = req.body;

    const updateData: any = {};
    if (badge !== undefined) updateData.badge = badge.trim();
    if (badgeType !== undefined) updateData.badgeType = badgeType;
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (code !== undefined) updateData.code = code ? code.trim().toUpperCase() : '';
    if (discountText !== undefined) updateData.discountText = discountText ? discountText.trim() : '';
    if (targetPage !== undefined) updateData.targetPage = targetPage;
    if (targetParam !== undefined) updateData.targetParam = targetParam;
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined) updateData.order = Number(order);
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;

    let updated = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await OfferModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!updated && title) {
      updated = await OfferModel.findOneAndUpdate({ title }, updateData, { new: true });
    }

    if (!updated) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Promotional offer updated in MongoDB',
      data: updated,
    });
  } catch (error: any) {
    console.error('[Offers Controller - PUT Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating offer' });
  }
};

/**
 * DELETE promotional offer
 * Route: DELETE /api/offers/:id or /api/v1/offers/:id
 */
export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await OfferModel.findByIdAndDelete(id);
    } else {
      deleted = await OfferModel.findOneAndDelete({ $or: [{ code: id }, { badge: id }] });
    }

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Offer not found for deletion' });
      return;
    }

    res.json({
      success: true,
      message: 'Promotional offer deleted successfully',
      data: deleted,
    });
  } catch (error: any) {
    console.error('[Offers Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting offer' });
  }
};

/**
 * TOGGLE promotional offer status (active/inactive)
 * Route: PUT /api/offers/:id/toggle or /api/v1/offers/:id/toggle
 */
export const toggleOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let offer = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      offer = await OfferModel.findById(id);
    }

    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    offer.active = !offer.active;
    await offer.save();

    res.json({
      success: true,
      message: `Offer ${offer.active ? 'activated' : 'deactivated'} successfully`,
      data: offer,
    });
  } catch (error: any) {
    console.error('[Offers Controller - TOGGLE Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error toggling offer' });
  }
};
