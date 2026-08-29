import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Truck,
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  AlertCircle,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  Camera,
  Banknote,
  Send,
  HelpCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, finalTotal, cartTotal, cartDiscount, clearCart, calculateShippingFee, navigateToPage } = useStore();

  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    city: 'Karachi',
    postalCode: '75600',
    notes: '',
  });

  const [calculatedShipping, setCalculatedShipping] = useState({
    fee: 10.0,
    deliveryTime: '1-3 Days Express Delivery',
  });

  const [paymentMethod, setPaymentMethod] = useState<
    'Easypaisa' | 'Cash on Delivery'
  >('Easypaisa');

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    calculateShippingFee('Pakistan', customer.city, customer.postalCode).then((res) => {
      if (isMounted && res) {
        setCalculatedShipping(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [customer.city, customer.postalCode]);

  const grandTotalWithShipping = Math.max(0, (Number(finalTotal) || 0) + (Number(calculatedShipping?.fee) || 0));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (
      !customer.fullName.trim() ||
      !customer.phone.trim() ||
      !customer.whatsappNumber.trim() ||
      !customer.address.trim() ||
      !customer.city.trim()
    ) {
      setErrorMessage('Please fill in all required customer details (Name, Phone, WhatsApp, Address, City).');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const orderPayload = {
        customer,
        items: (cart || []).map((item) => {
          const price = Number(item?.product?.price) || 0;
          const qty = Number(item?.quantity) || 1;
          return {
            productId: item?.product?.id || item?.product?._id || '',
            name: item?.product?.name || 'Product',
            image: item?.product?.images?.[0] || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
            quantity: qty,
            price: price,
            subtotal: price * qty,
          };
        }),
        paymentMethod,
        notes: customer.notes,
        deliveryCharges: Number(calculatedShipping?.fee) || 0,
        discount: Number(cartDiscount) || 0,
      };

      const res = await apiFetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        clearCart();
        const createdOrder = json.data;
        navigate(`/order-success/${createdOrder.orderId}`);
      } else {
        setErrorMessage(json.message || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while placing order. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-200">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-400 mb-6">Add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#0A3825] hover:bg-[#062418] text-white px-6 py-2.5 rounded-xl text-sm font-medium border border-[#D4AF37]/30 transition-all cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-12 px-4 sm:px-6 lg:px-10 xl:px-14">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-amber-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Checkout & Manual WhatsApp Verification</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details Form */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-lg font-serif font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" /> 1. Customer & Shipping Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zain Ahmed"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    WhatsApp Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={customer.whatsappNumber}
                    onChange={(e) => setCustomer({ ...customer, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Complete Shipping Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Apartment #, Street Address, Area"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Karachi, Lahore, Islamabad, etc."
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="75600"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Additional Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Special delivery instructions, gift notes, etc."
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Preferred Payment Instructions */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-lg font-serif font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> 2. Preferred Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(['Easypaisa', 'Cash on Delivery'] as const).map(
                  (pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-4 rounded-2xl border text-center font-semibold transition-all cursor-pointer ${
                        paymentMethod === pm
                          ? 'bg-[#0A3825] border-[#D4AF37] text-amber-300 shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pm === 'Easypaisa' ? 'Easypaisa (0324-2303895)' : pm}
                    </button>
                  )
                )}
              </div>

              {paymentMethod === 'Easypaisa' && (
                <div className="space-y-4">
                  {/* Account Highlights Banner */}
                  <div className="p-4 sm:p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          Official Account
                        </span>
                        <span className="text-white font-bold text-sm">MS Home Trends</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Account Title: <strong className="text-emerald-300">MS Home Trends</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 px-3 py-2 rounded-xl">
                      <div className="text-left">
                        <span className="text-[9px] text-slate-400 block leading-none">EasyPaisa Number</span>
                        <span className="font-mono font-bold text-amber-300 text-sm tracking-wide">
                          0324 2303895
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber('03242303895')}
                        className="p-1.5 bg-emerald-700/50 hover:bg-emerald-600 text-white rounded-lg transition-all cursor-pointer ml-1"
                        title="Copy EasyPaisa Number"
                      >
                        {copiedNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step-by-Step 'How to Pay' Guide with Icons */}
                  <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          How to Pay via EasyPaisa (Step-by-Step Guide)
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateToPage('how-to-pay')}
                        className="text-[10px] text-emerald-300 hover:text-emerald-200 underline font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30 cursor-pointer flex items-center gap-1"
                      >
                        <span>Full Page Guide →</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Step 1 */}
                      <div className="flex gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-[11px]">1.</span> Open EasyPaisa App
                          </p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Open your EasyPaisa app and tap on <strong className="text-slate-200">"Send Money"</strong> ➔ <strong className="text-slate-200">"EasyPaisa Transfer"</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-bold">
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-[11px]">2.</span> Enter Account Details
                          </p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Enter receiver number <strong className="text-amber-300 font-mono">0324 2303895</strong>. Verify title is <strong className="text-slate-200">MS Home Trends</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-bold">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-[11px]">3.</span> Enter Bill Amount
                          </p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Enter the exact bill total (Rs. {finalTotal.toFixed(2)}) and tap <strong className="text-slate-200">Send Now</strong> to confirm payment.
                          </p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-[11px]">4.</span> Share Proof on WhatsApp
                          </p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            Save receipt screenshot & send it to <strong className="text-emerald-300 font-mono">+92 324 2303895</strong> for instant order approval!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-amber-300">Cash on Delivery (COD):</p>
                  <p>
                    Pay cash directly to the courier upon delivery at your doorstep across Pakistan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(cart || []).map((item, idx) => {
                const itemPrice = Number(item?.product?.price) || 0;
                const itemQty = Number(item?.quantity) || 1;
                const itemSubtotal = Number(item?.subtotal) || itemPrice * itemQty;
                const itemImage = item?.product?.images?.[0] || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800';
                return (
                  <div key={item?.product?.id || item?.product?._id || idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={itemImage}
                      alt=""
                      className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-800 bg-slate-950"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-200 line-clamp-1">{item?.product?.name || 'Product'}</h5>
                      <span className="text-slate-400">Qty: {itemQty}</span>
                    </div>
                    <span className="font-bold text-amber-300">
                      Rs. {(Number(itemSubtotal) || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">Rs. {(Number(cartTotal) || 0).toFixed(2)}</span>
              </div>

              {(Number(cartDiscount) || 0) > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-Rs. {(Number(cartDiscount) || 0).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-200">
                  Rs. {(Number(calculatedShipping?.fee) || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-amber-300">Rs. {(Number(grandTotalWithShipping) || 0).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0A3825] hover:bg-[#062418] disabled:opacity-50 text-white font-bold py-4 rounded-xl text-sm shadow-xl border border-[#D4AF37]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Invoice...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" /> Place Order & Get Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
