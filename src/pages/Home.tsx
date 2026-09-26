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
import { HomeFAQSection } from '../components/HomeFAQSection';
import { Newsletter } from '../components/Newsletter';
import {
  buildStoreOrganizationSchema,
  buildWebSiteSchema,
  buildSiteNavigationElementSchema,
  buildCoreStoreFaqSchema,
} from '../utils/seoSchemas';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A3825]">
      <SEOHead
        title="MS Home Trends | Crockery, Kitchen & Home Essentials"
        description="Shop crockery, kitchen tools, drinkware, home décor and everyday essentials at MS Home Trends. Explore quality products at reasonable prices with convenient online ordering."
        keywords="crockery, kitchen tools, drinkware, water bottles, home decor, dinner sets, tea sets, cutlery, household essentials, MS Home Trends"
        canonicalUrl="/"
        jsonLd={[
          buildStoreOrganizationSchema(),
          buildWebSiteSchema(),
          buildSiteNavigationElementSchema(),
          buildCoreStoreFaqSchema(),
        ]}
      />
      
      {/* 1. Boutique Hero with H1 Crockery, Kitchen & Home Essentials */}
      <HeroSlider />

      {/* 2. Bestselling Products Carousel */}
      <FeaturedProducts />

      {/* 3. Split Editorial Stories */}
      <FeaturedCollections />

      {/* 4. Curated Category Departments */}
      <CircularCategories />

      {/* 5. Inspiration Lookbook Gallery */}
      <InstagramGallery />

      {/* 6. Rating Metric & Verified Testimonial Slider */}
      <TestimonialsSlider />

      {/* 7. Brand Introduction & Natural Context */}
      <AboutBrandSection />

      {/* 8. Trust, Value & Nationwide Delivery Guarantee */}
      <WhyChooseUs />

      {/* 9. Answer Engine Optimized (AEO) Core FAQs */}
      <HomeFAQSection />

      {/* 10. Customer Support & Newsletter */}
      <Newsletter />
    </div>
  );
};
