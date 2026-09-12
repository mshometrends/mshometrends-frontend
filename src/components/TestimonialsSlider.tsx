import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const TestimonialsSlider: React.FC = () => {
  const { reviews } = useStore();
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const approvedReviews = reviews.filter((r) => r.approved !== false && r.comment);

  const handleScroll = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 300;
      reviewsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-stone-200 overflow-hidden w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Rating Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 bg-[#F2EDE2] rounded-3xl p-8 flex flex-col justify-between border border-stone-200/80 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-[#D4AF37]" />
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-light font-serif text-[#0A3825]">
                  4.9
                </span>
                <span className="text-xl font-light text-stone-500">/ 5</span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs font-semibold text-[#0A3825] uppercase tracking-wider">
                More than 25,000
              </p>
              <p className="text-sm sm:text-base text-stone-700 font-light leading-relaxed">
                5-Star Reviews for Our Award-Winning Luxury Dining Sets & Tableware
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-300/60 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Verified Buyers</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll('left')}
                  className="w-8 h-8 rounded-full bg-white border border-stone-300 hover:border-[#0A3825] flex items-center justify-center text-[#0A3825] transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="w-8 h-8 rounded-full bg-white border border-stone-300 hover:border-[#0A3825] flex items-center justify-center text-[#0A3825] transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Horizontal Review Cards Scroller */}
          <div className="lg:col-span-8 overflow-hidden">
            {approvedReviews.length > 0 ? (
              <div
                ref={reviewsScrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x h-full"
              >
                {approvedReviews.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    data-nosnippet
                    className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-stone-200/80 shadow-xs hover:shadow-md transition-all snap-start"
                  >
                    <div>
                      {/* Giant Quotation Mark */}
                      <Quote className="w-8 h-8 text-amber-500/40 rotate-180 mb-3" />
                      
                      <p data-nosnippet className="text-stone-700 text-xs sm:text-sm font-light leading-relaxed">
                        "{item.comment}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#0A3825]">
                          {item.userName}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                          {item.productName || 'Verified Buyer'}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#D4AF37]">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[220px] bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-stone-200/80">
                <Quote className="w-8 h-8 text-amber-500/40 rotate-180 mb-3" />
                <p className="text-sm font-medium text-[#0A3825]">Customer Reviews</p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm">Verified customer testimonials and ratings for purchases will appear here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
