import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { User as UserType } from '../../types';
import { AdminFormLayout } from './AdminFormLayout';
import { userService } from '../../api';
import {
  User,
  Mail,
  Phone,
  Lock,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface UserFormPageProps {
  userToEdit?: UserType | null;
  onClose: () => void;
}

export const UserFormPage: React.FC<UserFormPageProps> = ({ userToEdit, onClose }) => {
  const { showToast, fetchRegisteredUsers } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin', // default to admin for new user creation
    password: '',
    address: 'Karachi, Pakistan',
  });

  useEffect(() => {
    if (userToEdit) {
      const rawRole = (userToEdit as any).role || 'user';
      const normalizedRole =
        rawRole === 'admin' || rawRole === 'superadmin'
          ? 'admin'
          : rawRole === 'manager'
          ? 'manager'
          : rawRole === 'vip'
          ? 'vip'
          : 'user';

      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        phone: (userToEdit as any).phone || (userToEdit as any).phoneNumber || '',
        role: normalizedRole,
        password: '', // Keep blank on edit unless updating
        address: (userToEdit as any).address || 'Karachi, Pakistan',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
        address: 'Karachi, Pakistan',
      });
    }
  }, [userToEdit]);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = 'Admin@';
    for (let i = 0; i < 4; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generated += Math.floor(10 + Math.random() * 90);
    setFormData((prev) => ({ ...prev, password: generated }));
    setShowPassword(true);
    showToast('Strong password generated!', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phone.trim();
    const cleanAddress = formData.address.trim();
    const cleanPassword = formData.password.trim();

    if (!cleanName || cleanName.length < 2) {
      showToast('Please enter full name (at least 2 letters)', 'error');
      return;
    }

    if (!cleanEmail) {
      showToast('Email address is required', 'error');
      return;
    }

    // New user requires password
    if (!userToEdit && (!cleanPassword || cleanPassword.length < 6)) {
      showToast('Password is required and must be at least 6 characters long', 'error');
      return;
    }

    // Edit user password check if provided
    if (userToEdit && cleanPassword && cleanPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: {
        name: string;
        email: string;
        phone: string;
        role: string;
        address: string;
        password?: string;
      } = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: formData.role,
        address: cleanAddress,
      };

      if (cleanPassword) {
        payload.password = cleanPassword;
      }

      if (userToEdit) {
        // Edit existing user
        const targetId = (userToEdit as any).id || (userToEdit as any)._id;
        const res = await userService.update(targetId, payload);

        if (res && res.success !== false) {
          showToast(`User account "${cleanName}" updated successfully!`, 'success');
          if (fetchRegisteredUsers) {
            await fetchRegisteredUsers();
          }
          onClose();
        } else {
          showToast(res?.message || 'Failed to update user', 'error');
        }
      } else {
        // Create new user / superadmin
        const res = await userService.create(payload);

        if (res && res.success !== false) {
          const roleLabel = formData.role === 'admin' ? 'Superadmin' : formData.role === 'manager' ? 'Store Manager' : 'User';
          showToast(`New ${roleLabel} account "${cleanName}" created successfully!`, 'success');
          if (fetchRegisteredUsers) {
            await fetchRegisteredUsers();
          }
          onClose();
        } else {
          showToast(res?.message || 'Failed to create user', 'error');
        }
      }
    } catch (err: any) {
      console.error('[UserFormPage Submit Error]', err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        (userToEdit ? 'Failed to update user account' : 'Failed to create user account');
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuperadminRole = formData.role === 'admin';
  const isManagerRole = formData.role === 'manager';

  return (
    <AdminFormLayout
      title={
        userToEdit
          ? `Edit User: ${userToEdit.name}`
          : 'Create New User or Superadmin'
      }
      subtitle={
        userToEdit
          ? 'Modify account details, update role privileges, or set a new password.'
          : 'Add a new verified store user, customer profile, or superadmin administrator with login credentials.'
      }
      badgeText={
        userToEdit
          ? `Editing ${userToEdit.role === 'admin' ? 'Superadmin' : 'Account'}`
          : isSuperadminRole
          ? 'New Superadmin'
          : 'New User'
      }
      badgeType={userToEdit ? 'edit' : 'create'}
      icon={<User className="w-6 h-6" />}
      onBack={onClose}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. MS Superadmin / Ayesha Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Email / Gmail Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. admin@mshometrends.com or user@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Phone and Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Phone Number (WhatsApp / Mobile)
            </label>
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
            <label className="block text-slate-700 font-semibold mb-1.5">
              Account Role & Access Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 font-semibold focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="admin">⭐ Superadmin / Full Administrator (Admin Panel Access)</option>
                <option value="manager">🛡️ Store Manager (Catalog & Orders Access)</option>
                <option value="user">🛍️ Customer / Store Buyer (Online Shopper)</option>
                <option value="vip">✨ VIP Luxury Member (Priority Buyer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Superadmin Notification Callout */}
        {(isSuperadminRole || isManagerRole) && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-emerald-50/50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#0A3825]" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#0A3825] text-xs flex items-center gap-1.5">
                <span>{isSuperadminRole ? 'Superadmin Privileges Enabled' : 'Store Manager Privileges'}</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                This account will have administrator access to the MS Home Trends Admin Dashboard. The user will be able to log in using their email (<strong className="text-slate-800">{formData.email || 'entered email'}</strong>) and the password set below.
              </p>
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-slate-700 font-semibold">
              Account Password{' '}
              {!userToEdit ? (
                <span className="text-red-500">* (Required)</span>
              ) : (
                <span className="text-slate-400 font-normal">(Leave blank to keep current password)</span>
              )}
            </label>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="text-[11px] text-[#0A3825] hover:text-[#062418] font-bold flex items-center gap-1 bg-amber-100/70 hover:bg-amber-200/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Generate Random Password</span>
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required={!userToEdit}
              placeholder={
                userToEdit
                  ? 'Enter new password to reset, or leave blank to keep unchanged'
                  : 'Enter strong password (min 6 characters)'
              }
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-slate-400" />
            <span>
              {userToEdit
                ? 'Only fill this in if you want to reset or change this user’s password. Minimum 6 characters.'
                : 'Minimum 6 characters. The user or superadmin will use this to sign into their account.'}
            </span>
          </p>
        </div>

        {/* Shipping Address Details */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Default Delivery / Store Address
          </label>
          <textarea
            rows={2}
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
            <span>
              {isSubmitting
                ? userToEdit
                  ? 'Updating User...'
                  : 'Creating Account...'
                : userToEdit
                ? 'Update User Account'
                : isSuperadminRole
                ? 'Create Superadmin Account'
                : 'Create User Account'}
            </span>
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
};
