import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';
import { SEOHead } from '../components/SEOHead';
import { buildCollectionSchema, buildBreadcrumbSchema } from '../utils/seoSchemas';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { selectedCategorySlug, categories, products, isProductsLoading, navigateToPage } = useStore();

  const activeCategory =
    categories.find(
      (c) =>
        c.slug === selectedCategorySlug ||
        c.name.toLowerCase().replace(/\s+/g, '-') === selectedCategorySlug?.toLowerCase()
    ) || categories[0];

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === activeCategory?.name.toLowerCase()
  );

  const categorySlug = activeCategory?.slug || activeCategory?.name.toLowerCase().replace(/\s+/g, '-');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/products' },
    { name: activeCategory?.name || 'Category', url: `/category/${categorySlug}` },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 text-slate-800">
      {activeCategory && (
        <SEOHead
          title={`${activeCategory.name} Luxury Crockery & Tableware Sets`}
          description={
            activeCategory.description ||
            `Shop premium ${activeCategory.name} tableware at MS Home Trends. Handcrafted fine bone china with 24K gold accents and nationwide delivery across Pakistan.`
          }
          keywords={`${activeCategory.name}, luxury ${activeCategory.name}, fine bone china, 24k gold tableware, MS Home Trends Pakistan`}
          canonicalUrl={`/category/${categorySlug}`}
          ogImage={activeCategory.image}
          jsonLd={[
            buildCollectionSchema(activeCategory.name, activeCategory.description || '', categoryProducts),
            buildBreadcrumbSchema(breadcrumbs),
          ]}
        />
      )}

      {/* Category Hero Header */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-[#0A3825] border-b border-[#D4AF37]/30">
        <img
          src={activeCategory?.image || 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop'}
          alt={`${activeCategory?.name || 'Category'} - Luxury Tableware Collection`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3825] via-[#0A3825]/60 to-transparent" />

        <div className="absolute inset-0 max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 flex flex-col justify-end pb-10">
          <button
            onClick={() => navigateToPage('products')}
            className="inline-flex items-center gap-2 text-xs text-amber-300 hover:text-white font-bold mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Collections
          </button>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" /> Curated Category
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-white">
              {activeCategory?.name}
            </h1>
            {activeCategory?.description && (
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-light leading-relaxed">
                {activeCategory.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Products */}
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-12">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <span className="text-xs text-slate-600 font-medium">
            Showing {categoryProducts.length} curated pieces in <strong>{activeCategory?.name}</strong>
          </span>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Breakage Guaranteed Delivery</span>
          </div>
        </div>

        {isProductsLoading ? (
          <ProductGridSkeleton count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" />
        ) : categoryProducts.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <p className="text-slate-500 text-sm">
              New artisanal pieces are arriving shortly for {activeCategory?.name}.
            </p>
            <button
              onClick={() => navigateToPage('products')}
              className="px-6 py-2.5 bg-[#0A3825] text-white text-xs font-semibold rounded-xl hover:bg-[#062418] transition-colors cursor-pointer"
            >
              Browse Other Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((prod, idx) => (
              <ProductCard key={prod.id || prod._id ? `${prod.id || prod._id}-${idx}` : `cat-prod-${idx}`} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
