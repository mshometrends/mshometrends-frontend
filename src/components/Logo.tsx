import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  isDarkBg?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'sm',
  showTagline = true,
  className = '',
  isDarkBg = false,
}) => {
  // Dimensions mapping - sleek, compact, and luxury-proportioned
  const sizeMap = {
    xs: {
      circle: 'w-7 h-7',
      leaf: 'w-2.5 h-2.5 -top-1 right-1',
      monogram: 'text-xs',
      textTitle: 'text-xs',
      tagline: 'text-[6.5px]',
      gap: 'gap-2',
    },
    sm: {
      circle: 'w-8 h-8 sm:w-9 sm:h-9',
      leaf: 'w-3 h-3 -top-1 right-1',
      monogram: 'text-sm sm:text-base',
      textTitle: 'text-[13px] sm:text-[14.5px]',
      tagline: 'text-[7px] sm:text-[7.5px]',
      gap: 'gap-2.5',
    },
    md: {
      circle: 'w-10 h-10',
      leaf: 'w-3.5 h-3.5 -top-1.5 right-1.5',
      monogram: 'text-base',
      textTitle: 'text-base sm:text-[16px]',
      tagline: 'text-[8px]',
      gap: 'gap-3',
    },
    lg: {
      circle: 'w-13 h-13',
      leaf: 'w-4 h-4 -top-2 right-2',
      monogram: 'text-xl',
      textTitle: 'text-xl',
      tagline: 'text-[9.5px]',
      gap: 'gap-3.5',
    },
    xl: {
      circle: 'w-18 h-18',
      leaf: 'w-5.5 h-5.5 -top-2.5 right-2.5',
      monogram: 'text-2xl',
      textTitle: 'text-2xl',
      tagline: 'text-[11px]',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Circle Icon Badge */}
      <div
        className={`relative ${currentSize.circle} rounded-full border-[1.5px] border-[#D4AF37] ${
          isDarkBg ? 'bg-[#0A2619]' : 'bg-white shadow-xs shadow-amber-900/10'
        } p-0.5 flex flex-col items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        {/* Leaf sprout motif in Gold */}
        <div className={`absolute ${currentSize.leaf} text-[#D4AF37] pointer-events-none`}>
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3c-3 0-6 2.5-7 5-1-2.5-4-5-7-5 0 6 4 10 7 10 1-2.5 4-5 7-5z" />
            <path d="M12 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* MS Monogram */}
        <div className={`flex items-baseline justify-center font-serif-title font-bold tracking-tighter leading-none ${currentSize.monogram}`}>
          <span className="text-[#0A3825]">M</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F59E0B] via-[#D4AF37] to-[#B45309] -ml-0.5">
            S
          </span>
        </div>

        {/* Inner Gold Ring highlight */}
        <div className="absolute inset-[1.5px] rounded-full border border-[#D4AF37]/30 pointer-events-none" />
      </div>

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center">
          <span
            className={`font-serif-title ${currentSize.textTitle} font-extrabold tracking-[0.09em] leading-tight ${
              isDarkBg ? 'text-white' : 'text-[#0A3825]'
            } uppercase`}
          >
            MS HOME <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B45309]">TRENDS</span>
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="h-[1px] w-2 bg-[#D4AF37]" />
            <span
              className={`font-serif-title ${currentSize.tagline} uppercase tracking-[0.15em] font-semibold leading-none ${
                isDarkBg ? 'text-amber-200/90' : 'text-[#0A3825]/85'
              }`}
            >
              PREMIUM QUALITY, EVERYDAY LIVING
            </span>
            <span className="h-[1px] w-2 bg-[#D4AF37]" />
          </div>
        )}
      </div>
    </div>
  );
};
