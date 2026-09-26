import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_PHONE_DISPLAY, buildWhatsAppContactUrl } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = buildWhatsAppContactUrl();

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 flex items-center group">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl border border-white/25 transition-all cursor-pointer font-sans"
        aria-label={`Chat on WhatsApp with MS Home Trends at ${STORE_PHONE_DISPLAY}`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-emerald-950/80 leading-none">
            Chat WhatsApp
          </span>
          <span className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-xs">
            {STORE_PHONE_DISPLAY}
          </span>
        </div>
      </motion.a>
    </div>
  );
};
