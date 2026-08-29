import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Copy, X, Gift, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PromoSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  code?: string;
}

export const PromoSuccessModal: React.FC<PromoSuccessModalProps> = ({
  isOpen,
  onClose,
  userName,
  code = 'WELCOME20',
}) => {
  const { showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      }
      setCopied(true);
      showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    } catch (err) {
      showToast(`Coupon Code: ${code}`, 'info');
    }

    // Automatically close the popup after copying as requested by user
    setTimeout(() => {
      onClose();
      setCopied(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden relative text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Banner */}
          <div className="bg-[#0A3825] p-8 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-xl pointer-events-none" />
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#D4AF37] text-[#0A3825] flex items-center justify-center shadow-lg border border-amber-200">
              <Gift className="w-8 h-8 text-[#0A3825]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              VIP Member Signup Success
            </div>

            <h3 className="text-2xl font-serif-title font-bold text-amber-100">
              Welcome{userName ? `, ${userName}` : ''}!
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1 font-light">
              Your account details have been saved. Here is your special welcome discount code!
            </p>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Exclusive 20% Discount Code
              </p>

              {/* Promo Code Box */}
              <div className="p-4 bg-white border-2 border-dashed border-[#0A3825] rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="text-left pl-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Coupon Code</span>
                  <span className="text-2xl font-mono font-bold text-[#0A3825] tracking-widest">
                    {code}
                  </span>
                </div>
                <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                  20% OFF
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Click below to copy your discount code to clipboard and close this window!
            </p>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500 scale-[0.98]'
                  : 'bg-[#0A3825] hover:bg-[#07291b] text-amber-300 border-[#D4AF37] hover:shadow-2xl'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-white animate-bounce" />
                  <span>Code Copied! Closing...</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-amber-300" />
                  <span>Copy Code & Close</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apply code WELCOME20 during checkout for 20% off.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
