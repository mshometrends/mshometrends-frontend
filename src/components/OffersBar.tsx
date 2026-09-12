import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Tag,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Timer,
  ArrowRight,
  X,
  Flame,
  Gift,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromoOffer {
  id: string;
  badge: string;
  badgeType: 'gold' | 'emerald' | 'amber' | 'rose';
  title: string;
  description: string;
  code?: string;
  discountText?: string;
  targetPage?: string;
  targetParam?: string;
  icon?: React.ReactNode;
}

export const OffersBar: React.FC = () => {
  const { offers, coupons, applyCoupon, showToast, navigateToPage } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  // Use active offers from store or fallback
  const activeStoreOffers: PromoOffer[] = (offers || [])
    .filter((o) => o.active !== false)
    .sort((a, b) => (a.order || 1) - (b.order || 1))
    .map((o) => ({
      id: o.id || o._id || `off-${Math.random()}`,
      badge: o.badge || 'PROMO OFFER',
      badgeType: (o.badgeType as any) || 'gold',
      title: o.title,
      description: o.description,
      code: o.code,
      discountText: o.discountText,
      targetPage: o.targetPage || 'products',
      targetParam: o.targetParam,
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
    }));

  const fullOffers: PromoOffer[] = activeStoreOffers.length > 0 ? activeStoreOffers : [
    {
      id: 'default-off-1',
      badge: 'RAMADAN & EID SPECIAL',
      badgeType: 'amber',
      title: 'Get 10% OFF Storewide on Fine Bone China & Porcelain',
      description: 'Applicable on luxury dinner sets, tea suites, and decorative tableware.',
      code: 'LUXURY10',
      discountText: '10% OFF',
      targetPage: 'products',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
    },
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate offers every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fullOffers.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [fullOffers.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % fullOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + fullOffers.length) % fullOffers.length);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Promo Code "${code}" copied & applied to your cart!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (!isVisible) {
    return (
      <div className="bg-[#062418] border-b border-[#D4AF37]/30 py-1 px-4 text-center">
        <button
          onClick={() => setIsVisible(true)}
          className="text-[11px] text-amber-300 hover:text-white font-medium inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Tag className="w-3 h-3 text-amber-400" />
          <span>Show Exclusive Tableware Offers & Promo Codes (Click to Expand)</span>
        </button>
      </div>
    );
  }

  const currentOffer = fullOffers[currentIndex] || fullOffers[0];

  return (
    <div className="relative bg-gradient-to-r from-[#041d13] via-[#0A3825] to-[#041d13] text-white border-y border-[#D4AF37]/40 shadow-md overflow-hidden z-30 transition-all">
      {/* Decorative Gold Sheen Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />

      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Navigation Arrow Left */}
          <button
            onClick={handlePrev}
            className="p-1 rounded-full text-amber-200/70 hover:text-amber-300 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Previous Offer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Main Animated Offer Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center md:text-left"
              >
                {/* Badge & Icon */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#D4AF37] text-[#0A3825] shadow-xs border border-amber-200">
                    {currentOffer.icon}
                    <span>{currentOffer.badge}</span>
                  </span>

                  {/* Flash Countdown Timer */}
                  <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-200/90 bg-black/25 px-2 py-0.5 rounded-md border border-amber-300/20">
                    <Timer className="w-3 h-3 text-amber-300" />
                    <span>
                      {String(timeLeft.hours).padStart(2, '0')}:
                      {String(timeLeft.minutes).padStart(2, '0')}:
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Offer Text & Details */}
                <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {currentOffer.title}
                  </span>
                  <span className="hidden lg:inline text-xs text-emerald-200/80 font-light">
                    — {currentOffer.description}
                  </span>
                </div>

                {/* Promo Code & Action CTAs */}
                <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                  {currentOffer.code && (
                    <button
                      onClick={() => handleCopyCode(currentOffer.code!)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shadow-xs border cursor-pointer ${
                        copiedCode === currentOffer.code
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/10 hover:bg-white/20 text-amber-300 border-[#D4AF37]/50 hover:border-amber-300'
                      }`}
                      title="Click to copy & auto-apply coupon"
                    >
                      {copiedCode === currentOffer.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-200" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-3 h-3 text-amber-400" />
                          <span>{currentOffer.code}</span>
                          <Copy className="w-2.5 h-2.5 opacity-70" />
                        </>
                      )}
                    </button>
                  )}

                  {currentOffer.targetPage && (
                    <button
                      onClick={() =>
                        navigateToPage(
                          currentOffer.targetPage as any,
                          currentOffer.targetParam
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white transition-colors bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-lg border border-amber-300/30 cursor-pointer"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3 text-amber-300" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrow Right & Close Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleNext}
              className="p-1 rounded-full text-amber-200/70 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Next Offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-emerald-200/50 hover:text-white rounded-full transition-colors ml-1 cursor-pointer"
              title="Dismiss offers bar"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 mt-1.5 sm:mt-1">
          {fullOffers.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to offer ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Gold Sheen Bottom Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
    </div>
  );
};
