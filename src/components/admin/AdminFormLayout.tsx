import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminFormLayoutProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeType?: 'create' | 'edit';
  icon?: React.ReactNode;
  onBack: () => void;
  children: React.ReactNode;
  maxWidth?: 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl';
}

export const AdminFormLayout: React.FC<AdminFormLayoutProps> = ({
  title,
  subtitle,
  badgeText,
  badgeType = 'create',
  icon,
  onBack,
  children,
  maxWidth = 'max-w-4xl',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className={`w-full ${maxWidth} mx-auto space-y-6 pb-12`}
    >
      {/* Top Header Card with Back Action */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-[#0A3825] text-slate-600 hover:text-amber-300 transition-all border border-slate-200 shadow-xs cursor-pointer active:scale-95 group shrink-0"
            title="Back to management list"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                  badgeType === 'edit'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}
              >
                {badgeText || (badgeType === 'edit' ? 'Edit Mode' : 'New Entry')}
              </span>
              <span className="text-xs text-slate-400 font-medium">MS Home Trends Management Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#0A3825] mt-1 flex items-center gap-2">
              {icon && <span className="text-amber-600">{icon}</span>}
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-[#0A3825] px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Cancel & Back
        </button>
      </div>

      {/* Main Form Content Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {children}
      </div>
    </motion.div>
  );
};
