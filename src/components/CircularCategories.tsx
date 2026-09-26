import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const CircularCategories: React.FC = () => {
  const { categories, products, navigateToPage } = useStore();

  const dynamicCatCount = (catName: string, catSlug?: string, fallback = 0) => {
    const match = products.filter((p) => {
      const pCat = (p.category || '').trim().toLowerCase();
      const pCatSlug = pCat.replace(/\s+/g, '-');
      const cName = (catName || '').trim().toLowerCase();
      const cSlug = (catSlug || cName.replace(/\s+/g, '-')).toLowerCase();
      return pCat === cName || pCatSlug === cSlug;
    }).length;
    return match > 0 ? match : fallback;
  };

  return (
    <section className="py-10 sm:py-16 bg-[#FAF9F6] border-b border-stone-200 w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Curated Departments
            </span>
            <h2 className="text-xl sm:text-3xl font-light text-[#0A3825] mt-0.5">
              Explore By <span className="font-serif italic font-normal text-[#0A3825]">Category</span>
            </h2>
          </div>

          <button
            onClick={() => navigateToPage('products')}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-[#0A3825] hover:text-[#B45309] transition-colors group cursor-pointer"
          >
            <span>All Categories ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Container - Balanced grid & smooth mobile scrolling */}
        {categories.length > 0 ? (
          <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat, idx) => {
              const count = dynamicCatCount(cat.name, cat.slug, cat.itemCount || 0);
              const isWaterBottle = (cat.slug || '').toLowerCase().includes('water-bottle') || (cat.name || '').toLowerCase().includes('water');
              return (
                <motion.div
                  key={cat.id || cat._id ? `${cat.id || cat._id}-${idx}` : `circ-cat-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03, duration: 0.35 }}
                  onClick={() => navigateToPage('category', cat.slug)}
                  className="flex-shrink-0 snap-center w-24 sm:w-28 flex flex-col items-center group cursor-pointer"
                >
                  <div className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 transition-all duration-300 shadow-xs border ${
                    isWaterBottle
                      ? 'bg-emerald-100/60 border-emerald-400 group-hover:border-[#0A3825] ring-2 ring-[#D4AF37]/40'
                      : 'bg-[#F0ECE1] group-hover:bg-[#0A3825] border-stone-200 group-hover:border-[#D4AF37]'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80'; }}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      />
                    </div>
                    {isWaterBottle && (
                      <span className="absolute -top-1 -right-1 text-[8px] font-extrabold uppercase bg-[#D4AF37] text-[#0A3825] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                        NEW
                      </span>
                    )}
                  </div>

                  <span className="mt-2.5 text-xs font-semibold text-[#0A3825] group-hover:text-[#B45309] transition-colors text-center line-clamp-1">
                    {cat.name}
                  </span>
                  <span className={`text-[10px] font-medium ${isWaterBottle ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center bg-white rounded-2xl border border-stone-200/80 p-6">
            <p className="text-xs text-stone-500">Categories will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
};
