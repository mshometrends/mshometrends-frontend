import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const LatestCollectionGrid: React.FC = () => {
  const { navigateToPage } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-slate-200 w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-[#B45309]">
            Artistic Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#0A3825]">
            The Sovereign Collection
          </h2>
          <p className="text-sm text-slate-600 font-light">
            An exploration of organic textures, pure 24k gilding, and hand-spun ceramic forms.
          </p>
        </div>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigateToPage('category', 'dinner-sets')}
            className="md:col-span-2 relative h-96 rounded-3xl overflow-hidden group cursor-pointer border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1200&auto=format&fit=crop"
              alt="Dinner Sets"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3825]/90 via-[#0A3825]/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Fine Bone China
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-white">
                  Empress Royal Gold Banquet Sets
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 font-light max-w-md">
                  Complete 24-piece dining suites hand-finished with 24k leaf rims.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0A3825] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg font-bold">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Tea & Coffee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onClick={() => navigateToPage('category', 'tea-sets')}
            className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop"
              alt="Tea Sets"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3825]/90 via-[#0A3825]/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Artisanal Tea
                </span>
                <h3 className="text-xl font-serif-title font-bold text-white">
                  Kyoto Stoneware Sets
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0A3825] text-amber-300 flex items-center justify-center border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-[#0A3825] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Stemware */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => navigateToPage('category', 'glassware')}
            className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop"
              alt="Glassware"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3825]/90 via-[#0A3825]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Crystalware
                </span>
                <h3 className="text-lg font-serif-title font-bold text-white">
                  Sommelier Stemware
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0A3825] text-amber-300 flex items-center justify-center border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-[#0A3825] transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Serving Trays */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onClick={() => navigateToPage('category', 'serving-trays')}
            className="md:col-span-2 relative h-80 rounded-3xl overflow-hidden group cursor-pointer border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
              alt="Serving Trays"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3825]/90 via-[#0A3825]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Marble & Brass
                </span>
                <h3 className="text-xl font-serif-title font-bold text-white">
                  Carrara Italian Marble Platters
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0A3825] text-amber-300 flex items-center justify-center border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-[#0A3825] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
