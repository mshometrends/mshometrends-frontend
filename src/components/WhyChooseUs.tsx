import React from 'react';
import { ShieldCheck, Truck, Lock, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Premium Quality',
      desc: 'Translucent 45% bone china & high-fired stoneware guaranteed scratch-resistant.',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      desc: 'Custom wooden crate padded packaging with insured express air shipping.',
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      desc: '256-bit encrypted checkout supporting Cards, Apple Pay, PayPal & COD.',
    },
    {
      icon: Headphones,
      title: '24/7 Concierge Support',
      desc: 'Dedicated table styling specialists and post-purchase replacement care.',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FAF9F6] border-b border-slate-200 w-full">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-start gap-4 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md group"
              >
                <div className="p-3.5 bg-emerald-50 text-[#0A3825] rounded-xl group-hover:bg-[#0A3825] group-hover:text-amber-300 transition-all duration-300 border border-[#D4AF37]/30">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#0A3825] font-serif-title">{feat.title}</h4>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
