import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { Tag, Check, DollarSign, Percent } from 'lucide-react';

interface CouponFormPageProps {
  couponToEdit?: Coupon | null;
  onClose: () => void;
}

export const CouponFormPage: React.FC<CouponFormPageProps> = ({ couponToEdit, onClose }) => {
  const { products, addCoupon, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as Coupon['discountType'],
    discountValue: 15,
    minSpend: 100,
    expiryDate: '2026-12-31',
    productId: '',
    active: true,
  });

  useEffect(() => {
    if (couponToEdit) {
      setFormData({
        code: couponToEdit.code || '',
        discountType: couponToEdit.discountType || 'percentage',
        discountValue: couponToEdit.discountValue ?? 15,
        minSpend: couponToEdit.minSpend ?? 100,
        expiryDate: couponToEdit.expiryDate || '2026-12-31',
        productId: couponToEdit.productId || '',
        active: couponToEdit.active !== false,
      });
    }
  }, [couponToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast('Coupon promo code is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selProd = products.find((p) => p.id === formData.productId || p._id === formData.productId);
      addCoupon({
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minSpend: Number(formData.minSpend),
        active: formData.active,
        expiryDate: formData.expiryDate,
        productId: formData.productId || undefined,
        productName: selProd ? selProd.name : undefined,
      });
      showToast('Promo coupon published successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast('Failed to save coupon', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={couponToEdit ? `Edit Coupon: ${couponToEdit.code}` : 'Create New Promotional Coupon'}
      subtitle="Issue percentage or fixed price discount vouchers for storewide carts or selected luxury crockery sets."
      badgeText={couponToEdit ? 'Editing Coupon' : 'New Coupon'}
      badgeType={couponToEdit ? 'edit' : 'create'}
      icon={<Tag className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Coupon Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. LUXURY25, GOLD50, RAMADAN2026"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A3825] font-mono text-base font-bold uppercase tracking-wider focus:outline-none focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="block text-slate-700 font-semibold">Discount Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  formData.discountType === 'percentage'
                    ? 'bg-[#0A3825] text-amber-300 border-[#D4AF37]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Percentage (%)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  formData.discountType === 'fixed'
                    ? 'bg-[#0A3825] text-amber-300 border-[#D4AF37]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Fixed Amount ($)</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1">
            <label className="block text-amber-950 font-bold mb-1">
              Discount Value ({formData.discountType === 'percentage' ? '%' : '$ USD'}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:border-amber-600"
            />
            <span className="text-[10px] text-amber-900 font-medium">
              {formData.discountType === 'percentage'
                ? `Customer gets ${formData.discountValue}% discount off total`
                : `Customer gets $${formData.discountValue} flat deduction`}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Coupon Scope (Target Product or Entire Store)</label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
          >
            <option value="">🌐 Storewide (Applies to any customer order)</option>
            <optgroup label="Product-Specific Discounts (Applies exclusively to selected item)">
              {products.map((p, idx) => (
                <option key={p.id || p._id ? `cpop-${p.id || p._id}-${idx}` : `cpop-${idx}`} value={p.id || p._id}>
                  🏷️ {p.name} (${(p.price || 0).toFixed(2)})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Minimum Order Spend ($ USD)</label>
            <input
              type="number"
              min={0}
              value={formData.minSpend}
              onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Set 0 for no minimum purchase limit</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Expiration Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-bold text-xs uppercase tracking-wider shadow-lg border border-[#D4AF37]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create & Activate Coupon'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
