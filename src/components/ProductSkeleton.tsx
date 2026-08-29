import React from 'react';

interface ProductSkeletonCardProps {
  className?: string;
}

export const ProductSkeletonCard: React.FC<ProductSkeletonCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Product Image Area Shimmer */}
      <div className="relative aspect-square w-full bg-slate-100 shimmer-skeleton">
        {/* Badges Placeholder (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="w-16 h-4.5 bg-slate-200/90 rounded-full shimmer-skeleton border border-white/50" />
        </div>

        {/* Floating Quick Action Buttons Placeholder (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <div className="w-8.5 h-8.5 rounded-full bg-slate-200/90 shimmer-skeleton border border-white/60 shadow-sm" />
          <div className="w-8.5 h-8.5 rounded-full bg-slate-200/90 shimmer-skeleton border border-white/60 shadow-sm" />
        </div>

        {/* Material Badge Placeholder (Bottom Left) */}
        <div className="absolute bottom-3 left-3 w-20 h-4.5 bg-slate-200/90 rounded-md shimmer-skeleton border border-white/60 shadow-xs" />
      </div>

      {/* Content Area Shimmer */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-2.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between">
            <div className="w-24 h-3.5 bg-slate-200/80 rounded-md shimmer-skeleton" />
            <div className="w-14 h-3.5 bg-slate-200/80 rounded-md shimmer-skeleton" />
          </div>

          {/* Product Title Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="w-11/12 h-4 bg-slate-200/90 rounded-md shimmer-skeleton" />
            <div className="w-3/5 h-4 bg-slate-200/70 rounded-md shimmer-skeleton" />
          </div>
        </div>

        {/* Price & Add to Cart Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-20 h-5.5 bg-slate-200/90 rounded-md shimmer-skeleton" />
          </div>

          <div className="w-18 h-8.5 bg-slate-200/90 rounded-xl shimmer-skeleton border border-slate-200/60" />
        </div>
      </div>
    </div>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeletonCard key={`product-skeleton-${idx}`} />
      ))}
    </div>
  );
};
