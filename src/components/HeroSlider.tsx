import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Leaf, 
  Gem,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_HERO_IMG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80';
const FALLBACK_STORY_IMG = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';

// Animation variants for smooth luxury fade-in-up
const fadeInUpContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeInUpItem = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HeroSlider: React.FC = () => {
  const { navigateToPage } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // High-Resolution Luxury Tableware & Kitchen Hero Slides
  const heroSlides = [
    {
      id: 1,
      badge: '2026 Imperial Fine Dining Collection',
      titleLine1: 'Eco-Friendly',
      italicTitle: 'Kitchenware',
      titleLine2: 'for a greener home',
      description: 'The handcrafted fine bone china and sustainable cookware niche with timeless artisanal porcelain aesthetics.',
      statNumber: '96%',
      statLabel: 'Pure Bone Ash Translucency',
      statBadge: 'Natural. Sustainable. Eco-conscious.',
      ctaText: 'Shop now',
      category: 'dinner-sets',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 2,
      badge: 'Royal Fine Porcelain Editions',
      titleLine1: 'Handcrafted',
      italicTitle: 'Luxury Tableware',
      titleLine2: 'for an elevated home',
      description: 'Artisanal handcrafted fine bone china and royal dinnerware sets crafted for timeless memories and prestigious dining.',
      statNumber: '100%',
      statLabel: 'Break-Safe Delivery Guarantee',
      statBadge: 'Imperial. Durable. Lead-Free.',
      ctaText: 'Explore Collection',
      category: 'tea-sets',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 3,
      badge: 'Artisanal Porcelain & Cutlery',
      titleLine1: 'Bespoke',
      italicTitle: 'Fine Ceramics',
      titleLine2: 'for modern dining',
      description: 'Elevate your daily dining ritual with ultra-durable heat-resistant porcelain, crystal glassware, and precision mirror-polished cutlery.',
      statNumber: '25K+',
      statLabel: '5-Star Verified Reviews',
      statBadge: 'Certified. Premium. Heritage.',
      ctaText: 'View Bestsellers',
      category: 'cutlery',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  // Story capsule cards for the explore section
  const exploreStories = [
    {
      title: 'CupEco',
      name: 'Royal Tea Cups',
      category: 'tea-sets',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'EcoSpoonery',
      name: 'Gold Cutlery',
      category: 'cutlery',
      image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'NatureSip',
      name: 'Artisan Bowls',
      category: 'bowls',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'FreshPitcher',
      name: 'Crystal Glass',
      category: 'glassware',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Auto-play slides every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const current = heroSlides[currentSlide];

  return (
    <section className="pt-2 sm:pt-4 pb-8 sm:pb-14 px-3 sm:px-6 lg:px-10 xl:px-14 max-w-[1760px] 2xl:max-w-[1920px] mx-auto overflow-hidden">
      {/* Top Main Hero Frame with Fade-In-Up Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-[#0A3825] text-white shadow-2xl border border-[#D4AF37]/30 min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] 2xl:min-h-[680px] flex flex-col justify-between p-4 sm:p-10 lg:p-14 2xl:p-16 transition-all"
      >
        {/* Active Slide Background Image with Smooth Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 z-0 bg-[#0A3825]"
          >
            <img
              src={current.image}
              alt={current.titleLine1}
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_HERO_IMG; }}
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.04]"
            />
            {/* Subtle Gradient Shadow on Left for Perfect Text Readability while Image Remains Bright */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031b12]/95 via-[#0A3825]/75 to-black/30 sm:bg-gradient-to-r sm:from-[#031b12]/90 sm:via-[#0A3825]/60 sm:to-transparent sm:w-2/3" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031b12]/80 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Top Header Row: Badge & Slide Controls with Staggered Fade-In-Up */}
        <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4">
          <motion.div
            key={`badge-${current.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-[#D4AF37]/50 text-[11px] sm:text-xs text-amber-200 shadow-sm max-w-[72%] sm:max-w-none"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-medium tracking-wide truncate">{current.badge}</span>
          </motion.div>

          {/* Slide Arrow Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-1.5 sm:gap-2 shrink-0"
          >
            <button
              onClick={handlePrevSlide}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-[#0A3825] backdrop-blur-md border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-[#0A3825] backdrop-blur-md border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Main Content Area (Text & CTA) with Staggered Fade-In-Up */}
        <div className="relative z-10 max-w-2xl my-auto py-4 sm:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current.id}`}
              variants={fadeInUpContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <motion.h1 
                variants={fadeInUpItem}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.15]"
              >
                {current.titleLine1} <br className="hidden xs:inline" />
                <span className="font-serif italic font-normal text-amber-200 drop-shadow-md">
                  {current.italicTitle}
                </span>{' '}
                <br className="hidden sm:inline" />
                {current.titleLine2}
              </motion.h1>

              <motion.p 
                variants={fadeInUpItem}
                className="mt-2.5 sm:mt-4 text-xs sm:text-sm lg:text-base text-stone-200/95 font-light max-w-lg leading-relaxed drop-shadow-sm"
              >
                {current.description}
              </motion.p>

              <motion.div variants={fadeInUpItem} className="mt-5 sm:mt-8 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigateToPage('products')}
                  className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#FAF9F6] text-[#0A3825] font-semibold text-xs sm:text-sm hover:bg-amber-100 transition-all duration-300 shadow-xl cursor-pointer group"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0A3825] group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Floating Stats Glassmorphism Card & Slide Indicators with Fade-In-Up */}
        <div className="relative z-10 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
          
          {/* Slide Indicator Dots */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15"
          >
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-[#D4AF37]'
                    : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </motion.div>

          {/* Right Floating Stat Card with Luxury Fade-In-Up */}
          <motion.div
            key={`stat-${current.id}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black/55 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-5 w-auto max-w-[210px] sm:max-w-[240px] text-white shadow-2xl self-end sm:self-auto"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="text-[10px] sm:text-[11px] font-light text-stone-300 leading-tight">
                {current.statBadge}
              </div>
              <div className="p-1 sm:p-1.5 rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-serif font-light text-amber-200 mt-0.5">
              {current.statNumber}
            </div>
            <div className="text-[9px] sm:text-[10px] text-stone-300 font-light mt-0.5">
              {current.statLabel}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Explore Story Pill Carousel with Staggered Luxury Fade-In-Up */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mt-8"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#0A3825]">
              Explore Distinct Collections
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {exploreStories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => navigateToPage('category', story.category)}
              className="group relative h-40 sm:h-56 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-stone-200 bg-stone-100"
            >
              <img
                src={story.image}
                alt={story.name}
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_STORY_IMG; }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 text-white flex flex-col justify-end">
                <span className="text-[10px] sm:text-[11px] text-amber-200 font-light">
                  Explore
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide font-serif text-white truncate">
                  {story.title}
                </span>
                
                <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 self-start px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/90 text-[#0A3825] text-[9px] sm:text-[10px] font-bold shadow-sm group-hover:bg-[#D4AF37] transition-colors">
                  <span>Shop</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
