import { Request, Response } from 'express';
import { ShippingRuleModel } from '../models/ShippingRule.js';

const defaultShippingRules = [
  {
    country: 'Pakistan',
    city: 'Karachi',
    zipCode: 'All',
    categoryId: 'All',
    categoryName: 'All Categories',
    productId: 'All',
    productName: 'All Products',
    shippingFee: 5.0,
    deliveryTime: '1-2 Days Express Delivery',
    isActive: true,
  },
  {
    country: 'Pakistan',
    city: 'Lahore',
    zipCode: 'All',
    categoryId: 'All',
    categoryName: 'All Categories',
    productId: 'All',
    productName: 'All Products',
    shippingFee: 8.0,
    deliveryTime: '2-3 Business Days',
    isActive: true,
  },
  {
    country: 'Pakistan',
    city: 'Islamabad',
    zipCode: 'All',
    categoryId: 'All',
    categoryName: 'All Categories',
    productId: 'All',
    productName: 'All Products',
    shippingFee: 8.0,
    deliveryTime: '2-3 Business Days',
    isActive: true,
  },
  {
    country: 'Pakistan',
    city: 'All',
    zipCode: 'All',
    categoryId: 'All',
    categoryName: 'All Categories',
    productId: 'All',
    productName: 'All Products',
    shippingFee: 10.0,
    deliveryTime: '3-5 Business Days',
    isActive: true,
  },
  {
    country: 'All',
    city: 'All',
    zipCode: 'All',
    categoryId: 'All',
    categoryName: 'All Categories',
    productId: 'All',
    productName: 'All Products',
    shippingFee: 25.0,
    deliveryTime: '7-14 Business Days International',
    isActive: true,
  },
];

/**
 * GET all shipping rules
 * Route: GET /api/shipping
 */
export const getAllShippingRules = async (_req: Request, res: Response): Promise<void> => {
  try {
    let rules = await ShippingRuleModel.find().sort({ createdAt: -1 });

    if (rules.length === 0) {
      console.log('[MongoDB] Seeding initial default shipping rules...');
      rules = await (ShippingRuleModel as any).insertMany(defaultShippingRules);
    }

    res.json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error: any) {
    console.error('[Shipping Rules Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching shipping rules' });
  }
};

/**
 * CALCULATE shipping fee based on country, city, zip code, category, product
 * Route: POST /api/shipping/calculate
 */
export const calculateShippingFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country = 'Pakistan', city = 'Karachi', zipCode = 'All', categoryId = 'All', productId = 'All' } = req.body;

    const inputCountry = String(country).trim();
    const inputCity = String(city).trim();
    const inputZip = String(zipCode).trim();
    const inputCat = String(categoryId).trim();
    const inputProd = String(productId).trim();

    let rules = await (ShippingRuleModel as any).find({ isActive: true });
    if (rules.length === 0) {
      rules = await (ShippingRuleModel as any).insertMany(defaultShippingRules);
    }

    // Matching Hierarchy Precedence:
    // 1. Match Product + Category + Zip + City + Country
    // 2. Match Category + City + Country
    // 3. Match City + Country
    // 4. Match Country
    // 5. Default Fallback Rule
    const matchedRule =
      rules.find(
        (r: any) =>
          r.productId && r.productId !== 'All' && r.productId === inputProd &&
          r.city.toLowerCase() === inputCity.toLowerCase() &&
          r.country.toLowerCase() === inputCountry.toLowerCase()
      ) ||
      rules.find(
        (r: any) =>
          r.categoryId && r.categoryId !== 'All' && r.categoryId === inputCat &&
          r.city.toLowerCase() === inputCity.toLowerCase() &&
          r.country.toLowerCase() === inputCountry.toLowerCase()
      ) ||
      rules.find(
        (r: any) =>
          r.zipCode.toLowerCase() === inputZip.toLowerCase() &&
          r.city.toLowerCase() === inputCity.toLowerCase() &&
          r.country.toLowerCase() === inputCountry.toLowerCase()
      ) ||
      rules.find(
        (r: any) =>
          r.city.toLowerCase() === inputCity.toLowerCase() &&
          r.country.toLowerCase() === inputCountry.toLowerCase()
      ) ||
      rules.find((r: any) => r.country.toLowerCase() === inputCountry.toLowerCase()) ||
      rules.find((r: any) => r.city.toLowerCase() === 'all' && r.country.toLowerCase() === 'pakistan') ||
      rules[0];

    res.json({
      success: true,
      data: {
        shippingFee: matchedRule ? matchedRule.shippingFee : 10.0,
        deliveryTime: matchedRule ? matchedRule.deliveryTime : '2-4 Business Days',
        matchedRule,
      },
    });
  } catch (error: any) {
    console.error('[Shipping Controller - Calculate Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error calculating shipping' });
  }
};

/**
 * CREATE shipping rule
 * Route: POST /api/shipping
 */
export const createShippingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, city, zipCode, categoryId, categoryName, productId, productName, shippingFee, deliveryTime } = req.body;

    if (!country || !city) {
      res.status(400).json({ success: false, message: 'Country and City are required.' });
      return;
    }

    const newRule = await ShippingRuleModel.create({
      country: String(country).trim(),
      city: String(city).trim(),
      zipCode: zipCode ? String(zipCode).trim() : 'All',
      categoryId: categoryId ? String(categoryId).trim() : 'All',
      categoryName: categoryName ? String(categoryName).trim() : 'All Categories',
      productId: productId ? String(productId).trim() : 'All',
      productName: productName ? String(productName).trim() : 'All Products',
      shippingFee: Number(shippingFee) || 0,
      deliveryTime: deliveryTime || '2-4 Business Days',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Shipping rule created in MongoDB',
      data: newRule,
    });
  } catch (error: any) {
    console.error('[Shipping Controller - POST Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating shipping rule' });
  }
};

/**
 * UPDATE shipping rule
 * Route: PUT /api/shipping/:id
 */
export const updateShippingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await (ShippingRuleModel as any).findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Shipping rule not found' });
      return;
    }
    res.json({ success: true, message: 'Shipping rule updated', data: updated });
  } catch (error: any) {
    console.error('[Shipping Controller - PUT Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE shipping rule
 * Route: DELETE /api/shipping/:id
 */
export const deleteShippingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await (ShippingRuleModel as any).findByIdAndDelete(id);
    res.json({ success: true, message: 'Shipping rule deleted' });
  } catch (error: any) {
    console.error('[Shipping Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
