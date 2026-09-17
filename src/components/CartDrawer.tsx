import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartDiscount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateToPage,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B45309]" />
              <h3 className="text-lg font-serif-title font-bold text-[#0A3825]">Your Crockery Cart</h3>
              <span className="text-xs bg-emerald-100 text-[#0A3825] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-500 hover:text-slate-900 p-1 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Break-Safe Packaging Guarantee Banner */}
          <div className="bg-emerald-50/80 p-3.5 border-b border-emerald-200/80 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium text-[#0A3825]">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              Break-Safe 5-Layer Shockproof Transit Packing Guaranteed
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500 py-12">
                <ShoppingBag className="w-16 h-16 stroke-1 text-[#0A3825]" />
                <p className="text-sm font-light text-slate-600">
                  Your cart is currently empty. Explore our fine bone china & stoneware tableware.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToPage('products');
                  }}
                  className="bg-[#0A3825] hover:bg-[#062418] text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-md border border-[#D4AF37]/30"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={item.product?.id || item.product?._id ? `${item.product.id || item.product._id}-${idx}` : `cart-${idx}`}
                  className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-slate-200 bg-white"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h5 className="text-xs font-serif-title font-bold text-[#0A3825] line-clamp-1">
                          {item.product.name}
                        </h5>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.product.material}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-6 h-6 text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#0A3825]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-6 h-6 text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#0A3825]">
                        ${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Coupon Section */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex flex-col gap-1 p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#0A3825]">
                        <Tag className="w-3.5 h-3.5 text-amber-600" /> Coupon <strong>{appliedCoupon.code}</strong>
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-rose-700 hover:text-rose-900 text-[11px] underline font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      {appliedCoupon.productName ? `Product Discount: ${appliedCoupon.productName}` : 'Storewide Cart Discount'}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 focus:border-[#D4AF37] text-slate-800 placeholder-slate-400 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (applyCoupon(couponCodeInput)) {
                          setCouponCodeInput('');
                        }
                      }}
                      className="bg-[#0A3825] hover:bg-[#062418] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Subtotal & Totals */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${(cartTotal || 0).toFixed(2)}</span>
                </div>
                {(cartDiscount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-${(cartDiscount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-800">{cartTotal > 150 ? 'FREE' : '$15.00'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0A3825] pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>${(finalTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToPage('cart');
                  }}
                  className="bg-white hover:bg-slate-100 text-[#0A3825] font-bold py-3 rounded-xl border border-slate-300 text-xs transition-colors"
                >
                  View Cart
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToPage('checkout');
                  }}
                  className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold py-3 rounded-xl text-xs shadow-md border border-[#D4AF37]/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
