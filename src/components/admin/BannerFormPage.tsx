import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Banner } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { ImageUpload } from '../ImageUpload';
import { Image as ImageIcon, Check } from 'lucide-react';

interface BannerFormPageProps {
  bannerToEdit?: Banner | null;
  onClose: () => void;
}

export const BannerFormPage: React.FC<BannerFormPageProps> = ({ bannerToEdit, onClose }) => {
  const { banners, addBanner, updateBanner, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subheading: 'Elevate your dining ritual with our luxury porcelain crockery.',
    image: 'https://images.unsplash.com/photo-1615865417236-d67f589c424d?q=80&w=1920&auto=format&fit=crop',
    ctaText: 'Explore Collection',
    ctaUrl: '/shop',
    order: banners.length + 1,
    active: true,
  });

  useEffect(() => {
    if (bannerToEdit) {
      setFormData({
        title: bannerToEdit.title || '',
        subheading: bannerToEdit.subheading || bannerToEdit.subtitle || '',
        image: bannerToEdit.image || '',
        ctaText: bannerToEdit.ctaText || 'Shop Collection',
        ctaUrl: bannerToEdit.ctaUrl || bannerToEdit.ctaLink || '/shop',
        order: bannerToEdit.order || 1,
        active: bannerToEdit.active !== false,
      });
    }
  }, [bannerToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Banner headline is required', 'error');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Banner image is required (upload or enter URL)', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (bannerToEdit) {
        await updateBanner({
          ...bannerToEdit,
          title: formData.title.trim(),
          subheading: formData.subheading.trim(),
          subtitle: formData.subheading.trim(),
          image: formData.image.trim(),
          ctaText: formData.ctaText.trim(),
          ctaUrl: formData.ctaUrl.trim(),
          ctaLink: formData.ctaUrl.trim(),
          order: Number(formData.order),
          active: formData.active,
        });
      } else {
        await addBanner({
          title: formData.title.trim(),
          subheading: formData.subheading.trim(),
          subtitle: formData.subheading.trim(),
          image: formData.image.trim(),
          ctaText: formData.ctaText.trim(),
          ctaUrl: formData.ctaUrl.trim(),
          ctaLink: formData.ctaUrl.trim(),
          order: Number(formData.order),
          active: formData.active,
        });
      }
      onClose();
    } catch (err: any) {
      showToast('Failed to save banner to database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={bannerToEdit ? `Edit Hero Banner: ${bannerToEdit.title}` : 'Create New Homepage Hero Banner'}
      subtitle={
        bannerToEdit
          ? 'Customize slider headline, call-to-action button, background photography, and display sequence.'
          : 'Publish high-resolution visual showcase banners for the main storefront carousel.'
      }
      badgeText={bannerToEdit ? 'Editing Banner' : 'New Banner'}
      badgeType={bannerToEdit ? 'edit' : 'create'}
      icon={<ImageIcon className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Banner Headline / Main Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Gold Imperial Dinnerware Collection"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-serif-title text-base font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Subheading / Supporting Caption</label>
          <textarea
            rows={2}
            placeholder="e.g. Handcrafted bone china set with 24K gold trim, thermal-tested for lifetime elegance."
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs leading-relaxed"
          />
        </div>

        {/* Media Upload & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-3">
            <ImageUpload
              label="Banner Image (High-Res 1920x800 Recommended)"
              value={formData.image}
              onImageUploaded={({ url }) => setFormData({ ...formData, image: url })}
              onImageRemoved={() => setFormData({ ...formData, image: '' })}
            />

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Or direct banner image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Carousel Slide Preview
            </span>
            <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative group">
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt={formData.title || 'Banner'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">Preview</span>
                    <h5 className="text-xs font-serif-title font-bold text-white line-clamp-1">{formData.title || 'Slide Title'}</h5>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons & Navigation Route */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Call to Action (CTA) Button Text</label>
            <input
              type="text"
              placeholder="e.g. Explore Collection, Shop Now"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">CTA Target Route / Link</label>
            <input
              type="text"
              placeholder="e.g. /shop, /category/dinner-sets"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        {/* Display Order & Active State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="block text-slate-700 font-semibold mb-1">Slide Display Order Sequence</label>
            <input
              type="number"
              min={1}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:border-[#D4AF37]"
            />
            <span className="text-[10px] text-slate-500">Lower numbers appear first on the carousel</span>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-3">
            <input
              type="checkbox"
              id="bannerActiveSwitch"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 text-[#0A3825] focus:ring-[#D4AF37] rounded border-amber-300 cursor-pointer"
            />
            <div>
              <label htmlFor="bannerActiveSwitch" className="text-xs font-bold text-[#0A3825] cursor-pointer block">
                Live & Active on Carousel
              </label>
              <span className="text-[10px] text-amber-900">Uncheck to temporarily hide from storefront visitors</span>
            </div>
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
            <span>{isSubmitting ? 'Publishing...' : bannerToEdit ? 'Save Changes' : 'Publish Hero Banner'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
