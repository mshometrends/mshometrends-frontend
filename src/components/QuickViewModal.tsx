import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Bell, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToPage,
  } = useStore();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isSaved = isInWishlist(quickViewProduct.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <img
                src={quickViewProduct.images[selectedImgIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-3">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImgIndex ? 'border-[#D4AF37] scale-105' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Summary */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="text-[#B45309] font-bold uppercase">{quickViewProduct.category}</span>
                <span className="bg-emerald-50 text-[#0A3825] px-2.5 py-0.5 rounded border border-emerald-200 font-semibold">
                  {quickViewProduct.material}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#0A3825]">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {quickViewProduct.rating} ({quickViewProduct.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-[#0A3825]">${quickViewProduct.price}</span>
                {quickViewProduct.oldPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${quickViewProduct.oldPrice}
                  </span>
                )}
                {(!quickViewProduct.inStock || quickViewProduct.stockQuantity <= 0) && (
                  <span className="ml-auto text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-600" /> Sold Out
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                {quickViewProduct.description}
              </p>

              {quickViewProduct.dimensions && (
                <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
                  <strong className="text-slate-800">Dimensions:</strong> {quickViewProduct.dimensions}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              {(!quickViewProduct.inStock || quickViewProduct.stockQuantity <= 0) ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      navigateToPage('product-detail', quickViewProduct.id);
                    }}
                    className="w-full bg-[#0A3825] hover:bg-[#062418] text-[#D4AF37] font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-[#D4AF37]/40 cursor-pointer"
                  >
                    <Bell className="w-4 h-4 fill-current animate-pulse" />
                    <span>Notify Me When In Stock</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center">
                    Visit product details to submit your email for restock alerts.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-[#0A3825]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(quickViewProduct)}
                      className={`p-3 rounded-xl border border-slate-200 transition-colors ${
                        isSaved ? 'bg-[#D4AF37] text-[#0A3825]' : 'bg-slate-50 text-slate-700 hover:text-[#0A3825]'
                      }`}
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct, quantity);
                        setQuickViewProduct(null);
                      }}
                      className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm border border-[#D4AF37]/30"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" /> Add To Cart
                    </button>

                    <button
                      onClick={() => {
                        setQuickViewProduct(null);
                        navigateToPage('product-detail', quickViewProduct.id);
                      }}
                      className="bg-[#FAF9F6] hover:bg-slate-100 text-[#0A3825] font-bold py-3.5 rounded-xl border border-slate-300 transition-all text-sm"
                    >
                      Full Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
