import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { PromoSuccessModal } from './PromoSuccessModal';
import { motion } from 'motion/react';

const TEMP_DOMAINS = [
  'tempmail', '10minutemail', 'guerrillamail', 'mailinator', 'yopmail',
  'trashmail', 'temp-mail', 'fakeinbox', 'sharklasers', 'dispostable',
  'getnada', 'throwawaymail', 'mohmal', 'crazymailing', 'dropmail',
  'fakemailgenerator', 'emailondeck', 'disposable', 'tmpmail', 'p3p0',
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';

export const Newsletter: React.FC = () => {
  const { showToast, signupUser } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmailError = (val: string): string | null => {
    if (!val.trim()) return null;
    const clean = val.trim().toLowerCase();
    if (!clean.includes('@') || !clean.includes('.')) {
      return 'Enter a valid email address (e.g. name@gmail.com)';
    }
    const domain = clean.split('@')[1] || '';
    if (TEMP_DOMAINS.some((td) => domain.includes(td))) {
      return 'Disposable email addresses are not permitted.';
    }
    return null;
  };

  const emailErr = getEmailError(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);
    // Derive name & auto-password
    const derivedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'VIP Member';
    const autoPassword = `VIP_${Math.floor(100000 + Math.random() * 900000)}`;
    const randomPhone = `0300${Math.floor(1000000 + Math.random() * 9000000)}`;

    const res = await signupUser(derivedName, email, randomPhone, autoPassword);
    setLoading(false);

    if (res.success) {
      setSubscribed(true);
      setShowPromoModal(true);
    } else {
      setSubscribed(true);
      setShowPromoModal(true);
      showToast('Welcome back! Your exclusive discount coupon is VIPFIRST', 'info');
    }
  };

  return (
    <section className="py-12 sm:py-18 px-3 sm:px-6 lg:px-10 xl:px-14 max-w-[1760px] 2xl:max-w-[1920px] mx-auto w-full">
      {/* Dark Forest Green Rounded Card */}
      <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A3825] overflow-hidden p-6 sm:p-10 lg:p-14 border border-[#D4AF37]/30 shadow-2xl">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-radial-at-c from-[#0e4b33] to-[#041a11] opacity-90 pointer-events-none" />

        {/* 4 Floating Collage Image Photos */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Photos (Top-Left & Bottom-Left) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {/* Top Left Image: Cookware */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-44 rounded-3xl overflow-hidden border border-white/20 shadow-lg group bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Cookware"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
            </motion.div>

            {/* Bottom Left Image: Table Styling */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-40 rounded-3xl overflow-hidden border border-white/20 shadow-lg group bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80"
                alt="Tableware Styling"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
            </motion.div>
          </div>

          {/* Center Column: Text & Subscription Bar */}
          <div className="lg:col-span-6 text-center text-white px-2 sm:px-6 z-20">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm font-light text-amber-200 tracking-wider block mb-1"
            >
              Get Privileged Tablescape Inspirations
            </motion.span>

            {/* Exclusive Discount Headline */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-amber-100 tracking-tight leading-tight my-3"
            >
              Exclusive Discount
            </motion.h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/30 p-1.5 focus-within:border-amber-300 transition-all shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Your Email"
                  className="w-full px-4 py-2.5 bg-transparent text-white placeholder-stone-300 text-xs sm:text-sm focus:outline-none"
                  disabled={loading || subscribed}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-5 sm:px-6 py-2.5 rounded-full bg-[#FAF9F6] text-[#0A3825] font-semibold text-xs hover:bg-[#D4AF37] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {error && (
                <div className="mt-2 text-rose-300 text-xs flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </form>

            {/* Subtext */}
            <p className="mt-5 text-[11px] sm:text-xs text-stone-300 font-light leading-relaxed max-w-sm mx-auto">
              Artisanal recipes, tablescape inspirations, and exclusive member privileges on fine handcrafted tableware.
            </p>
          </div>

          {/* Right Column Photos (Top-Right & Bottom-Right) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {/* Top Right Image: Ceramic Bowls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-40 rounded-3xl overflow-hidden border border-white/20 shadow-lg group bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Ceramics"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
            </motion.div>

            {/* Bottom Right Image: Warm Family Dining */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-44 rounded-3xl overflow-hidden border border-white/20 shadow-lg group bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
                alt="Family Dining Memories"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Promo Success Modal */}
      {showPromoModal && (
        <PromoSuccessModal
          isOpen={showPromoModal}
          onClose={() => setShowPromoModal(false)}
          promoCode="VIPFIRST"
        />
      )}
    </section>
  );
};
