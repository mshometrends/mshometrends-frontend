import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Gem, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedCollections: React.FC = () => {
  const { navigateToPage } = useStore();

  return (
    <section className="py-12 sm:py-24 bg-[#FAF9F6] border-b border-stone-200 overflow-hidden w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-14 sm:space-y-28">

        {/* Story 1: Best Sellers (Text on Left, 4-Image Collage on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-4 sm:space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0ECE1] text-[#0A3825] text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Timeless Craftsmanship</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-[#0A3825] leading-tight">
              Best <span className="font-serif italic font-normal text-[#0A3825]">sellers</span>
            </h2>

            <p className="text-stone-600 font-light text-xs sm:text-base leading-relaxed max-w-md">
              A polished 24K gold dinner set rests on a banquet table, encircled by fresh florals — a perfect blend of durability, heirloom quality, and nature for mindful cooking and hosting.
            </p>

            <div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateToPage('products')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0A3825] text-amber-200 text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#0A3825] transition-all shadow-md cursor-pointer group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image Showcase (Mosaic Style) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-4"
          >
            <div className="space-y-2.5 sm:space-y-4">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group relative h-36 sm:h-64 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop"
                  alt="Fine Dining Bowls"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group relative h-32 sm:h-52 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop"
                  alt="Royal Tea Cups"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-4 pt-4 sm:pt-6">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group relative h-32 sm:h-52 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=600&auto=format&fit=crop"
                  alt="Gold Plated Dinnerware"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group relative h-36 sm:h-64 border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop"
                  alt="Crystal Glassware"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story 2: New Arrival (Showcase Image on Left, Text on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 sm:pt-8">
          
          {/* Left Large Showcase Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-200 aspect-[4/3] group">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1000&auto=format&fit=crop"
                alt="New Arrival Tableware"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating Pill Tag */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-200 shadow-md">
                <span className="text-[11px] sm:text-xs font-semibold text-[#0A3825] flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Imperial 24K Gold Inlay Edition
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-4 sm:space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0ECE1] text-[#0A3825] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>Seasonal Highlight</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-[#0A3825] leading-tight">
              New <span className="font-serif italic font-normal text-[#0A3825]">Arrival</span>
            </h2>

            <p className="text-stone-600 font-light text-xs sm:text-base leading-relaxed max-w-md">
              Our Imperial Steamer & Tableware showcases a colorful array of fresh, artisanal ceramics — a vibrant celebration of zero-compromise luxury and royal kitchen practices.
            </p>

            <div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateToPage('products')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0A3825] text-amber-200 text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#0A3825] transition-all shadow-md cursor-pointer group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
