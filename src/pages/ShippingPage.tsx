import React from 'react';
import { motion } from 'motion/react';
import { SEOHead } from '../components/SEOHead';
import { buildBreadcrumbSchema } from '../utils/seoSchemas';
import {
  Truck,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail,
  Box,
  Layers,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPage: React.FC = () => {
  const { navigateToPage, shippingRules } = useStore();

  const packagingSteps = [
    {
      step: '01',
      title: 'Individual Microfiber & Silk Wrapping',
      desc: 'Each dinner plate, tea cup, and bowl is individually wrapped to prevent microscopic friction and protect delicate 24K gold gilding.',
      icon: Sparkles,
    },
    {
      step: '02',
      title: 'Multi-Chamber Thermal Air Cushion',
      desc: 'Heavy-duty multi-cell bubble shielding envelopes every item, absorbing external impact from all 360 degrees.',
      icon: Box,
    },
    {
      step: '03',
      title: 'Custom Molded High-Density EPS Foam',
      desc: 'Sets are nested securely into custom-molded shock-absorbent foam beds preventing any movement or rattling in transit.',
      icon: Layers,
    },
    {
      step: '04',
      title: '5-Ply Corrugated Reinforced Outer Box',
      desc: 'Industrial heavy-gauge 5-ply cartons designed to resist up to 50kg vertical load pressure without compressing.',
      icon: Package,
    },
  ];

  const deliveryDestinations = [
    {
      region: 'Karachi Metro',
      time: '1 - 2 Business Days',
      fee: '$5.00 (Free on qualifying orders)',
      type: 'Express Same-City Courier',
      status: 'Fastest Transit',
    },
    {
      region: 'Lahore & Islamabad / Rawalpindi',
      time: '2 - 3 Business Days',
      fee: '$8.00 (Standard Insured)',
      type: 'Priority Air/Road Cargo',
      status: 'Express Tracked',
    },
    {
      region: 'Faisalabad, Multan, Peshawar, Quetta & Major Cities',
      time: '3 - 4 Business Days',
      fee: '$10.00 (Standard Insured)',
      type: 'Nationwide Fragile Fleet',
      status: 'Fully Insured',
    },
    {
      region: 'Regional & Other Remote Districts',
      time: '4 - 5 Business Days',
      fee: '$10.00 - $12.00',
      type: 'Registered Special Courier',
      status: 'Tracked & Signed',
    },
    {
      region: 'International (UAE, UK, USA, Canada, GCC)',
      time: '5 - 7 Business Days',
      fee: '$25.00 - $45.00 (Based on Weight)',
      type: 'DHL Express / FedEx Priority',
      status: 'Global Priority Cargo',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Zero-Breakage Fragile Shipping & Nationwide Delivery"
        description="Learn about MS Home Trends 5-layer shock-proof packaging, same-day dispatch in Karachi, express delivery across Pakistan (Lahore, Islamabad), and worldwide insured transit."
        keywords="crockery delivery Pakistan, tableware shipping Karachi, break safe delivery, fragile shipping guarantee, international dinnerware courier"
        canonicalUrl="/shipping"
        jsonLd={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Shipping & Delivery Policy', url: '/shipping' },
          ]),
        ]}
      />
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-[#D4AF37]/40 text-amber-300 text-xs font-semibold uppercase tracking-widest shadow-inner">
            <Truck className="w-3.5 h-3.5 text-amber-300" />
            White-Glove Shipping & Zero-Breakage Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Delivering fragile fine bone china and luxury tableware across the globe with precision shock-proof packaging, comprehensive transit insurance, and real-time courier tracking.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-slate-800/80 border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-white text-base">Zero-Breakage Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              100% Free transit insurance. If anything arrives chipped or damaged, we replace it immediately at zero cost.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-white text-base">Express Dispatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Orders placed before 2:00 PM are inspected, precision crated, and dispatched on the same business day.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-white text-base">5-Layer Shock-Proofing</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Multi-layer thermal bubble wrapping, high-density foam molds, and heavy 5-ply cartons built to absorb impact.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-amber-300">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title font-bold text-white text-base">Live Courier Tracking</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Track your shipment milestone-by-milestone with SMS alerts and real-time portal tracking.
            </p>
          </div>
        </div>

        {/* Live Delivery Times Table */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
            <div>
              <span className="text-xs uppercase font-bold text-[#B45309] tracking-wider">
                Timelines & Estimated Fees
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-white mt-1">
                Estimated Delivery Schedule by Region
              </h2>
            </div>
            <button
              onClick={() => {
                if ((window as any).__navigateApp) {
                  (window as any).__navigateApp('/track-order');
                }
              }}
              className="bg-[#0A3825] hover:bg-[#062418] text-amber-300 border border-[#D4AF37]/40 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-all shadow-md"
            >
              <Truck className="w-4 h-4 text-amber-300" /> Track Existing Order
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Destination / City</th>
                  <th className="py-3 px-4">Estimated Transit Time</th>
                  <th className="py-3 px-4">Standard Rate</th>
                  <th className="py-3 px-4">Service Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {deliveryDestinations.map((dest, i) => (
                  <tr key={i} className="hover:bg-slate-800/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {dest.region}
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {dest.time}
                    </td>
                    <td className="py-4 px-4 text-slate-200">{dest.fee}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-amber-300 border border-[#D4AF37]/30">
                        {dest.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 flex items-start gap-3 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> Exact shipping rates for your basket are calculated dynamically at checkout based on destination rules, applicable discount coupons, and total cart value. Free shipping promotions automatically apply at final checkout.
            </p>
          </div>
        </div>

        {/* Shock-Proof Packaging Anatomy */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold text-[#B45309] tracking-wider">
              Engineering Safe Transit
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-white">
              Anatomy of Our 5-Layer Fragile Packaging
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-light">
              Fine bone china demands surgical precision in handling. Here is how we ensure every piece reaches your dining table in flawless condition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packagingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-6 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif-title font-bold text-[#D4AF37]/40">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-amber-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif-title font-bold text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakage Claims & Damaged in Transit Step-by-Step */}
        <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
            <div>
              <span className="text-xs uppercase font-bold text-amber-300 tracking-widest">
                Zero-Breakage Guarantee Policy
              </span>
              <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-white mt-1">
                What to do if an item arrives damaged?
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              48-Hour Claim Window
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-slate-900/80 border border-slate-700/60 rounded-2xl space-y-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs border border-[#D4AF37]/40">
                1
              </div>
              <h4 className="font-serif-title font-bold text-white text-sm">Photograph Damaged Item</h4>
              <p className="text-slate-300 font-light leading-relaxed">
                Take a clear picture of the damaged piece along with the parcel packaging and shipping label within 48 hours of delivery.
              </p>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-700/60 rounded-2xl space-y-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs border border-[#D4AF37]/40">
                2
              </div>
              <h4 className="font-serif-title font-bold text-white text-sm">Send to Concierge</h4>
              <p className="text-slate-300 font-light leading-relaxed">
                WhatsApp us at <strong>+92 324 2303895</strong> or email <strong>concierge@mshometrends.pk</strong> with your Order ID and photo.
              </p>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-700/60 rounded-2xl space-y-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs border border-[#D4AF37]/40">
                3
              </div>
              <h4 className="font-serif-title font-bold text-white text-sm">Immediate Replacement</h4>
              <p className="text-slate-300 font-light leading-relaxed">
                Our support team dispatches a brand new replacement piece within 24 hours with zero additional delivery fee.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-800/60 border border-slate-700/80 rounded-2xl gap-4">
          <div className="text-xs text-slate-300 space-y-1 text-center sm:text-left">
            <span className="font-bold text-white block text-sm">Have more questions about orders or tableware?</span>
            <span className="text-slate-400">Visit our complete Frequently Asked Questions page or contact our team.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToPage('faq')}
              className="bg-[#0A3825] hover:bg-[#062418] text-amber-300 border border-[#D4AF37]/40 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" /> Go to FAQs Page
            </button>
            <button
              onClick={() => navigateToPage('contact')}
              className="bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A3825] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
