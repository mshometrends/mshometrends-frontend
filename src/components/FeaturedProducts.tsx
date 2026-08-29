import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedProducts: React.FC = () => {
  const { products, isProductsLoading, navigateToPage } = useStore();
  const [filterTab, setFilterTab] = useState<'bestsellers' | 'new' | 'featured' | 'all'>('bestsellers');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    if (filterTab === 'bestsellers') return Boolean(p.isBestSeller || p.isBestseller);
    if (filterTab === 'new') return Boolean(p.isNewArrival);
    if (filterTab === 'featured') return Boolean(p.isFeatured || p.featured);
    return true;
  });

  const displayList = filtered.length > 0 ? filtered : products;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 sm:py-18 bg-[#FAF9F6] border-b border-stone-200 w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Curated Tableware & Fine Dining
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-light text-[#0A3825] mt-0.5">
              Bestselling <span className="font-serif italic font-normal text-[#0A3825]">Products</span>
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F0ECE1] rounded-full border border-stone-200/80 overflow-x-auto max-w-full scrollbar-none">
              <button
                onClick={() => setFilterTab('bestsellers')}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                  filterTab === 'bestsellers'
                    ? 'bg-[#0A3825] text-amber-200 shadow-sm'
                    : 'text-stone-600 hover:text-[#0A3825]'
                }`}
              >
                Bestselling
              </button>
              <button
                onClick={() => setFilterTab('new')}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                  filterTab === 'new'
                    ? 'bg-[#0A3825] text-amber-200 shadow-sm'
                    : 'text-stone-600 hover:text-[#0A3825]'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilterTab('featured')}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                  filterTab === 'featured'
                    ? 'bg-[#0A3825] text-amber-200 shadow-sm'
                    : 'text-stone-600 hover:text-[#0A3825]'
                }`}
              >
                Featured
              </button>
            </div>

            {/* More Products Button */}
            <button
              onClick={() => navigateToPage('products')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A3825] hover:text-[#B45309] transition-colors group cursor-pointer shrink-0"
            >
              <span>More products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative group/carousel">
          {/* Arrow Left */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 shadow-md text-[#0A3825] hover:bg-[#0A3825] hover:text-amber-200 items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            aria-label="Previous Products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 shadow-md text-[#0A3825] hover:bg-[#0A3825] hover:text-amber-200 items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            aria-label="Next Products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Product Grid / Slider */}
          {isProductsLoading ? (
            <ProductGridSkeleton count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" />
          ) : (
            <div
              ref={scrollContainerRef}
              className="grid grid-flow-col auto-cols-[260px] sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {displayList.slice(0, 8).map((product, idx) => (
                <div key={product.id || idx} className="snap-start w-[260px] sm:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={() => navigateToPage('products')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A3825] text-amber-200 text-xs font-semibold"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
