import { Product, Category, Review } from '../types';

export const SITE_URL = 'https://mshometrends.com';
export const BRAND_NAME = 'MS Home Trends';
export const STORE_PHONE = '+92 300 1234567';
export const STORE_EMAIL = 'support@mshometrends.com';

/**
 * Organization & LocalBusiness & OnlineStore Schema (SEO, AEO, GEO)
 * Grounding entity data for search engines, AI answer engines, and generative models.
 */
export const buildStoreOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': ['OnlineStore', 'LocalBusiness', 'Organization'],
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    legalName: 'MS Home Trends Luxury Tableware Ltd.',
    alternateName: ['MS Crockery', 'MS Home Trends Pakistan', 'MS Luxury Dining'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/logo.png`,
      caption: 'MS Home Trends Luxury Crockery Brand',
      width: 512,
      height: 512,
    },
    image: [
      'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'MS Home Trends is Pakistan’s premier luxury crockery brand, specializing in 24K gold-gilded fine bone china dinner sets, porcelain tableware, royal tea sets, handcrafted cutlery, and designer home decor.',
    telephone: STORE_PHONE,
    email: STORE_EMAIL,
    priceRange: '$$ - $$$',
    currenciesAccepted: 'USD, PKR, AED, EUR, GBP',
    paymentAccepted: 'EasyPaisa, Cash on Delivery',
    foundingDate: '2018',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Boulevard, Phase 6, DHA',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      postalCode: '75500',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.8607,
      longitude: 67.0011,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '22:00',
      },
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'Pakistan',
      },
      {
        '@type': 'City',
        name: 'Karachi',
      },
      {
        '@type': 'City',
        name: 'Lahore',
      },
      {
        '@type': 'City',
        name: 'Islamabad',
      },
      {
        '@type': 'City',
        name: 'Rawalpindi',
      },
      {
        '@type': 'Country',
        name: 'United Arab Emirates',
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'PK',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
    sameAs: [
      'https://www.facebook.com/mshometrends',
      'https://www.instagram.com/mshometrends',
      'https://twitter.com/mshometrends',
      'https://pinterest.com/mshometrends',
      'https://youtube.com/@mshometrends',
    ],
  };
};

/**
 * WebSite Schema with Sitelinks SearchBox (SEO / AEO)
 */
export const buildWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    description: 'Luxury Fine Bone China, Gold Tableware & Fine Crockery Collections',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Product Schema (SEO, AEO, GEO)
 * Full rich snippet schema for Google Merchant, AI Answer Engines (Perplexity, ChatGPT, Gemini)
 */
export const buildProductSchema = (product: Product, reviews: Review[] = []) => {
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop';

  const productReviews = reviews.filter(
    (r) => (r.productId === product.id || r.productId === product.sku) && r.approved !== false
  );

  const reviewObjects = productReviews.map((rev) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: rev.userName || 'Verified Buyer',
    },
    datePublished: rev.date ? new Date(rev.date).toISOString().split('T')[0] : '2026-01-15',
    reviewBody: rev.comment || 'Exceptional craftsmanship and pristine gold finish.',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rev.rating || 5,
      bestRating: '5',
      worstRating: '1',
    },
  }));

  const ratingValue =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / productReviews.length
        ).toFixed(1)
      : product.rating
      ? product.rating.toFixed(1)
      : '5.0';

  const reviewCount = productReviews.length > 0 ? productReviews.length : product.reviewCount || 1;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [imageUrl],
    description:
      product.description ||
      `Experience regal luxury with ${product.name}, handcrafted with premium ${product.material || 'Fine Bone China'} and 24K gold gilding.`,
    sku: product.sku || `MS-${product.id}`,
    mpn: `MPN-${product.sku || product.id}`,
    category: product.category,
    material: product.material || 'Fine Bone China',
    color: product.color || 'White & Gold',
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: BRAND_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.inStock && (product.stockQuantity ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '5.00',
          currency: 'USD',
        },
        shippingDestination: [
          {
            '@type': 'DefinedRegion',
            addressCountry: 'PK',
          },
        ],
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    ...(reviewObjects.length > 0 ? { review: reviewObjects } : {}),
  };
};

/**
 * FAQPage Schema for Answer Engine Optimization (AEO)
 * Allows Gemini, ChatGPT, Perplexity & Google SGE to pull direct answers.
 */
export const buildFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
};

/**
 * BreadcrumbList Schema (SEO / Navigation Hierarchy)
 */
export const buildBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
};

/**
 * CollectionPage Schema (Category & Shop Pages)
 */
export const buildCollectionSchema = (
  categoryName: string,
  description: string,
  products: Product[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Luxury Collection | MS Home Trends`,
    description: description,
    url: `${SITE_URL}/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 12).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/product/${p.id}`,
        name: p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : undefined,
      })),
    },
  };
};
