import React from 'react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { buildBreadcrumbSchema, buildStoreOrganizationSchema } from '../utils/seoSchemas';
import { Gem, Award, ShieldCheck, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { navigateToPage } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-16">
      <SEOHead
        title="About Us - Fine Bone China Heritage & Craftsmanship"
        description="Learn the heritage behind MS Home Trends. Handcrafting 45% fine bone china tableware, 24K liquid gold gilding, and chip-resistant luxury crockery with zero-breakage nationwide shipping."
        keywords="about MS Home Trends, fine bone china craftsmanship, 24k gold tableware maker, luxury crockery heritage, dinnerware manufacturer Pakistan"
        canonicalUrl="/about"
        jsonLd={[
          buildStoreOrganizationSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'About Our Heritage', url: '/about' },
          ]),
        ]}
      />

      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0A3825]/10 border border-[#0A3825]/20 text-[#0A3825] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            Our Heritage & Story
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-title font-bold text-[#0A3825] tracking-tight">
            Crafting Extraordinary Tableware Since 1994
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            From our founding atelier in Stoke-on-Trent to luxury dining rooms across London, Paris, and New York, <strong className="text-[#0A3825] font-semibold">MS Home Trends</strong> merges centuries-old ceramic traditions with clean modern elegance.
          </p>
        </div>

        {/* Feature Image & Craftsmanship Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan Crafting Crockery"
              referrerPolicy="no-referrer"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-serif-title font-bold text-[#0A3825] leading-tight">
              The Art of 45% Fine Bone Translucency
            </h2>

            <p className="text-sm text-slate-600 font-light leading-relaxed">
              True bone china is revered for its high mechanical strength, chip resistance, and delicate ivory translucency. At MS Home Trends, every piece contains at least 45% refined bone ash sourced ethically, kiln-fired at 1280°C to achieve a glass-like ring when gently tapped.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0A3825]">24K Liquid Gold Gilding</h4>
                  <p className="text-xs text-slate-500">Applied by hand using precision camel hair brushes and burnished with agate stone.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#0A3825]">Lead-Free Non-Toxic Glazes</h4>
                  <p className="text-xs text-slate-500">100% food safe, acid-resistant glazes formulated for modern dining.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0A3825]/5 border border-[#0A3825]/15 flex items-center justify-center text-[#0A3825]">
              <Gem className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">Unrivaled Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tested rigorously for thermal resistance, dishwasher durability, and chip resistance under real dining conditions.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0A3825]/5 border border-[#0A3825]/15 flex items-center justify-center text-[#0A3825]">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">Artisanal Heritage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Master artisans oversee each firing cycle, ensuring every glaze achieves high luster and timeless depth.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0A3825]/5 border border-[#0A3825]/15 flex items-center justify-center text-[#0A3825]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">Break-Safe Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Custom-molded EPS foam inserts ensure your precious tableware arrives in pristine condition.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#0A3825] rounded-3xl p-10 text-center space-y-6 text-white border border-[#D4AF37]/30 shadow-xl">
          <h3 className="text-2xl sm:text-4xl font-serif-title font-bold">
            Bring Luxury Dining to Your Table
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            Explore our curated collections of Imperial dinner sets, royal teaware, and gold-accented cutlery.
          </p>
          <button
            onClick={() => navigateToPage('products')}
            className="px-8 py-3.5 bg-[#D4AF37] hover:bg-amber-400 text-[#0A3825] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
          >
            Explore Tableware Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
