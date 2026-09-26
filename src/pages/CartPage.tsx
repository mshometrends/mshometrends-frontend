import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Trash2, Tag, ArrowRight, ArrowLeft, Truck, ShieldCheck, MapPin } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartDiscount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateToPage,
    calculateShippingFee,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [shippingCity, setShippingCity] = useState('Karachi');
  const [shippingCountry, setShippingCountry] = useState('Pakistan');
  const [shippingZip, setShippingZip] = useState('75600');
  const [estShipping, setEstShipping] = useState({ fee: 5.0, deliveryTime: '1-2 Days Express Delivery' });

  useEffect(() => {
    let isMounted = true;
    calculateShippingFee(shippingCountry, shippingCity, shippingZip).then((res) => {
      if (isMounted && res) {
        setEstShipping(res);
      }
    });
    return () => { isMounted = false; };
  }, [shippingCountry, shippingCity, shippingZip]);

  const grandEstTotal = Math.max(0, finalTotal + estShipping.fee);

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 text-slate-800">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
              Your Selection
            </span>
            <h1 className="text-3xl font-serif-title font-bold text-[#0A3825] mt-1">
              Shopping Cart ({cart.length} items)
            </h1>
          </div>

          <button
            onClick={() => navigateToPage('products')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0A3825] hover:text-[#B45309]"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-16 bg-white border border-slate-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <ShoppingBag className="w-16 h-16 stroke-1 text-[#0A3825] mx-auto" />
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">Your Cart is Currently Empty</h3>
            <p className="text-xs text-slate-500 font-light">
              Explore our dinner sets, tea suites, and crystal glassware to curate your table.
            </p>
            <button
              onClick={() => navigateToPage('products')}
              className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-md border border-[#D4AF37]/30"
            >
              Explore Tableware Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={item.product?.id || item.product?._id ? `${item.product.id || item.product._id}-${idx}` : `cartpage-${idx}`}
                  className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-sm"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-cover rounded-xl shrink-0 border border-slate-200 bg-slate-50"
                  />

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-serif-title font-bold text-[#0A3825]">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {item.product.category} • {item.product.material}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#0A3825]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Unit: ${item.product?.price ?? 0}</span>
                        <strong className="text-sm font-bold text-[#0A3825]">
                          ${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 shadow-md sticky top-24">
              <h3 className="text-lg font-serif-title font-bold text-[#0A3825] border-b border-slate-200 pb-3">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#0A3825]">
                        <Tag className="w-3.5 h-3.5 text-amber-600" /> Coupon <strong>{appliedCoupon.code}</strong> Active
                      </span>
                      <button onClick={removeCoupon} className="text-rose-700 hover:text-rose-900 text-[11px] underline font-bold cursor-pointer">
                        Remove
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      {appliedCoupon.productName ? `Item offer on: ${appliedCoupon.productName}` : 'Storewide offer active'}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#D4AF37] text-slate-800 placeholder-slate-400 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (applyCoupon(couponCode)) setCouponCode('');
                      }}
                      className="bg-[#0A3825] hover:bg-[#062418] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* City & Zip Code Shipping Estimator */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0A3825]">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Estimate Shipping Rate</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">City</label>
                    <select
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Karachi">Karachi (Express)</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="All">Other Pakistan City</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Zip / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 75600"
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex justify-between items-center font-semibold">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Truck className="w-3 h-3 text-emerald-700" /> {estShipping?.deliveryTime || 'Standard'}
                  </span>
                  <span className="font-serif-title font-bold text-xs text-[#0A3825]">
                    ${(estShipping?.fee || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-800">${(cartTotal || 0).toFixed(2)}</span>
                </div>

                {(cartDiscount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-${(cartDiscount || 0).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Calculated Shipping ({shippingCity})</span>
                  <span className="font-semibold text-slate-800">${(estShipping?.fee || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#0A3825] pt-3 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span>${(grandEstTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigateToPage('checkout')}
                className="w-full bg-[#0A3825] hover:bg-[#062418] text-white font-semibold py-4 rounded-xl text-sm shadow-md border border-[#D4AF37]/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>Free Insured Express Shipping on orders $150+</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>256-bit encrypted checkout protection</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
