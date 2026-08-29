import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { ImageUpload } from '../ImageUpload';
import { FolderTree, Check } from 'lucide-react';

interface CategoryFormPageProps {
  categoryToEdit?: Category | null;
  onClose: () => void;
}

export const CategoryFormPage: React.FC<CategoryFormPageProps> = ({ categoryToEdit, onClose }) => {
  const { addCategory, updateCategory, showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        slug: categoryToEdit.slug || categoryToEdit.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryToEdit.description || '',
        imageUrl: categoryToEdit.image || '',
      });
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (categoryToEdit) {
        await updateCategory({
          ...categoryToEdit,
          name: formData.name.trim(),
          slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim(),
          image: formData.imageUrl.trim(),
        });
      } else {
        await addCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim(),
          image: formData.imageUrl.trim(),
        });
      }
      onClose();
    } catch (err: any) {
      showToast('Failed to save category in MongoDB', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={categoryToEdit ? `Edit Category: ${categoryToEdit.name}` : 'Create New Crockery Category'}
      subtitle={
        categoryToEdit
          ? 'Update category branding, display image, and catalog description'
          : 'Define a new tableware category for dinnerware, tea sets, cutlery, or decorative accessories.'
      }
      badgeText={categoryToEdit ? 'Editing Category' : 'New Category'}
      badgeType={categoryToEdit ? 'edit' : 'create'}
      icon={<FolderTree className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Tea Sets, Serving Platters, Gold Cutlery"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  name: val,
                  slug: formData.slug ? formData.slug : val.toLowerCase().replace(/\s+/g, '-'),
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">URL Slug</label>
            <input
              type="text"
              placeholder="e.g. tea-sets or dinner-sets"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-3">
            <ImageUpload
              label="Category Header Image (Upload to Cloudinary)"
              value={formData.imageUrl}
              onImageUploaded={({ url }) => setFormData({ ...formData, imageUrl: url })}
              onImageRemoved={() => setFormData({ ...formData, imageUrl: '' })}
            />

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Or Direct Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Image Round Preview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Display Thumbnail
            </span>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-2 border-[#D4AF37] shadow-sm relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || 'Category'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <FolderTree className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Category Description & Overview</label>
          <textarea
            rows={3}
            placeholder="Describe this luxury tableware category to guide shoppers on the website..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:bg-white text-xs leading-relaxed"
          />
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
            <span>{isSubmitting ? 'Saving...' : categoryToEdit ? 'Update Category' : 'Save & Publish Category'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
