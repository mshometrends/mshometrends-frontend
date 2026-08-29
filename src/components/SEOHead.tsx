import React, { useEffect } from 'react';
import { SITE_URL, BRAND_NAME, buildStoreOrganizationSchema, buildWebSiteSchema } from '../utils/seoSchemas';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  jsonLd?: object | object[];
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'MS Home Trends offers Pakistan’s finest luxury crockery, 24K gold-gilded bone china dinner sets, porcelain tea sets, handcrafted cutlery, and royal tableware with nationwide express delivery.',
  keywords = 'luxury crockery, bone china dinner sets, 24k gold tableware, porcelain tea sets, dinnerware Pakistan, luxury crockery Karachi, royal dining sets, MS Home Trends, wedding gift crockery, handcrafted cutlery',
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop',
  ogType = 'website',
  jsonLd,
  noIndex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${BRAND_NAME} - Luxury Tableware & Crockery`
    : `${BRAND_NAME} | Premium Luxury Crockery, 24K Gold Bone China & Dinner Sets`;

  const currentCanonical = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${SITE_URL}${canonicalUrl}`
    : typeof window !== 'undefined'
    ? window.location.href
    : SITE_URL;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', currentCanonical);

    // Standard SEO Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', 'MS Home Trends');
    setMetaTag(
      'name',
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // AEO & Generative Search Signals
    setMetaTag('name', 'revisit-after', '3 days');
    setMetaTag('name', 'rating', 'General');
    setMetaTag('name', 'distribution', 'Global');
    setMetaTag('name', 'coverage', 'Worldwide');

    // GEO / Local Geographic Meta Tags (Pakistan & Global Luxury Tableware)
    setMetaTag('name', 'geo.region', 'PK-SD');
    setMetaTag('name', 'geo.placename', 'Karachi, Sindh, Pakistan');
    setMetaTag('name', 'geo.position', '24.8607;67.0011');
    setMetaTag('name', 'ICBM', '24.8607, 67.0011');

    // OpenGraph / Facebook Tags
    setMetaTag('property', 'og:site_name', BRAND_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:locale', 'en_PK');
    setMetaTag('property', 'og:locale:alternate', 'en_US');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@mshometrends');
    setMetaTag('name', 'twitter:creator', '@mshometrends');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // JSON-LD Structured Data Injection
    const scriptId = 'seo-json-ld-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    // Combine base organization/website schema with custom page schemas (Product, FAQ, Breadcrumbs)
    const baseSchemas = [buildStoreOrganizationSchema(), buildWebSiteSchema()];
    const customSchemas = Array.isArray(jsonLd)
      ? jsonLd
      : jsonLd
      ? [jsonLd]
      : [];

    const fullSchemaPayload =
      customSchemas.length > 0
        ? {
            '@context': 'https://schema.org',
            '@graph': [...baseSchemas, ...customSchemas],
          }
        : {
            '@context': 'https://schema.org',
            '@graph': baseSchemas,
          };

    scriptTag.text = JSON.stringify(fullSchemaPayload, null, 2);
  }, [fullTitle, description, keywords, currentCanonical, ogImage, ogType, jsonLd, noIndex]);

  return null;
};
