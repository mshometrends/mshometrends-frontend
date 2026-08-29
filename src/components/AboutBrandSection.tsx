import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { motion } from 'motion/react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80';

export const AboutBrandSection: React.FC = () => {
  const { navigateToPage } = useStore();

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-stone-200 overflow-hidden w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-12">
        
        {/* Large Architectural Kitchen & Dining Visual Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-200 h-[320px] sm:h-[460px] lg:h-[520px] group bg-stone-900"
        >
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury Kitchen & Dining Interior"
            referrerPolicy="no-referrer"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
            className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Floating Aesthetic Overlay */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="max-w-md">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                Artisanal Living
              </span>
              <h3 className="text-xl sm:text-3xl font-light font-serif text-white mt-1">
                Where Culinary Art Meets Imperial Heritage
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateToPage('about')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A3825] text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#0A3825] transition-all shadow-lg self-start sm:self-auto cursor-pointer"
            >
              <span>Our Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Editorial Text Statement with Inline Badges (Mockup Bottom Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center py-4 sm:py-6 px-2 sm:px-4"
        >
          <p className="text-base sm:text-2xl lg:text-3xl font-light text-[#0A3825] leading-relaxed sm:leading-loose tracking-tight">
            Discover our commitment to{' '}
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#F0ECE1] border border-stone-300 text-[11px] sm:text-sm font-semibold align-middle text-[#0A3825] my-0.5">
              <Gem className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#D4AF37]" />
              <span>pure bone china</span>
            </span>{' '}
            materials, low-impact artisan production, and{' '}
            <span className="font-serif italic font-normal text-[#B45309]">
              royal dining
            </span>{' '}
            partnerships — all crafted to support a luxury home and a{' '}
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#0A3825] text-amber-200 text-[11px] sm:text-sm font-semibold align-middle shadow-xs my-0.5">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300" />
              <span>radiant dinner table</span>
            </span>
            .
          </p>
        </motion.div>

      </div>
    </section>
  );
};
