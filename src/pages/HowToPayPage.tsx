import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SEOHead } from '../components/SEOHead';
import { buildBreadcrumbSchema } from '../utils/seoSchemas';
import {
  Smartphone,
  Send,
  Banknote,
  MessageSquare,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HowToPayPage: React.FC = () => {
  const { navigateToPage } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    {
      number: '01',
      title: 'Open EasyPaisa App',
      description: 'Launch the EasyPaisa mobile application on your smartphone and log into your account.',
      detail: 'Tap on "Send Money" from the main home dashboard and choose "EasyPaisa Transfer".',
      icon: Smartphone,
      color: 'from-emerald-600 to-emerald-800',
    },
    {
      number: '02',
      title: 'Enter MS Home Trends Account',
      description: 'Enter our official verified EasyPaisa receiver number in the recipient field.',
      detail: 'Receiver Number: 0324 2303895. Ensure the receiver title displays as "MS Home Trends".',
      icon: Send,
      color: 'from-amber-600 to-amber-800',
    },
    {
      number: '03',
      title: 'Enter Order Amount & Send',
      description: 'Enter the exact total amount shown on your checkout or order invoice.',
      detail: 'Review the transfer preview screen and tap "Send Now" to finalize the transaction.',
      icon: Banknote,
      color: 'from-blue-600 to-blue-800',
    },
    {
      number: '04',
      title: 'Share Screenshot on WhatsApp',
      description: 'Capture or save your transaction receipt from the EasyPaisa confirmation screen.',
      detail: 'Send the screenshot along with your Order ID to our WhatsApp concierge (+92 324 2303895) for rapid approval.',
      icon: MessageSquare,
      color: 'from-teal-600 to-teal-800',
    },
  ];

  const paymentFAQs = [
    {
      q: 'How quickly is my payment verified after sending the screenshot?',
      a: 'Our dedicated payment verification desk operates 7 days a week. Once you send the transaction receipt to our WhatsApp (+92 324 2303895), your order status is verified within 10 to 30 minutes during business hours.',
    },
    {
      q: 'Can I pay via Cash on Delivery (COD) instead?',
      a: 'Yes! We offer Cash on Delivery across Pakistan. You can select "Cash on Delivery" during checkout and pay the courier directly when your package is safely delivered at your doorstep.',
    },
    {
      q: 'What if I made an error in the transfer amount?',
      a: 'Do not worry. Simply contact our support team on WhatsApp (+92 324 2303895) with your transaction ID and Order ID. Any excess will be immediately refunded or adjusted to your order.',
    },
    {
      q: 'Is EasyPaisa payment safe on MS Home Trends?',
      a: 'Yes, 100%. EasyPaisa is licensed and regulated by the State Bank of Pakistan. You transfer directly from your personal mobile wallet to our registered business account, eliminating third-party card exposure.',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#0A3825] pb-20">
      <SEOHead
        title="How to Pay via EasyPaisa | Payment Instructions - MS Home Trends"
        description="Learn how to pay for your luxury dinnerware orders using EasyPaisa (0324 2303895) or Cash on Delivery at MS Home Trends."
        canonicalUrl="/how-to-pay"
        schema={buildBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'How to Pay', url: '/how-to-pay' },
        ])}
      />

      {/* Hero Banner */}
      <section className="bg-[#0A3825] text-white py-14 sm:py-18 relative overflow-hidden border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Official Payment Guide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight"
          >
            How to Pay via <span className="text-emerald-400">EasyPaisa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed"
          >
            Follow our straightforward 4-step guide to complete your order payment safely, swiftly, and effortlessly using your EasyPaisa wallet.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-12">
        
        {/* Official Account Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                  Verified Merchant Account
                </span>
                <span className="text-xs text-stone-500 font-medium">State Bank Regulated</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#0A3825]">
                MS Home Trends Official EasyPaisa Account
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm">
                Always ensure you transfer to this exact mobile number and verify the account title before confirming.
              </p>
            </div>

            {/* Copyable Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0A3825] text-white p-4 rounded-2xl border border-emerald-700/40 min-w-[320px]">
              <div className="flex-1 space-y-0.5">
                <span className="text-[10px] text-emerald-300 font-sans uppercase font-bold tracking-wider">
                  EasyPaisa Mobile Number:
                </span>
                <div className="font-mono text-xl font-bold text-amber-300 tracking-wider">
                  0324 2303895
                </div>
                <div className="text-[11px] text-stone-300">
                  Title: <strong className="text-white">MS Home Trends</strong>
                </div>
              </div>

              <button
                onClick={() => handleCopy('03242303895', 'account')}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {copiedKey === 'account' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Number</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 Step-by-Step Instructions Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A3825]">
              Step-by-Step Payment Instructions
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto font-light">
              It takes less than 60 seconds to complete your transaction and confirm your luxury order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0A3825] group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-[#0A3825]" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#D4AF37] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                        STEP {step.number}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0A3825] font-serif">
                      {step.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-[11px] text-stone-700 font-medium leading-normal">
                    {step.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* WhatsApp Direct Verification Banner */}
        <section className="bg-gradient-to-r from-emerald-900 via-[#0A3825] to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/40 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Instant WhatsApp Concierge</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Sent Payment? Share Proof on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Click the button below to open direct WhatsApp chat with our verification team (+92 324 2303895). Attach your receipt screenshot and Order ID for immediate order confirmation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="https://wa.me/923242303895?text=Hello%20MS%20Home%20Trends,%20I%20have%20transferred%20the%20payment%20via%20EasyPaisa.%20Please%20find%20my%20receipt%20attached."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-full shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp (+92 324 2303895)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => navigateToPage('products')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </section>

        {/* Alternate Payment: Cash on Delivery */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A3825]">
              <Banknote className="w-4 h-4 text-[#D4AF37]" />
              <span>Alternative Payment Method</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0A3825]">
              Prefer Cash on Delivery (COD)?
            </h3>
            <p className="text-xs text-stone-600 max-w-xl font-light">
              We also offer Cash on Delivery for all eligible domestic addresses across Pakistan. Select "Cash on Delivery" at checkout and pay when your package arrives safely at your doorstep.
            </p>
          </div>

          <button
            onClick={() => navigateToPage('checkout')}
            className="px-6 py-3 bg-[#0A3825] text-amber-200 hover:bg-[#D4AF37] hover:text-[#0A3825] rounded-full text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#0A3825]">
              Frequently Asked Questions
            </h2>
            <p className="text-stone-600 text-xs font-light">
              Everything you need to know about EasyPaisa transactions and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentFAQs.map((faq, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-xs sm:text-sm text-[#0A3825] flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600 bg-white p-3 rounded-2xl border border-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">100% Safe Mobile Wallet Transfer</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600 bg-white p-3 rounded-2xl border border-stone-200">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Quick 15-Min Admin Verification</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600 bg-white p-3 rounded-2xl border border-stone-200">
            <Phone className="w-4 h-4 text-[#0A3825]" />
            <span className="font-medium">24/7 WhatsApp Concierge Support</span>
          </div>
        </div>

      </div>
    </div>
  );
};
