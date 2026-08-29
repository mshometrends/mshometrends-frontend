import { Request, Response } from 'express';
import { CouponModel } from '../models/Coupon.js';
import { mockCoupons } from '../../data/mockData.js';

/**
 * GET all coupons
 * Route: GET /api/coupons
 */
export const getAllCoupons = async (_req: Request, res: Response): Promise<void> => {
  try {
    let coupons = await CouponModel.find().sort({ createdAt: -1 });

    if (coupons.length === 0) {
      console.log('[MongoDB] Seeding default coupons...');
      const couponDocs = mockCoupons.map((c) => ({
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minSpend: c.minSpend || 0,
        active: c.active ?? true,
        expiryDate: c.expiryDate || '2028-12-31',
        productId: c.productId || '',
        productName: c.productName || '',
      }));
      coupons = await (CouponModel as any).insertMany(couponDocs);
    }

    res.json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error: any) {
    console.error('[Coupons Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching coupons' });
  }
};

/**
 * CREATE coupon
 * Route: POST /api/coupons
 */
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, discountType, discountValue, minSpend, expiryDate, productId, productName } = req.body;

    if (!code || !discountValue) {
      res.status(400).json({ success: false, message: 'Coupon code and discount value are required.' });
      return;
    }

    const newCoupon = await CouponModel.create({
      code: String(code).toUpperCase().trim(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minSpend: minSpend ? Number(minSpend) : 0,
      active: true,
      expiryDate: expiryDate || '2028-12-31',
      productId: productId || '',
      productName: productName || '',
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created in MongoDB',
      data: newCoupon,
    });
  } catch (error: any) {
    console.error('[Coupons Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating coupon' });
  }
};

/**
 * VALIDATE coupon code
 * Route: POST /api/coupons/validate
 */
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, totalAmount } = req.body;
    const cleanCode = String(code || '').toUpperCase().trim();

    const coupon = await (CouponModel as any).findOne({ code: cleanCode, active: true });

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid or inactive coupon code.' });
      return;
    }

    if (totalAmount && coupon.minSpend && totalAmount < coupon.minSpend) {
      res.status(400).json({
        success: false,
        message: `Minimum order spend of $${coupon.minSpend} required for this coupon.`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      data: coupon,
    });
  } catch (error: any) {
    console.error('[Coupons Controller - Validate Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE coupon
 * Route: DELETE /api/coupons/:id
 */
export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await (CouponModel as any).findByIdAndDelete(id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    console.error('[Coupons Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
