import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  badgeText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeText }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    navigateToPage,
  } = useStore();

  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const isSaved = isInWishlist(product.id);

  // Determine badge text
  const badge = badgeText || (
    product.isBestSeller || product.isBestseller
      ? 'Customer favorite'
      : product.isNewArrival
      ? 'New'
      : product.discountPercentage && product.discountPercentage > 0
      ? `Promotion -${product.discountPercentage}%`
      : product.isFeatured || product.featured
      ? '24K Gold Gilded'
      : null
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Luxury color tone swatches based on product materials/colors
  const colorSwatches = [
    '#D4AF37', // Gold
    '#0A3825', // Emerald
    '#E2DDD2', // Ivory Bone China
    '#4A5568', // Slate Grey
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[#F4F1EA]/80 hover:bg-[#EFEBE1] border border-stone-200/80 hover:border-[#D4AF37]/50 p-3.5 sm:p-5 transition-all duration-400 hover:shadow-xl hover:shadow-[#0A3825]/5 cursor-pointer overflow-hidden"
      onClick={() => navigateToPage('product-detail', product.id)}
    >
      {/* Top Header Row: Badge & Wishlist */}
      <div className="flex items-center justify-between z-10 w-full mb-1.5 sm:mb-2">
        {badge ? (
          <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide bg-white/90 text-[#0A3825] border border-stone-200/80 shadow-xs backdrop-blur-md max-w-[65%] truncate">
            {badge}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide bg-white/70 text-stone-500 max-w-[65%] truncate">
            {product.category || 'Luxury Tableware'}
          </span>
        )}

        {/* Action Buttons: Wishlist & Quick View */}
        <div className="flex items-center gap-1 sm:gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-[#0A3825] text-stone-600 hover:text-amber-300 flex items-center justify-center transition-all shadow-xs"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
              isSaved
                ? 'bg-[#D4AF37] text-[#0A3825]'
                : 'bg-white/80 hover:bg-rose-50 text-stone-600 hover:text-rose-600'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Centered Product Image */}
      <div className="relative w-full aspect-square my-2 flex items-center justify-center overflow-hidden rounded-2xl">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'; }}
          className="w-full h-full object-contain p-2 filter drop-shadow-md group-hover:scale-108 group-hover:-translate-y-1 transition-all duration-500 ease-out"
        />
      </div>

      {/* Color Swatch Dots */}
      <div className="flex items-center gap-1.5 my-2">
        {colorSwatches.slice(0, 3).map((color, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVariant(idx);
            }}
            style={{ backgroundColor: color }}
            className={`w-3 h-3 rounded-full border transition-all ${
              selectedVariant === idx
                ? 'ring-2 ring-[#0A3825] ring-offset-1 border-transparent scale-110'
                : 'border-stone-300 opacity-80 hover:opacity-100'
            }`}
          />
        ))}
      </div>

      {/* Product Title */}
      <div className="mt-1 mb-3">
        <h3 className="text-sm sm:text-[15px] font-medium text-[#0A3825] line-clamp-2 leading-snug group-hover:text-[#B45309] transition-colors">
          {product.name}
        </h3>
        {product.pieces && (
          <p className="text-[11px] text-stone-500 mt-0.5">
            {product.pieces} Complete Set • {product.material}
          </p>
        )}
      </div>

      {/* Bottom Bar: Price & Add to Cart Button */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base sm:text-lg font-bold text-[#0A3825]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-stone-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Minimalist Cart Pill Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
            isAdded
              ? 'bg-emerald-700 text-white'
              : 'bg-[#0A3825] text-amber-100 hover:bg-[#D4AF37] hover:text-[#0A3825]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
