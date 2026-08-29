import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PromoSuccessModal } from './PromoSuccessModal';

// Client-side helper list for immediate real-time feedback
const TEMP_DOMAINS = [
  'tempmail', '10minutemail', 'guerrillamail', 'mailinator', 'yopmail',
  'trashmail', 'temp-mail', 'fakeinbox', 'sharklasers', 'dispostable',
  'getnada', 'throwawaymail', 'mohmal', 'crazymailing', 'dropmail',
  'fakemailgenerator', 'emailondeck', 'disposable', 'tmpmail', 'p3p0',
  'pokemail', 'burnermail', 'maildrop', 'trashmail', 'superrito',
  'armyspy', 'cuvox', 'dayrep', 'einrot', 'fleckens', 'gustr',
  'jourrapide', 'rhyta', 'teleworm', 'vmail', 'zippymail'
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signupUser, loginUser } = useStore();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [signedUpName, setSignedUpName] = useState('');

  // Real-time email validation error message
  const getEmailValidationError = (val: string): string | null => {
    if (!val.trim()) return null;
    const clean = val.trim().toLowerCase();
    if (!clean.includes('@') || !clean.includes('.')) {
      return 'Enter a valid email address (e.g. name@gmail.com)';
    }
    const parts = clean.split('@');
    if (parts.length === 2) {
      const domain = parts[1];
      if (TEMP_DOMAINS.some((td) => domain.includes(td))) {
        return '🚫 Temporary or disposable email addresses (tempmail/mailinator/etc) are strictly prohibited.';
      }
    }
    return null;
  };

  // Real-time phone validation error message
  const getPhoneValidationError = (val: string): string | null => {
    if (!val.trim()) return null;
    const digits = val.replace(/\D/g, '');
    if (digits.length < 10) {
      return 'Phone number must be at least 10 digits.';
    }
    if (digits.length > 15) {
      return 'Phone number cannot exceed 15 digits.';
    }
    const firstDigit = digits[0];
    if (digits.split('').every((d) => d === firstDigit)) {
      return '🚫 Repetitive fake phone numbers (e.g. 0000000000) are not allowed.';
    }
    if (
      digits.includes('123456789') ||
      digits.includes('012345678') ||
      digits.includes('987654321')
    ) {
      return '🚫 Sequential fake phone numbers (e.g. 1234567890) are not allowed.';
    }
    return null;
  };

  const emailError = mode === 'signup' ? getEmailValidationError(email) : null;
  const phoneError = mode === 'signup' ? getPhoneValidationError(phone) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (emailError) {
        setErrorMessage(emailError);
        return;
      }
      if (phoneError) {
        setErrorMessage(phoneError);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = await signupUser(name, email, phone, password);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSignedUpName(name);
        setShowPromoModal(true); // Trigger popup
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      // Login mode
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both your email address and password.');
        return;
      }

      setLoading(true);
      const res = await loginUser(email, password);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setEmail('');
        setPassword('');
      }
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Banner */}
          <div className="bg-[#0A3825] text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0A3825] font-serif-title font-bold text-xl flex items-center justify-center shadow-lg">
                MS
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-amber-100">
                  MS HOME TRENDS
                </h2>
                <p className="text-xs text-amber-300/80 font-medium">
                  Luxury Crockery & Fine Dining Experience
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 flex bg-[#051811] p-1 rounded-2xl border border-[#D4AF37]/30">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#D4AF37] text-[#0A3825] shadow-md'
                    : 'text-emerald-100/70 hover:text-amber-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up / Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#D4AF37] text-[#0A3825] shadow-md'
                    : 'text-emerald-100/70 hover:text-amber-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-medium flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">{errorMessage}</div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3825] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address / Gmail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. Eleanor@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      emailError
                        ? 'border-red-400 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-[#0A3825] focus:bg-white'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {emailError}
                  </p>
                )}
                {mode === 'signup' && !emailError && email.includes('@') && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Valid personal email format
                  </p>
                )}
              </div>

              {/* Phone Field (Signup Mode) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number * <span className="text-slate-400 font-normal lowercase">(for order updates)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +92 300 1234567 or +1 (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        phoneError
                          ? 'border-red-400 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-[#0A3825] focus:bg-white'
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {phoneError}
                    </p>
                  )}
                  {!phoneError && phone.replace(/\D/g, '').length >= 10 && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Active phone format verified
                    </p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3825] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup Mode) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3825] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Security guarantee note */}
              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A3825] shrink-0" />
                <span>Your contact details are securely transmitted directly to store admin.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (mode === 'signup' && (!!emailError || !!phoneError))}
                className="w-full bg-[#0A3825] hover:bg-[#07291b] text-amber-300 font-bold py-3.5 px-6 rounded-xl shadow-lg border border-[#D4AF37]/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Create Account & Register
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In to MS Home Trends
                  </>
                )}
              </button>
            </form>

            {/* Switch Footer */}
            <div className="text-center pt-2 border-t border-slate-100">
              {mode === 'signup' ? (
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#0A3825] hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#0A3825] hover:underline cursor-pointer"
                  >
                    Create a new account
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <PromoSuccessModal
        isOpen={showPromoModal}
        onClose={() => {
          setShowPromoModal(false);
          setIsAuthModalOpen(false);
        }}
        userName={signedUpName}
        code="WELCOME20"
      />
    </AnimatePresence>
  );
};
