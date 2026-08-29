import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentPage,
    navigateToPage,
    cart,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around transition-all select-none"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Navigation"
    >
      {/* Home */}
      <button
        onClick={() => navigateToPage('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentPage === 'home'
            ? 'text-[#0A3825] font-bold'
            : 'text-stone-500 hover:text-[#0A3825]'
        }`}
      >
        <div className={`p-1 rounded-full ${currentPage === 'home' ? 'bg-[#0A3825]/10 text-[#0A3825]' : ''}`}>
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Home</span>
      </button>

      {/* Shop / Categories */}
      <button
        onClick={() => navigateToPage('products')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentPage === 'products' || currentPage === 'category'
            ? 'text-[#0A3825] font-bold'
            : 'text-stone-500 hover:text-[#0A3825]'
        }`}
      >
        <div className={`p-1 rounded-full ${currentPage === 'products' || currentPage === 'category' ? 'bg-[#0A3825]/10 text-[#0A3825]' : ''}`}>
          <Grid className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Shop</span>
      </button>

      {/* Instant Search */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-[#0A3825] transition-all cursor-pointer"
        aria-label="Search"
      >
        <div className="p-1 rounded-full hover:bg-stone-100">
          <Search className="w-5 h-5 text-[#B45309]" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Search</span>
      </button>

      {/* Wishlist with Badge */}
      <button
        onClick={() => navigateToPage('wishlist')}
        className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
          currentPage === 'wishlist'
            ? 'text-[#0A3825] font-bold'
            : 'text-stone-500 hover:text-[#0A3825]'
        }`}
      >
        <div className={`p-1 rounded-full relative ${currentPage === 'wishlist' ? 'bg-rose-50 text-rose-600' : ''}`}>
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Wishlist</span>
      </button>

      {/* Cart with Live Count */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#0A3825] hover:text-[#062418] transition-all cursor-pointer"
        aria-label="Shopping Cart"
      >
        <div className="relative p-1.5 rounded-full bg-[#0A3825] text-amber-300 shadow-md">
          <ShoppingBag className="w-4 h-4" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0A3825] text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-[#0A3825]">Cart</span>
      </button>
    </nav>
  );
};
