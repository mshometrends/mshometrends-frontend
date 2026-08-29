import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ArrowUpRight, 
  Truck, 
  ShieldCheck, 
  Gem, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Banknote, 
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const { navigateToPage, setIsAuthModalOpen } = useStore();

  return (
    <footer className="bg-[#FAF9F6] text-[#0A3825] border-t border-stone-200 pt-12 pb-10 overflow-hidden w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-12">

        {/* 1. Value Pillars & Shipping Guarantee Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-[#F4F1EA] border border-stone-200/80 shadow-xs">
          
          {/* Pillar 1: Break-Safe Shipping */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#0A3825] text-amber-200 flex-shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#0A3825]">
                Break-Safe Delivery
              </h4>
              <p className="text-[11px] text-stone-600 font-light mt-0.5 leading-relaxed">
                5-Layer shockproof packing with 100% transit replacement guarantee across Pakistan.
              </p>
            </div>
          </div>

          {/* Pillar 2: Fine Porcelain & Bone China */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#0A3825] text-amber-200 flex-shrink-0 shadow-sm">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#0A3825]">
                Fine Porcelain & Bone China
              </h4>
              <p className="text-[11px] text-stone-600 font-light mt-0.5 leading-relaxed">
                Lead-free certified, 96% bone ash translucency, and heirloom durability.
              </p>
            </div>
          </div>

          {/* Pillar 3: Nationwide Express Shipping */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#0A3825] text-amber-200 flex-shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#0A3825]">
                2–4 Day Express Transit
              </h4>
              <p className="text-[11px] text-stone-600 font-light mt-0.5 leading-relaxed">
                Fast dispatch to Karachi, Lahore, Islamabad, Faisalabad, and all major cities.
              </p>
            </div>
          </div>

          {/* Pillar 4: Flexible Payments & COD */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#0A3825] text-amber-200 flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#0A3825]">
                Safe Payments & COD
              </h4>
              <p className="text-[11px] text-stone-600 font-light mt-0.5 leading-relaxed">
                Cash on Delivery, Raast direct transfer, and 256-bit encrypted online checkout.
              </p>
            </div>
          </div>

        </div>

        {/* 2. Upper Statement & Brand Mission */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-4">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#0A3825] text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Pakistan's Premier Fine Dining Boutique</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#0A3825] leading-snug">
              MS Home Trends promotes elevated luxury dining with beautifully crafted bone china and fine{' '}
              <span className="font-serif italic font-normal text-[#0A3825]">
                Tableware!
              </span>
            </h3>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#0A3825] bg-[#0A3825] text-amber-200 text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#0A3825] transition-all shadow-md cursor-pointer group"
            >
              <span>Join VIP Privilege Club</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* 3. Comprehensive 4-Column Navigation & Policies */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-6 border-t border-stone-200 text-xs">
          
          {/* Column 1: Curated Collections */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Collections</span>
            </h4>
            <ul className="space-y-2 text-stone-600 font-light">
              <li>
                <button
                  onClick={() => navigateToPage('category', 'dinner-sets')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Imperial Dinner Sets (72 & 84 Pcs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('category', 'tea-sets')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Royal Porcelain Tea Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('category', 'cutlery')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Mirror Polished Cutlery Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('category', 'glassware')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Crystal Goblets & Pitchers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('products')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left font-medium text-[#0A3825]"
                >
                  Wedding & Trousseau Gifts →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Shipping & Delivery Service */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Shipping & Delivery</span>
            </h4>
            <ul className="space-y-2 text-stone-600 font-light">
              <li>
                <button
                  onClick={() => navigateToPage('how-to-pay')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left font-semibold text-emerald-800 flex items-center gap-1.5"
                >
                  <span>How to Pay (EasyPaisa)</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('shipping')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Shipping Rates & Timelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('shipping')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Breakage Protection Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('track-order')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left font-medium text-[#0A3825]"
                >
                  Track Your Consignment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('shipping')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Karachi Same-Day Delivery
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Client Concierge</span>
            </h4>
            <ul className="space-y-2 text-stone-600 font-light">
              <li>
                <button
                  onClick={() => navigateToPage('about')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  About MS Home Trends
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('how-to-pay')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Payment Methods & Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('faq')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Book Showroom Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('faq')}
                  className="hover:text-[#0A3825] hover:underline transition-all text-left"
                >
                  Bone China Care & Washing Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom & Direct Contact */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>Boutique Showroom</span>
            </h4>
            <div className="space-y-2 text-stone-600 font-light text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Shop #4, Zamzama Commercial Lane 3, Phase V, DHA Karachi, Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+923242303895" className="hover:text-[#0A3825] hover:underline font-medium">
                  +92 324 2303895
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:concierge@mshometrends.pk" className="hover:text-[#0A3825] hover:underline">
                  concierge@mshometrends.pk
                </a>
              </p>
              <p className="text-[11px] text-stone-500 pt-1">
                <span className="font-medium text-[#0A3825]">Visiting Hours:</span> Mon–Sat: 11:00 AM – 9:30 PM (Sun by appointment)
              </p>
            </div>
          </div>

        </div>

        {/* 4. Payment Badges & Security Assurance (No Emojis) */}
        <div className="pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <span className="font-semibold text-[#0A3825]">Accepted Payment Methods:</span>
            
            <button
              onClick={() => navigateToPage('how-to-pay')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-bold text-emerald-900 shadow-2xs transition-colors cursor-pointer group"
              title="Click to view How to Pay via EasyPaisa"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              <span>EasyPaisa (0324 2303895)</span>
              <span className="text-[10px] text-emerald-700 font-semibold underline ml-1">How to Pay →</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-[11px] font-medium text-stone-700 shadow-2xs">
              <Banknote className="w-3.5 h-3.5 text-[#0A3825]" />
              <span>Cash on Delivery (COD)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToPage('how-to-pay')}
              className="text-xs text-[#0A3825] hover:text-[#D4AF37] font-semibold underline flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Payment Guide</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-emerald-800">100% Insured & Breakage Protected</span>
            </div>
          </div>
        </div>

        {/* 5. Lower Massive Watermark Brand Row */}
        <div className="pt-6 border-t border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Giant Serif Watermark Brand Title */}
          <div className="select-none">
            <h2 className="text-5xl sm:text-7xl lg:text-[104px] font-serif font-light text-stone-300/85 hover:text-stone-400 transition-colors leading-none tracking-tight">
              MS Home Trends
            </h2>
          </div>

          {/* Social Links with Outward Arrows */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-stone-600 font-medium pb-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0A3825] transition-colors"
            >
              <span>Instagram</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0A3825] transition-colors"
            >
              <span>Facebook</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://wa.me/923242303895"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0A3825] transition-colors"
            >
              <span>WhatsApp: +92 324 2303895</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0A3825] transition-colors"
            >
              <span>Twitter</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0A3825] transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* 6. Copyright & Legal Links */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 font-light">
          <p className="flex flex-wrap items-center gap-1">
            <span>© {new Date().getFullYear()} MS Home Trends Luxury Crockery. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Powered By{' '}
              <a
                href="https://ruvintech.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0A3825] hover:text-[#B45309] hover:underline transition-colors"
              >
                Ruvin Tech Solutions
              </a>
            </span>
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateToPage('how-to-pay')} className="hover:underline font-medium text-emerald-800">How to Pay</button>
            <span>•</span>
            <button onClick={() => navigateToPage('shipping')} className="hover:underline">Shipping Policy</button>
            <span>•</span>
            <button onClick={() => navigateToPage('faq')} className="hover:underline">Privacy & Terms</button>
            <span>•</span>
            <button onClick={() => navigateToPage('contact')} className="hover:underline">Concierge</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
