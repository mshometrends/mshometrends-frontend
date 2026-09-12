import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';

export const InstagramGallery: React.FC = () => {
  const { navigateToPage } = useStore();
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    {
      id: 1,
      title: 'SizzlePro Ceramic Pan',
      subtitle: 'Imperial Cookware',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
      category: 'cookware',
    },
    {
      id: 2,
      title: 'Grain Slice Board Duo',
      subtitle: 'Artisan Walnut Board',
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      category: 'accessories',
    },
    {
      id: 3,
      title: 'Artisan Utensil Set',
      subtitle: 'Organic Handcrafted',
      image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80',
      category: 'cutlery',
    },
    {
      id: 4,
      title: 'Glow Pot Ceramic',
      subtitle: 'Warm Bone China',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      category: 'dinner-sets',
    },
    {
      id: 5,
      title: 'StoneSip Ceramic Cup',
      subtitle: 'Royal Teaware',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
      category: 'tea-sets',
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = 300;
      galleryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-[#FAF9F6] border-b border-stone-200 w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Curated Visual Lookbook
            </span>
            <h2 className="text-xl sm:text-3xl font-light text-[#0A3825] mt-0.5">
              Thoughtful, Table-Setting Ideas and Inspiration{' '}
              <span className="font-serif italic font-normal text-[#0A3825]">Gallery</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200 hover:border-[#0A3825] flex items-center justify-center text-[#0A3825] transition-all shadow-xs cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200 hover:border-[#0A3825] flex items-center justify-center text-[#0A3825] transition-all shadow-xs cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Grid / Horizontal Scroller */}
        <div
          ref={galleryScrollRef}
          className="grid grid-flow-col auto-cols-[200px] sm:auto-cols-[260px] lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              onClick={() => navigateToPage('products')}
              className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 snap-start border border-stone-200 bg-stone-100"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Overlay Pill Tag with Title */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                  <span className="text-[10px] text-amber-200 block font-light tracking-wide">
                    {item.subtitle}
                  </span>
                  <h4 className="text-xs sm:text-sm font-medium text-white font-serif mt-0.5 line-clamp-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
