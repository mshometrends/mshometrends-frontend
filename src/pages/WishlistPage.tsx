import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateToPage } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 text-slate-800">
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
              Saved Tableware
            </span>
            <h1 className="text-3xl font-serif-title font-bold text-[#0A3825] mt-1">
              Your Saved Wishlist ({wishlist.length})
            </h1>
          </div>

          <button
            onClick={() => navigateToPage('products')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0A3825] hover:text-[#B45309]"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Catalog
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="p-16 bg-white border border-slate-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <Heart className="w-16 h-16 stroke-1 text-slate-300 mx-auto" />
            <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">No Saved Items Yet</h3>
            <p className="text-xs text-slate-500 font-light">
              Tap the heart icon on any crockery set or crystal stemware to save it to your wishlist.
            </p>
            <button
              onClick={() => navigateToPage('products')}
              className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-md border border-[#D4AF37]/30"
            >
              Explore Fine Crockery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product, idx) => (
              <ProductCard key={product.id || product._id ? `${product.id || product._id}-${idx}` : `wl-${idx}`} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
