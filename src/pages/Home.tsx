import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { HeroSlider } from '../components/HeroSlider';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { FeaturedCollections } from '../components/FeaturedCollections';
import { CircularCategories } from '../components/CircularCategories';
import { InstagramGallery } from '../components/InstagramGallery';
import { TestimonialsSlider } from '../components/TestimonialsSlider';
import { AboutBrandSection } from '../components/AboutBrandSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Newsletter } from '../components/Newsletter';
import { buildStoreOrganizationSchema, buildWebSiteSchema } from '../utils/seoSchemas';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A3825]">
      <SEOHead
        title="Luxury Fine Bone China, Gold Tableware & Imperial Dinner Sets"
        description="Explore Pakistan's most prestigious luxury crockery boutique. Discover handcrafted 24K gold-gilded bone china dinner sets, royal tea sets, porcelain tableware, and designer cutlery with nationwide break-safe delivery."
        keywords="luxury crockery Pakistan, fine bone china dinner sets, 24k gold tableware, porcelain tea sets, royal dinner sets Karachi, luxury home decor Pakistan, MS Home Trends, wedding gift crockery, premium cutlery"
        canonicalUrl="/"
        jsonLd={[buildStoreOrganizationSchema(), buildWebSiteSchema()]}
      />
      
      {/* 1. Modern Boutique Hero Card & Explore Stories */}
      <HeroSlider />

      {/* 2. Bestselling Products Carousel (Exact Mockup Product Card Layout) */}
      <FeaturedProducts />

      {/* 3. Split Editorial Stories: 'Best sellers' & 'New Arrival' */}
      <FeaturedCollections />

      {/* 4. Curated Category Departments */}
      <CircularCategories />

      {/* 5. Inspiration & Table-Setting Lookbook Gallery */}
      <InstagramGallery />

      {/* 6. Rating Metric (4.9/5) & Verified Testimonial Slider */}
      <TestimonialsSlider />

      {/* 7. Large Visual Architectural Banner & Inline Badges Statement */}
      <AboutBrandSection />

      {/* 8. Trust, Craftsmanship & Nationwide Delivery Guarantee */}
      <WhyChooseUs />

      {/* 9. VIP Concierge & Newsletter */}
      <Newsletter />
    </div>
  );
};
