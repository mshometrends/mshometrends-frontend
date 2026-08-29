import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Offer } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { Sparkles, Tag, Flame, Gift, Truck, Check, Eye, Compass } from 'lucide-react';

interface OfferFormPageProps {
  offerToEdit?: Offer | null;
  onClose: () => void;
}

export const OfferFormPage: React.FC<OfferFormPageProps> = ({ offerToEdit, onClose }) => {
  const { products, categories, addOffer, updateOffer, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    badge: 'RAMADAN & EID SPECIAL',
    badgeType: 'amber' as 'gold' | 'emerald' | 'amber' | 'rose',
    title: '',
    description: '',
    code: '',
    discountText: '',
    targetPage: 'products',
    targetParam: '',
    order: 1,
    active: true,
  });

  useEffect(() => {
    if (offerToEdit) {
      setFormData({
        badge: offerToEdit.badge || '',
        badgeType: (offerToEdit.badgeType as any) || 'gold',
        title: offerToEdit.title || '',
        description: offerToEdit.description || '',
        code: offerToEdit.code || '',
        discountText: offerToEdit.discountText || '',
        targetPage: offerToEdit.targetPage || 'products',
        targetParam: offerToEdit.targetParam || '',
        order: offerToEdit.order ?? 1,
        active: offerToEdit.active !== false,
      });
    }
  }, [offerToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.badge.trim()) {
      showToast('Offer badge text is required', 'error');
      return;
    }
    if (!formData.title.trim()) {
      showToast('Offer title headline is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Offer description is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (offerToEdit) {
        await updateOffer({
          ...offerToEdit,
          badge: formData.badge.trim().toUpperCase(),
          badgeType: formData.badgeType,
          title: formData.title.trim(),
          description: formData.description.trim(),
          code: formData.code.trim() ? formData.code.trim().toUpperCase() : undefined,
          discountText: formData.discountText.trim() || undefined,
          targetPage: formData.targetPage,
          targetParam: formData.targetParam.trim() || undefined,
          order: Number(formData.order) || 1,
          active: formData.active,
        });
      } else {
        await addOffer({
          badge: formData.badge.trim().toUpperCase(),
          badgeType: formData.badgeType,
          title: formData.title.trim(),
          description: formData.description.trim(),
          code: formData.code.trim() ? formData.code.trim().toUpperCase() : undefined,
          discountText: formData.discountText.trim() || undefined,
          targetPage: formData.targetPage,
          targetParam: formData.targetParam.trim() || undefined,
          order: Number(formData.order) || 1,
          active: formData.active,
        });
      }
      onClose();
    } catch (err: any) {
      showToast('Error saving offer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const badgeThemeClasses = {
    amber: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    gold: 'bg-[#D4AF37]/20 text-amber-200 border-[#D4AF37]/40',
    emerald: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    rose: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
  };

  return (
    <AdminFormLayout
      title={offerToEdit ? `Edit Offer: ${offerToEdit.badge}` : 'Create Top Promo Offer / Announcement'}
      subtitle="Publish promotional headlines, seasonal sale vouchers, and free shipping notices to the top announcement bar below the header."
      badgeText={offerToEdit ? 'Editing Offer' : 'New Offer'}
      badgeType={offerToEdit ? 'edit' : 'create'}
      icon={<Sparkles className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-4xl"
    >
      {/* Live Visual Preview */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#072418] via-[#0A3825] to-[#072418] border border-[#D4AF37]/30 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-amber-300" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            Live Offers Bar Preview
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-400/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm ${
                badgeThemeClasses[formData.badgeType]
              }`}
            >
              {formData.badge || 'PROMO BADGE'}
            </span>
            <span className="text-xs font-semibold text-white">
              {formData.title || 'Enter your promotional headline below'}
            </span>
            {formData.description && (
              <span className="hidden md:inline text-xs text-amber-100/70 border-l border-white/20 pl-2">
                {formData.description}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {formData.code && (
              <div className="flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2.5 py-1 rounded-lg text-amber-200 font-mono text-xs font-bold">
                <Tag className="w-3 h-3 text-amber-300" />
                <span>{formData.code.toUpperCase()}</span>
              </div>
            )}
            {formData.discountText && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[11px] font-bold">
                {formData.discountText}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Badge Text */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Badge Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RAMADAN & EID SPECIAL, LIMITED FLASH DEAL, FLAGSHIP OFFER"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value.toUpperCase() })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[#0A3825] font-bold uppercase tracking-wider focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Displays as a highlighted pill tag in the offers carousel bar.
            </p>
          </div>

          {/* Badge Color Theme */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Badge Color Scheme</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'amber', label: 'Amber / Gold', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                { id: 'gold', label: 'Royal Gold', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                { id: 'emerald', label: 'Emerald Green', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                { id: 'rose', label: 'Ruby / Rose', color: 'bg-rose-100 text-rose-800 border-rose-300' },
              ].map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setFormData({ ...formData, badgeType: theme.id as any })}
                  className={`py-2 px-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                    formData.badgeType === theme.id
                      ? `${theme.color} ring-2 ring-[#0A3825] shadow-sm`
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title Headline */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Offer Headline / Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Get 10% OFF Storewide on Fine Bone China & Porcelain"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Subtitle / Terms & Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            placeholder="e.g. Applicable on luxury dinner sets, tea suites, and decorative tableware with free break-safe shipping."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white resize-none"
          />
        </div>

        {/* Promo Code & Discount Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Promo Coupon Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. LUXURY10"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[#0A3825] font-mono font-bold uppercase focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Visitors can click 'Copy Code' directly in the bar to auto-apply it.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Discount Highlight Text <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 10% OFF, $50 OFF, FREE SHIPPING"
              value={formData.discountText}
              onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        {/* Target Destination & Parameter */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0A3825]" />
            <span className="font-bold text-[#0A3825] text-xs">Navigation Destination Link</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Target Page</label>
              <select
                value={formData.targetPage}
                onChange={(e) => setFormData({ ...formData, targetPage: e.target.value, targetParam: '' })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="home">Home Page</option>
                <option value="products">All Products Catalog</option>
                <option value="category">Category Showcase</option>
                <option value="product-detail">Specific Product Details</option>
                <option value="shipping">Shipping & Delivery Info</option>
                <option value="about">About Brand</option>
                <option value="contact">Contact Us</option>
              </select>
            </div>

            {formData.targetPage === 'category' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Target Category</label>
                <select
                  value={formData.targetParam}
                  onChange={(e) => setFormData({ ...formData, targetParam: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.targetPage === 'product-detail' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Target Product</label>
                <select
                  value={formData.targetParam}
                  onChange={(e) => setFormData({ ...formData, targetParam: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {['home', 'products', 'shipping', 'about', 'contact'].includes(formData.targetPage) && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Custom Anchor / Filter (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. featured, new-arrivals"
                  value={formData.targetParam}
                  onChange={(e) => setFormData({ ...formData, targetParam: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Order & Active Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Carousel Display Order</label>
            <input
              type="number"
              min={1}
              max={99}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Lower numbers appear first in the rotating offer banner.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="font-semibold text-slate-800 block">Active Status</span>
              <span className="text-[10px] text-slate-500">
                {formData.active ? 'Visible in live top offer bar' : 'Hidden from storefront'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                formData.active ? 'bg-[#0A3825] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#0A3825] hover:bg-[#0A3825]/90 text-amber-300 border border-[#D4AF37]/50 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isSubmitting
              ? 'Saving Offer...'
              : offerToEdit
              ? 'Update Offer'
              : 'Publish Promo Offer'}
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
