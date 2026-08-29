import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { ImageUpload } from '../ImageUpload';
import { Package, Sparkles, Check, DollarSign, Layers, Tag, ShieldAlert } from 'lucide-react';

interface ProductFormPageProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const ProductFormPage: React.FC<ProductFormPageProps> = ({ productToEdit, onClose }) => {
  const { categories, addProduct, updateProduct, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: categories.length > 0 ? categories[0].name : 'Dinner Sets',
    price: 150,
    oldPrice: 180,
    stockQuantity: 20,
    material: 'Bone China' as Product['material'],
    color: 'Ivory & Gold',
    description: 'Handcrafted fine crockery set with 24K gold trim.',
    imageUrl: 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=800&auto=format&fit=crop',
    sku: `MS-${Date.now().toString().slice(-4)}`,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    features: '24K Hand-Gilded Gold Trim, Dishwasher & Microwave Safe, Chip-Resistant Bone China, Lead-Free Eco Glaze',
    tags: 'Luxury, Dinnerware, Bestseller',
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || (categories[0]?.name ?? 'Dinner Sets'),
        price: productToEdit.price || 0,
        oldPrice: productToEdit.oldPrice || (productToEdit.price ? productToEdit.price + 30 : 0),
        stockQuantity: productToEdit.stockQuantity ?? 15,
        material: productToEdit.material || 'Bone China',
        color: productToEdit.color || 'White & Gold',
        description: productToEdit.description || '',
        imageUrl: productToEdit.images && productToEdit.images.length > 0 ? productToEdit.images[0] : '',
        sku: productToEdit.sku || `MS-${productToEdit.id}`,
        isFeatured: Boolean(productToEdit.isFeatured || productToEdit.featured),
        isBestSeller: Boolean(productToEdit.isBestSeller),
        isNewArrival: Boolean(productToEdit.isNewArrival),
        features: Array.isArray(productToEdit.features)
          ? productToEdit.features.join(', ')
          : '24K Gold Trim, Handcrafted Fine China',
        tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : 'Luxury, Dinnerware',
      });
    }
  }, [productToEdit, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    if (!formData.imageUrl.trim()) {
      showToast('Product image is required (upload to Cloudinary or paste URL)', 'error');
      return;
    }

    setIsSubmitting(true);
    const parsedFeatures = formData.features
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedTags = formData.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (productToEdit) {
        await updateProduct({
          ...productToEdit,
          name: formData.name.trim(),
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          price: Number(formData.price),
          oldPrice: Number(formData.oldPrice),
          stockQuantity: Number(formData.stockQuantity),
          material: formData.material,
          color: formData.color.trim(),
          description: formData.description.trim(),
          images: [formData.imageUrl.trim()],
          isFeatured: formData.isFeatured,
          featured: formData.isFeatured,
          isBestSeller: formData.isBestSeller,
          isNewArrival: formData.isNewArrival,
          features: parsedFeatures,
          tags: parsedTags.length > 0 ? parsedTags : ['Admin Added', 'Luxury'],
          sku: formData.sku.trim(),
        });
      } else {
        await addProduct({
          name: formData.name.trim(),
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          price: Number(formData.price),
          oldPrice: Number(formData.oldPrice),
          stockQuantity: Number(formData.stockQuantity),
          material: formData.material,
          color: formData.color.trim(),
          description: formData.description.trim(),
          images: [formData.imageUrl.trim()],
          isFeatured: formData.isFeatured,
          featured: formData.isFeatured,
          isBestSeller: formData.isBestSeller,
          isNewArrival: formData.isNewArrival,
          rating: 5.0,
          reviewCount: 1,
          inStock: Number(formData.stockQuantity) > 0,
          sku: formData.sku.trim(),
          features: parsedFeatures,
          tags: parsedTags.length > 0 ? parsedTags : ['Admin Added', 'Luxury'],
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Save product error:', err);
      showToast('Failed to save product. Please check MongoDB connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={productToEdit ? `Edit Product: ${productToEdit.name}` : 'Create New Luxury Crockery Product'}
      subtitle={
        productToEdit
          ? `Modify specifications, stock inventory, and Cloudinary media for SKU: ${formData.sku}`
          : 'Add high-end bone china, porcelain tableware, cutlery, or home decor to MongoDB Atlas.'
      }
      badgeText={productToEdit ? 'Editing Product' : 'New Product'}
      badgeType={productToEdit ? 'edit' : 'create'}
      icon={<Package className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8 text-xs text-slate-700">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-serif-title font-bold text-[#0A3825]">Basic Product Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1.5">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sovereign Platinum 18pc Imperial Dinner Set"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">SKU / Item Code</label>
              <input
                type="text"
                required
                placeholder="e.g. MS-DIN-8902"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-mono text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              >
                {categories.map((c, idx) => (
                  <option key={c.id || c._id ? `copt-${c.id || c._id}-${idx}` : `copt-${idx}`} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Material</label>
              <select
                value={formData.material}
                onChange={(e: any) => setFormData({ ...formData, material: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              >
                <option value="Bone China">Bone China (24K Gold Trim)</option>
                <option value="Porcelain">Fine Porcelain</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Crystal Glass">Crystal Glass</option>
                <option value="Stoneware">Stoneware</option>
                <option value="Stainless Steel">Stainless Steel (Cutlery)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Color / Finish</label>
              <input
                type="text"
                placeholder="e.g. Ivory & 24K Gold, Emerald Green"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock Inventory */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-serif-title font-bold text-[#0A3825]">Pricing & Stock Inventory</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-1">
              <label className="block text-emerald-950 font-bold mb-1">
                Selling Price ($ USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-emerald-800">Final price shown to customers</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <label className="block text-slate-700 font-semibold mb-1">Regular / Original Price ($ USD)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-slate-500">Strikethrough discount price</span>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-1">
              <label className="block text-amber-950 font-bold mb-1">Available Stock (Units)</label>
              <input
                type="number"
                min={0}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:border-amber-600"
              />
              <span className="text-[10px] text-amber-800">Automatic Out of Stock when 0</span>
            </div>
          </div>
        </div>

        {/* Section 3: Media & Cloudinary Upload */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-serif-title font-bold text-[#0A3825]">Product Photography & Media</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-3">
              <ImageUpload
                label="Upload Image via Cloudinary Storage"
                value={formData.imageUrl}
                onImageUploaded={({ url }) => setFormData({ ...formData, imageUrl: url })}
                onImageRemoved={() => setFormData({ ...formData, imageUrl: '' })}
              />

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Or direct image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Live Image Preview
              </span>
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative group">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt={formData.name || 'Preview'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Package className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[11px]">No image selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Descriptions & Highlights */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Detailed Product Description</label>
            <textarea
              rows={4}
              placeholder="Describe the craftsmanship, materials, durability, and luxury feel of this tableware..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Key Features / Bullet Highlights <span className="text-slate-400 font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="24K Hand-Gilded Gold, Dishwasher Safe, Chip Resistant, Thermal Shock Tested"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Search Tags / Badges <span className="text-slate-400 font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="Luxury, Bestseller, Dinner Sets, Wedding Gift"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>
          </div>

          {/* Badges & Showcase Highlights */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A3825] block">
              Storefront Badges & Showcase Status
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Featured Checkbox */}
              <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-2xl">
                <input
                  type="checkbox"
                  id="isFeaturedProductPage"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#0A3825] focus:ring-[#D4AF37] rounded border-amber-400 cursor-pointer mt-0.5"
                />
                <label htmlFor="isFeaturedProductPage" className="text-xs text-[#0A3825] cursor-pointer">
                  <strong className="block font-bold">🌟 Featured Product</strong>
                  <span className="text-[11px] text-slate-500">Highlight on Homepage Carousel</span>
                </label>
              </div>

              {/* Best Seller Checkbox */}
              <div className="flex items-start gap-3 p-3.5 bg-orange-50/80 border border-orange-300/80 rounded-2xl">
                <input
                  type="checkbox"
                  id="isBestSellerProductPage"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-400 rounded border-orange-400 cursor-pointer mt-0.5"
                />
                <label htmlFor="isBestSellerProductPage" className="text-xs text-orange-950 cursor-pointer">
                  <strong className="block font-bold text-orange-900">🔥 Best Seller</strong>
                  <span className="text-[11px] text-slate-500">Show Best Seller Ribbon</span>
                </label>
              </div>

              {/* New Arrival Checkbox */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/80 border border-emerald-300/80 rounded-2xl">
                <input
                  type="checkbox"
                  id="isNewArrivalProductPage"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 focus:ring-emerald-400 rounded border-emerald-400 cursor-pointer mt-0.5"
                />
                <label htmlFor="isNewArrivalProductPage" className="text-xs text-emerald-950 cursor-pointer">
                  <strong className="block font-bold text-emerald-900">✨ New Arrival</strong>
                  <span className="text-[11px] text-slate-500">Mark as New Collection</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel & Discard
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-bold text-xs uppercase tracking-wider shadow-lg border border-[#D4AF37]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : productToEdit ? 'Update Product in Atlas' : 'Publish Product to Store'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
