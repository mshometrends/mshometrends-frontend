import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingRule } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { Truck, MapPin, Check } from 'lucide-react';

interface ShippingFormPageProps {
  shippingToEdit?: ShippingRule | null;
  onClose: () => void;
}

export const ShippingFormPage: React.FC<ShippingFormPageProps> = ({ shippingToEdit, onClose }) => {
  const { categories, products, addShippingRule, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    country: 'Pakistan',
    city: 'Karachi',
    zipCode: 'All',
    categoryId: 'All',
    productId: 'All',
    shippingFee: 5.0,
    deliveryTime: '1-2 Days Express Delivery',
    isActive: true,
  });

  useEffect(() => {
    if (shippingToEdit) {
      setFormData({
        country: shippingToEdit.country || 'Pakistan',
        city: shippingToEdit.city || 'Karachi',
        zipCode: shippingToEdit.zipCode || 'All',
        categoryId: shippingToEdit.categoryId || 'All',
        productId: shippingToEdit.productId || 'All',
        shippingFee: shippingToEdit.shippingFee ?? 5.0,
        deliveryTime: shippingToEdit.deliveryTime || '1-2 Days Express Delivery',
        isActive: shippingToEdit.isActive !== false,
      });
    }
  }, [shippingToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country.trim() || !formData.city.trim()) {
      showToast('Country and City are required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find((c) => c.id === formData.categoryId || c._id === formData.categoryId);
      const selectedProduct = products.find((p) => p.id === formData.productId || p._id === formData.productId);

      addShippingRule({
        country: formData.country.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim() || 'All',
        categoryId: formData.categoryId,
        categoryName: selectedCategory ? selectedCategory.name : 'All Categories',
        productId: formData.productId,
        productName: selectedProduct ? selectedProduct.name : 'All Products',
        shippingFee: Number(formData.shippingFee) || 0,
        deliveryTime: formData.deliveryTime.trim() || '2-4 Business Days',
        isActive: formData.isActive,
      });
      showToast('Shipping zone & fee rule saved successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast('Failed to save shipping rule', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={shippingToEdit ? `Edit Shipping Zone: ${shippingToEdit.city}` : 'Add New Shipping Zone & Rate'}
      subtitle="Define delivery costs and expected delivery timeframes based on customer destination (e.g. Karachi express, nationwide Pakistan, or international)."
      badgeText={shippingToEdit ? 'Editing Zone' : 'New Shipping Zone'}
      badgeType={shippingToEdit ? 'edit' : 'create'}
      icon={<Truck className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pakistan, UAE, United States, or All"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              City / Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Karachi, Lahore, Islamabad, or All"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Zip Code / Area</label>
            <input
              type="text"
              placeholder="e.g. 75210, Clifton, or All"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
            <label className="block text-emerald-950 font-bold mb-1">
              Shipping Fee ($ USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              step="0.5"
              min={0}
              value={formData.shippingFee}
              onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Estimated Delivery Timeframe</label>
            <input
              type="text"
              required
              placeholder="e.g. 1-2 Days Express, 3-5 Days Standard"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Category Specific Scope</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">🌐 All Categories (Default)</option>
              {categories.map((c, idx) => (
                <option key={c.id || c._id ? `scat-${c.id || c._id}-${idx}` : `scat-${idx}`} value={c.id || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Product Specific Scope</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">🌐 All Products (Default)</option>
              {products.map((p, idx) => (
                <option key={p.id || p._id ? `sprod-${p.id || p._id}-${idx}` : `sprod-${idx}`} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#0A3825]">
            <MapPin className="w-4 h-4 text-amber-700" />
            Automatic Checkout Calculation Rule
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            When customers enter this Destination City or Country during checkout, our calculation engine automatically applies the appropriate shipping fee and estimated delivery date to their invoice.
          </p>
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
            <span>{isSubmitting ? 'Saving Zone...' : 'Save & Publish Shipping Zone'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
