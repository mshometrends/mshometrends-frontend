import React from 'react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { Home, Compass, AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateToPage } = useStore();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="min-h-[80vh] bg-slate-900/50 flex items-center justify-center p-6 my-8">
      <SEOHead
        title="Page Not Found (404)"
        description="The page you requested could not be found. Explore our fine bone china tableware catalog or return to the MS Home Trends homepage."
        noIndex={true}
      />
      <div className="text-center space-y-6 max-w-lg bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Background Decorative Accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#0A3825]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#0A3825] mb-2">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-3">
          <span className="text-6xl sm:text-7xl font-serif-title font-extrabold text-[#0A3825] tracking-tight block">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#0A3825]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
            The page <code className="bg-slate-100 text-[#0A3825] px-2 py-0.5 rounded font-mono font-bold text-xs">{currentPath || 'URL'}</code> does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigateToPage('home')}
            className="w-full sm:w-auto bg-[#0A3825] hover:bg-[#062418] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md border border-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-amber-300" /> Return To Home
          </button>
          <button
            onClick={() => navigateToPage('products')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-800" /> Browse Shop
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => window.history.back()}
            className="text-xs text-slate-500 hover:text-[#0A3825] inline-flex items-center gap-1 font-semibold cursor-pointer underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};
