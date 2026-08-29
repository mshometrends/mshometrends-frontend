import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEOHead } from '../components/SEOHead';
import { buildFAQSchema, buildBreadcrumbSchema } from '../utils/seoSchemas';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Truck,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Package,
  RotateCcw,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FAQItem {
  id: string;
  category: 'shipping' | 'care' | 'payment' | 'returns' | 'general';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  // Shipping & Delivery
  {
    id: 'ship-1',
    category: 'shipping',
    question: 'How long does shipping and delivery take?',
    answer:
      'We deliver nationwide with express, insured transit. For Karachi, orders arrive within 1-2 business days. For Lahore, Islamabad, and Rawalpindi, delivery takes 2-3 business days. For other cities and regional areas, delivery is completed in 3-4 business days. International deliveries take approximately 5-7 business days via DHL/FedEx priority cargo.',
    tags: ['delivery time', 'speed', 'karachi', 'lahore', 'international', 'timeline'],
  },
  {
    id: 'ship-2',
    category: 'shipping',
    question: 'How do you ensure fragile bone china crockery arrives safely without breaking?',
    answer:
      'Every single plate, cup, and bowl is individually wrapped in multi-layer shock-absorbent thermal bubble wrap, encased in custom-molded high-density EPS foam cradles, and packed inside 5-layer heavy-duty reinforced corrugated outer cartons with bold "FRAGILE - LUXURY CROCKERY" warning seals. We have a 99.8% safe delivery record.',
    tags: ['packaging', 'breakage', 'safety', 'fragile', 'foam', 'protection'],
  },
  {
    id: 'ship-3',
    category: 'shipping',
    question: 'What are your delivery charges?',
    answer:
      'Delivery charges vary depending on destination and cart value. We offer free delivery on select premium collections or promo coupons. Regular local city delivery starts from $5.00 - $8.00 depending on location. Exact shipping costs are automatically calculated at checkout based on your delivery address and rules.',
    tags: ['shipping cost', 'free delivery', 'charges', 'rates', 'fees'],
  },
  {
    id: 'ship-4',
    category: 'shipping',
    question: 'How can I track the live status of my crockery shipment?',
    answer:
      'Once your order is processed and dispatched, you will receive a tracking link via SMS & email. You can also visit our built-in "Track Order" page from the header/footer navigation, enter your registered email address or Order ID, and view real-time courier milestone updates.',
    tags: ['track order', 'tracking', 'status', 'courier', 'dispatch'],
  },

  // Care & Materials
  {
    id: 'care-1',
    category: 'care',
    question: 'Are dinner sets with 24K gold or platinum rims microwave safe?',
    answer:
      'Tableware adorned with genuine 24-karat gold leaf or platinum gilding contains real metallic elements and therefore must NEVER be placed in a microwave. For microwave-friendly everyday dining, we recommend our solid-glazed Stoneware and un-gilded Porcelain collections.',
    tags: ['microwave', 'gold rim', '24k gold', 'platinum', 'safety'],
  },
  {
    id: 'care-2',
    category: 'care',
    question: 'Can MS Home Trends fine bone china be washed in a dishwasher?',
    answer:
      'Yes, our fine bone china is dishwasher-safe on a gentle/delicate cycle using liquid citrus-free detergent with warm water (under 60°C / 140°F). However, to preserve the brilliant luster of hand-painted gold detailing over generations, gentle hand-washing with a soft sponge is highly recommended.',
    tags: ['dishwasher', 'washing', 'cleaning', 'detergent', 'care guide'],
  },
  {
    id: 'care-3',
    category: 'care',
    question: 'What makes MS Home Trends Fine Bone China superior to ordinary ceramic or melamine?',
    answer:
      'Our fine bone china is manufactured with over 45% premium bone ash, resulting in extraordinary translucency, a warm ivory glow, superior chip resistance, and unmatched lightweight elegance. Unlike porous ceramic or plastic melamine, it is non-porous, 100% lead-free, cadmium-free, and stain-resistant.',
    tags: ['bone china vs ceramic', 'bone ash', 'quality', 'material', 'translucency'],
  },
  {
    id: 'care-4',
    category: 'care',
    question: 'How should I store fine tableware to avoid scratches?',
    answer:
      'When stacking plates and bowls, we recommend placing soft felt or microfiber separators between each piece to avoid abrasive friction on gilded rims. Store in a dry, dust-free cabinet away from extreme temperature shifts.',
    tags: ['storage', 'scratches', 'stacking', 'protection', 'felt'],
  },

  // Orders & Payment
  {
    id: 'pay-1',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We support Easypaisa mobile transfer (Account: 0324 2303895 / MS Home Trends) and Cash on Delivery (COD) across Pakistan. When paying via Easypaisa, simply share your transfer screenshot on WhatsApp (+92 324 2303895) for rapid instant verification.',
    tags: ['payment methods', 'cash on delivery', 'cod', 'easypaisa'],
  },
  {
    id: 'pay-2',
    category: 'payment',
    question: 'How do I submit my payment screenshot for Easypaisa?',
    answer:
      'After sending payment to our official Easypaisa account (0324-2303895), click the WhatsApp button on your order confirmation page to instantly share the payment receipt with our concierge team (+92 324 2303895), or upload it directly on the order invoice page.',
    tags: ['screenshot', 'receipt', 'easypaisa', 'verification', 'payment proof'],
  },
  {
    id: 'pay-3',
    category: 'payment',
    question: 'Can I request an official tax invoice or receipt?',
    answer:
      'Yes! An automated digital tax invoice is generated for every order. You can view, download, or print your official PDF invoice anytime by clicking "View Invoice" from your User Profile or the order confirmation screen.',
    tags: ['invoice', 'receipt', 'pdf', 'tax invoice', 'billing'],
  },
  {
    id: 'pay-4',
    category: 'payment',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'You can request modifications or cancellation within 2 hours of placing the order before it enters our precision crating and packaging queue. Please reach out immediately to our concierge support team via WhatsApp or phone.',
    tags: ['cancel order', 'modify order', 'change address', 'timing'],
  },

  // Returns & Breakage Guarantee
  {
    id: 'ret-1',
    category: 'returns',
    question: 'What happens if any item arrives broken or damaged during transit?',
    answer:
      'All shipments carry 100% Free Transit Insurance & Zero-Breakage Guarantee. If any piece arrives cracked or damaged, simply photograph the damaged piece and parcel box, and send it to our WhatsApp concierge (+92 324 2303895) or concierge@mshometrends.pk within 48 hours of delivery. We will courier a brand new replacement piece at zero extra cost to you.',
    tags: ['broken item', 'replacement', 'insurance', 'damage', 'guarantee', 'claim'],
  },
  {
    id: 'ret-2',
    category: 'returns',
    question: 'What is your return and exchange policy?',
    answer:
      'We offer a 7-day hassle-free return/exchange policy on unused, unwashed items in their original luxury presentation packaging. Custom engraved or bespoke monogrammed sets are final sale unless defective.',
    tags: ['return policy', 'exchange', '7 days', 'refund', 'terms'],
  },

  // General & Gifting
  {
    id: 'gen-1',
    category: 'general',
    question: 'Do you offer luxury gift packaging and bespoke wedding registries?',
    answer:
      'Yes! We specialize in luxury royal bridal trousseau sets, velvet-lined presentation boxes, custom greeting calligraphy cards, and bespoke wedding registry services. Contact our private concierge for customized corporate or wedding orders.',
    tags: ['gift packing', 'wedding registry', 'bridal set', 'corporate gift', 'velvet box'],
  },
  {
    id: 'gen-2',
    category: 'general',
    question: 'Where are your physical experience showrooms located?',
    answer:
      'Our flagship heritage experience suites are located at 742 Kensington High St, London W8 4SG, alongside partnering boutique galleries in Dubai, New York, Karachi, and Lahore. You can schedule a private table-styling appointment via our Contact page.',
    tags: ['showroom', 'store location', 'london', 'dubai', 'visit', 'appointment'],
  },
];

