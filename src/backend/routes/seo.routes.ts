import { Router } from 'express';
import {
  getSitemapXml,
  getRobotsTxt,
  getLlmsTxt,
} from '../controllers/seo.controller.js';

export const seoRouter = Router();

// Discovery & SEO Endpoints
seoRouter.get('/sitemap.xml', getSitemapXml);
seoRouter.get('/robots.txt', getRobotsTxt);
seoRouter.get('/llms.txt', getLlmsTxt);
