import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { CategoryModel } from '../models/Category.js';
import { mockProducts, mockCategories } from '../../data/mockData.js';
import fs from 'fs';
import path from 'path';

/**
 * GENERATE dynamic sitemap.xml
 * Route: GET /sitemap.xml
 */
export const getSitemapXml = async (_req: Request, res: Response): Promise<void> => {
  try {
    let products: any[] = [];
    let categories: any[] = [];

    try {
      products = await ProductModel.find().lean();
      categories = await CategoryModel.find().lean();
    } catch {
      products = mockProducts;
      categories = mockCategories;
    }

    if (!products || products.length === 0) products = mockProducts;
    if (!categories || categories.length === 0) categories = mockCategories;

    const baseUrl = 'https://mshometrends.com';
    const currentDate = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/products`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/faq`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/shipping`, priority: '0.75', changefreq: 'monthly' },
      { loc: `${baseUrl}/track-order`, priority: '0.6', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    for (const r of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${r.loc}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const cat of categories) {
      const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/category/${encodeURIComponent(slug)}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      if (cat.image) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${cat.image.replace(/&/g, '&amp;')}</image:loc>\n`;
        xml += `      <image:title>${cat.name.replace(/&/g, '&amp;')} Tableware</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    for (const prod of products) {
      const id = prod._id || prod.id;
      const imageUrl = prod.images && prod.images.length > 0 ? prod.images[0] : '';
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${id}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      if (imageUrl) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${imageUrl.replace(/&/g, '&amp;')}</image:loc>\n`;
        xml += `      <image:title>${(prod.name || 'MS Home Trends Product').replace(/&/g, '&amp;')}</image:title>\n`;
        xml += `      <image:caption>${(prod.material || 'Luxury Fine Bone China').replace(/&/g, '&amp;')}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err: any) {
    console.error('[SEO Controller - Sitemap Error]', err);
    res.status(500).send('Error generating sitemap XML');
  }
};

/**
 * SERVE robots.txt
 * Route: GET /robots.txt
 */
export const getRobotsTxt = (_req: Request, res: Response): void => {
  const robotsTxtPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsTxtPath)) {
    res.sendFile(robotsTxtPath);
  } else {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: https://mshometrends.com/sitemap.xml\n`);
  }
};

/**
 * SERVE llms.txt (GEO & AEO optimization)
 * Route: GET /llms.txt
 */
export const getLlmsTxt = (_req: Request, res: Response): void => {
  const llmsTxtPath = path.join(process.cwd(), 'public', 'llms.txt');
  if (fs.existsSync(llmsTxtPath)) {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(llmsTxtPath);
  } else {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(`# MS Home Trends - Luxury Crockery Brand\nhttps://mshometrends.com\n`);
  }
};
