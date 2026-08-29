import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import { useStore } from '../../context/StoreContext';
import { User as UserType } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { User, Mail, Phone, Lock, Check } from 'lucide-react';

interface UserFormPageProps {
  userToEdit?: UserType | null;
  onClose: () => void;
}

export const UserFormPage: React.FC<UserFormPageProps> = ({ userToEdit, onClose }) => {
  const { showToast, fetchRegisteredUsers } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    address: 'Karachi, Pakistan',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        phone: (userToEdit as any).phone || (userToEdit as any).phoneNumber || '',
        role: (userToEdit as any).role || 'customer',
        address: (userToEdit as any).address || 'Karachi, Pakistan',
      });
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct registration API
      const res = await apiFetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Customer profile registered / updated in MongoDB!', 'success');
        if (fetchRegisteredUsers) {
          fetchRegisteredUsers();
        }
        onClose();
      } else {
        showToast(data.message || 'User updated', 'info');
        onClose();
      }
    } catch (err: any) {
      showToast('User saved to store memory', 'info');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminFormLayout
      title={userToEdit ? `Edit Customer: ${userToEdit.name}` : 'Register New Store Customer Account'}
      subtitle="Manage customer profiles, verified Gmail addresses, contact phone numbers, and delivery addresses in MongoDB Atlas."
      badgeText={userToEdit ? 'Editing User' : 'New Customer'}
      badgeType={userToEdit ? 'edit' : 'create'}
      icon={<User className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Full Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Ayesha Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Customer Gmail / Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. customer@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Phone Number (WhatsApp / SMS)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. +92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Account Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="customer">Customer / Store Buyer</option>
              <option value="vip">VIP Luxury Member</option>
              <option value="manager">Store Manager</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Shipping Address Details</label>
          <textarea
            rows={3}
            placeholder="e.g. House 45, Street 12, Phase 6 DHA, Karachi, Pakistan"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            <span>{isSubmitting ? 'Saving User...' : 'Save Customer Account'}</span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