type CategoryFilter = 'all' | 'shipping' | 'care' | 'payment' | 'returns' | 'general';

export const FAQPage: React.FC = () => {
  const { navigateToPage } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'ship-1': true,
    'ship-2': true,
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCat;

      const matchesText =
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term));

      return matchesCat && matchesText;
    });
  }, [searchTerm, selectedCategory]);

  const categoriesConfig: { id: CategoryFilter; label: string; icon: any }[] = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'care', label: 'Care & Gold Detailing', icon: Sparkles },
    { id: 'payment', label: 'Payment & Orders', icon: CreditCard },
    { id: 'returns', label: 'Zero-Breakage Guarantee', icon: ShieldCheck },
    { id: 'general', label: 'Gifting & Showrooms', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Frequently Asked Questions & Care Guide"
        description="Find direct answers about MS Home Trends luxury tableware: break-safe delivery guarantee, 24K gold care instructions, shipping timelines across Karachi & Pakistan, and COD payment policies."
        keywords="crockery FAQ, bone china care, 24k gold tableware microwave safe, crockery delivery Karachi, tableware shipping Pakistan, MS Home Trends help"
        canonicalUrl="/faq"
        jsonLd={[
          buildFAQSchema(FAQ_DATA),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Concierge & FAQs', url: '/faq' },
          ]),
        ]}
      />
      {/* Top Breadcrumb & Hero */}
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-[#D4AF37]/40 text-amber-300 text-xs font-semibold uppercase tracking-widest shadow-inner">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            Concierge Help Center & FAQs
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to know about our luxury crockery collections, safe delivery packaging, 24K gold care, and order tracking.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto pt-4 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions (e.g. shipping time, microwave safe, broken item, cash on delivery)..."
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-2xl pl-12 pr-10 py-4 text-sm text-white placeholder-slate-400 transition-all shadow-xl outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categoriesConfig.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#0A3825] text-amber-300 border-[#D4AF37] shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Highlights / Banner Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigateToPage('shipping')}
            className="p-5 bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/20 hover:border-[#D4AF37]/60 rounded-2xl cursor-pointer group transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  Shipping Policy & Rates <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">View full delivery times & shock-proof packaging guide</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              if ((window as any).__navigateApp) {
                (window as any).__navigateApp('/track-order');
              }
            }}
            className="p-5 bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/20 hover:border-[#D4AF37]/60 rounded-2xl cursor-pointer group transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  Live Order Tracking <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Check real-time dispatch and courier milestone status</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigateToPage('contact')}
            className="p-5 bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/20 hover:border-[#D4AF37]/60 rounded-2xl cursor-pointer group transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  24/7 Concierge Support <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Speak with a tableware specialist or bespoke consultant</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs List Accordion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const all: Record<string, boolean> = {};
                  filteredFaqs.forEach((f) => (all[f.id] = true));
                  setOpenIds(all);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Expand All
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setOpenIds({})}
                className="text-xs text-slate-400 hover:text-slate-300 font-medium transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/40 border border-slate-800 rounded-3xl space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No questions matched your search</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Could not find any FAQ for "<strong className="text-amber-300">{searchTerm}</strong>". Our concierge team is ready to answer any specific query directly.
              </p>
              <button
                onClick={() => navigateToPage('contact')}
                className="bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-semibold px-6 py-2.5 rounded-xl text-xs border border-[#D4AF37]/50 inline-flex items-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> Ask Our Concierge
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? 'bg-slate-800/90 border-[#D4AF37]/50 shadow-lg shadow-black/30'
                        : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono ${
                            isOpen
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : 'bg-slate-700/50 text-slate-400'
                          }`}
                        >
                          Q
                        </div>
                        <span
                          className={`font-serif-title font-bold text-sm sm:text-base leading-snug transition-colors ${
                            isOpen ? 'text-amber-300' : 'text-slate-100 group-hover:text-white'
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? 'bg-amber-400/20 text-amber-300 rotate-180' : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-slate-700/60">
                            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/40 text-slate-200 space-y-3">
                              <p>{faq.answer}</p>
                              {faq.category === 'shipping' && (
                                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                                  <button
                                    onClick={() => navigateToPage('shipping')}
                                    className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 inline-flex items-center gap-1"
                                  >
                                    Read Detailed Shipping Policy <ExternalLink className="w-3 h-3" />
                                  </button>
                                  <span className="text-slate-500">|</span>
                                  <button
                                    onClick={() => {
                                      if ((window as any).__navigateApp) {
                                        (window as any).__navigateApp('/track-order');
                                      }
                                    }}
                                    className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 inline-flex items-center gap-1"
                                  >
                                    Track Live Shipment <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-gradient-to-r from-[#0A3825] to-[#062418] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase font-bold text-amber-300 tracking-widest">
                Direct Help Line
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-white">
                Still have unanswered questions?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed">
                Our private dining curators and customer concierge specialists are at your service 7 days a week to guide you with tableware selections, customization, and orders.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> +1 (800) 880-2762
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> concierge@mshometrends.com
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => navigateToPage('contact')}
                className="bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A3825] font-bold px-6 py-3.5 rounded-xl shadow-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Contact Us
              </button>
              <a
                href="https://wa.me/923242303895"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-emerald-500/40 text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                WhatsApp Concierge (+92 324 2303895)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
