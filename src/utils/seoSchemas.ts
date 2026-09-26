import { Product, Category, Review } from '../types';

export const SITE_URL = 'https://mshometrends.com';
export const BRAND_NAME = 'MS Home Trends';
export const STORE_PHONE = '+92 314 3015526';
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
    legalName: 'MS Home Trends',
    alternateName: ['MS Home Trends Pakistan', 'MS Home Trends Store'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/logo.png`,
      caption: 'MS Home Trends',
      width: 512,
      height: 512,
    },
    image: [
      'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'MS Home Trends is an online store offering quality crockery, kitchen tools, drinkware, water bottles, home décor, and everyday household essentials at reasonable prices with reliable home delivery.',
    telephone: STORE_PHONE,
    email: STORE_EMAIL,
    priceRange: '$$ - $$$',
    currenciesAccepted: 'USD, PKR, AED, EUR, GBP',
    paymentAccepted: 'EasyPaisa, Cash on Delivery',
    foundingDate: '2020',
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
      'https://www.instagram.com/mshometrends/',
      'https://www.facebook.com/profile.php?id=61593053754921',
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
    description: 'Crockery, Kitchen Tools, Drinkware & Home Essentials | MS Home Trends',
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
 * SiteNavigationElement Schema (Critical for Google Sitelinks Generation)
 */
export const buildSiteNavigationElementSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'All Products',
        description: 'Explore our complete catalog of luxury dinnerware and tableware',
        url: `${SITE_URL}/products`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Imperial Dinner Sets',
        description: 'Handcrafted 24K gold-gilded fine bone china dinner sets',
        url: `${SITE_URL}/category/dinner-sets`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Royal Tea Sets',
        description: 'Luxury porcelain and bone china tea and coffee sets',
        url: `${SITE_URL}/category/tea-sets`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Designer Cutlery',
        description: 'Premium gold-plated and mirror polished silverware',
        url: `${SITE_URL}/category/cutlery`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Crystal Glassware',
        description: 'Hand-blown crystal goblets, tumblers and decanters',
        url: `${SITE_URL}/category/glassware`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'Our Heritage',
        description: 'About MS Home Trends craftsmanship, quality and warranty',
        url: `${SITE_URL}/about`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 7,
        name: 'Track Order',
        description: 'Live order tracking with express nationwide delivery across Pakistan',
        url: `${SITE_URL}/track-order`,
      },
    ],
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
 * Core Store FAQs optimized for Answer Engine Optimization (AEO)
 * Direct, factual, human-written answers to common questions for Google AI Overviews, Gemini, ChatGPT & Perplexity.
 */
export const CORE_STORE_FAQS = [
  {
    question: 'What is MS Home Trends?',
    answer:
      'MS Home Trends is an online store offering quality crockery, kitchen tools, drinkware, home décor, and everyday household essentials at reasonable prices with reliable home delivery.',
  },
  {
    question: 'What products does MS Home Trends sell?',
    answer:
      'MS Home Trends sells crockery (including dinner sets, tea sets, plates, and bowls), kitchen tools, utensils, drinkware, water bottles, home décor items, and practical household essentials.',
  },
  {
    question: 'Where can I buy crockery online?',
    answer:
      'You can buy crockery online directly through our store. Browse dinnerware collections, select your items, and place your order online with convenient payment methods and home delivery.',
  },
  {
    question: 'What kitchen essentials are available at MS Home Trends?',
    answer:
      'MS Home Trends offers kitchen tools, food preparation gadgets, cookware accessories, cutlery, serving platters, and storage organizers designed for convenient everyday home cooking.',
  },
  {
    question: 'Does MS Home Trends offer home delivery?',
    answer:
      'Yes, MS Home Trends provides reliable nationwide home delivery across Pakistan. Orders are carefully packaged to ensure safe transit directly to your doorstep.',
  },
  {
    question: 'How can I order from MS Home Trends?',
    answer:
      'Ordering is simple: browse products on our website, add desired items to your cart, proceed to checkout, enter your delivery address, choose your payment method (such as Cash on Delivery or EasyPaisa), and confirm your order.',
  },
  {
    question: 'What types of drinkware are available?',
    answer:
      'MS Home Trends features a variety of drinkware including durable water bottles, mugs, tea cups, glassware, and insulated tumblers suitable for hot and cold beverages.',
  },
  {
    question: 'Where can I find affordable home and kitchen products?',
    answer:
      'MS Home Trends offers an extensive selection of affordable, high-value home and kitchen products online, balancing dependable quality with accessible pricing.',
  },
];

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

export const buildCoreStoreFaqSchema = () => buildFAQSchema(CORE_STORE_FAQS);

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
