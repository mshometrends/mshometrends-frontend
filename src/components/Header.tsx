import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { OffersBar } from './OffersBar';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Phone,
  ShieldCheck,
  Truck,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateToPage,
    cart,
    wishlist,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    categories,
    products,
    currentUser,
    setIsAuthModalOpen,
    logoutUser,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const allMatchingProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredSearchResults = allMatchingProducts.slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigateToPage('products');
  };

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-[#0A3825] text-amber-100 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-6 lg:px-10 xl:px-14 font-medium border-b border-[#D4AF37]/30 shadow-sm w-full">
        <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-1.5 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 sm:gap-1.5 text-amber-300 font-semibold truncate">
              <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span>Handcrafted Fine Bone China & Royal Tableware</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 text-[10.5px] sm:text-xs">
            <a
              href="tel:+923242303895"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-100/90 font-medium"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0" />
              <span>+92 324 2303895</span>
            </a>
            <button
              onClick={() => navigateToPage('admin')}
              className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A3825] px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer shrink-0"
            >
              <LayoutDashboard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0A3825]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/30 py-2.5 sm:py-3'
            : 'bg-white border-b border-slate-200/80 py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-between gap-4">
          {/* Left Wing: Mobile Hamburger, Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#0A3825] hover:text-[#D4AF37] p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo Component - Sleek, Compact & Left-Aligned */}
            <div
              onClick={() => navigateToPage('home')}
              className="cursor-pointer group shrink-0"
            >
              <Logo size="sm" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] font-semibold text-slate-700">
              <button
                onClick={() => navigateToPage('home')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentPage === 'home' ? 'text-[#0A3825] border-b-2 border-[#D4AF37] font-bold' : 'hover:text-[#0A3825]'
                }`}
              >
                Home
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  onClick={() => navigateToPage('products')}
                  className={`flex items-center gap-1 transition-colors py-1 cursor-pointer ${
                    currentPage === 'products' || currentPage === 'category'
                      ? 'text-[#0A3825] border-b-2 border-[#D4AF37] font-bold'
                      : 'hover:text-[#0A3825]'
                  }`}
                >
                  Collections <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>

                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 w-[820px] bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-6 grid grid-cols-4 gap-6 text-slate-800 mt-2 z-50"
                    >
                      <div className="col-span-3 grid grid-cols-3 gap-4 border-r border-slate-100 pr-6">
                        {categories.map((cat, idx) => (
                          <div
                            key={cat.id || cat._id ? `${cat.id || cat._id}-${idx}` : `mega-cat-${idx}`}
                            onClick={() => {
                              setMegaMenuOpen(false);
                              navigateToPage('category', cat.slug);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-all group border border-transparent hover:border-[#D4AF37]/30"
                          >
                            <img
                              src={cat.image}
                              alt={cat.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/40 group-hover:scale-105 transition-transform shadow-xs"
                            />
                            <div>
                              <div className="text-xs font-semibold text-[#0A3825] group-hover:text-[#B45309] transition-colors">
                                {cat.name}
                              </div>
                              <div className="text-[11px] text-slate-500">{cat.itemCount} items</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Spotlight Box in Mega Menu */}
                      <div className="flex flex-col justify-between p-4 bg-[#0A3825] text-white rounded-xl border border-[#D4AF37]/40 shadow-md">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                            Editor's Pick
                          </span>
                          <h4 className="text-xs font-serif-title font-bold mt-1 text-white">
                            Empress 24K Gold Set
                          </h4>
                          <p className="text-[11px] text-emerald-100/80 mt-1 leading-relaxed">
                            Crafted with 45% fine bone ash & 24k gold leaf.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setMegaMenuOpen(false);
                            navigateToPage('product-detail', 'prod-101');
                          }}
                          className="mt-3 text-xs font-semibold text-amber-300 hover:text-white underline underline-offset-4 text-left cursor-pointer"
                        >
                          View Set &rarr;
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => navigateToPage('about')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentPage === 'about' ? 'text-[#0A3825] border-b-2 border-[#D4AF37] font-bold' : 'hover:text-[#0A3825]'
                }`}
              >
                Our Heritage
              </button>

              <button
                onClick={() => navigateToPage('contact')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentPage === 'contact' ? 'text-[#0A3825] border-b-2 border-[#D4AF37] font-bold' : 'hover:text-[#0A3825]'
                }`}
              >
                Concierge & Contact
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else if ((window as any).__navigateApp) {
                    (window as any).__navigateApp('/track-order');
                  }
                }}
                className="transition-colors py-1 text-emerald-700 hover:text-[#0A3825] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-amber-600" /> Track Order
              </button>
            </nav>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Search Trigger Button with ⌘K badge */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-[#0A3825] border border-slate-200/80 transition-all cursor-pointer group shadow-2xs"
              aria-label="Search"
              title="Search products (Cmd + K)"
            >
              <Search className="w-4 h-4 text-[#B45309] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium text-slate-500 group-hover:text-slate-800">
                Search...
              </span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-400 border border-slate-200 rounded-md">
                ⌘K
              </kbd>
            </button>

            {/* User Profile Dropdown */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-full border transition-all cursor-pointer group shadow-sm ${
                    currentPage === 'profile'
                      ? 'bg-[#0A3825] text-white border-[#D4AF37]/50 shadow-md'
                      : 'bg-slate-50 hover:bg-emerald-50/80 text-slate-800 border-slate-200 hover:border-[#0A3825]/30'
                  }`}
                  title={`Logged in as ${currentUser.name}`}
                  aria-label="User Profile Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0A3825] text-amber-300 border border-[#D4AF37]/60 flex items-center justify-center font-serif font-bold text-xs shadow-inner">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180 text-amber-500' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                </button>

                {/* Floating Luxury Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100"
                    >
                      {/* Profile Card Header */}
                      <div className="p-4 bg-gradient-to-br from-[#0A3825] to-[#07291b] text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37] flex items-center justify-center font-serif font-bold text-base shadow-md shrink-0">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-serif font-bold text-white truncate">{currentUser.name}</p>
                            <p className="text-[11px] text-emerald-200/80 truncate">{currentUser.email}</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              {currentUser.role === 'admin' ? 'MS Administrator' : 'Gold Concierge VIP'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigateToPage('profile');
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#0A3825] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-emerald-700" />
                          <span>My Profile & Preferences</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            if ((window as any).__navigateApp) {
                              (window as any).__navigateApp('/track-order');
                            } else {
                              navigateToPage('profile');
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-[#0A3825] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-amber-600" />
                          <span>Track Live Shipment</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigateToPage('wishlist');
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-700 font-medium flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>Saved Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigateToPage('admin');
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-amber-900 hover:bg-amber-50 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Admin Management Portal</span>
                          </button>
                        )}
                      </div>

                      {/* Log Out */}
                      <div className="py-1.5 bg-slate-50/80">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logoutUser();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Log Out of Account</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 text-slate-700 hover:text-[#0A3825] transition-colors relative flex items-center gap-1.5 cursor-pointer font-medium text-xs"
                title="Log In / Register"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline font-semibold">Log In</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateToPage('wishlist')}
              className="text-slate-700 hover:text-[#D4AF37] p-2 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] text-[#0A3825] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[#0A3825] hover:bg-[#062418] text-white border border-[#D4AF37]/40 p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-[#D4AF37] text-[#0A3825] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Offers & Promotions Bar (Between Navbar & Hero Banner) */}
      <OffersBar />

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A3825]/60 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 max-w-[80vw] h-full bg-white border-r border-[#D4AF37]/30 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <Logo size="sm" showTagline={false} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-500 hover:text-[#0A3825] p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Quick Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!searchQuery.trim()) return;
                    setMobileMenuOpen(false);
                    navigateToPage('products');
                  }}
                  className="mt-4 relative"
                >
                  <Search className="w-4 h-4 text-[#B45309] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search crockery & sets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                  />
                </form>

                <div className="mt-6 space-y-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('home');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('products');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    All Collections
                  </button>

                  <div className="pl-4 space-y-2 my-2">
                    <p className="text-xs uppercase font-bold text-[#B45309] tracking-wider">Categories</p>
                    {categories.slice(0, 5).map((cat, idx) => (
                      <button
                        key={cat.id || cat._id ? `${cat.id || cat._id}-mob-${idx}` : `mob-cat-${idx}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateToPage('category', cat.slug);
                        }}
                        className="block w-full text-left py-1 text-sm text-slate-600 hover:text-[#0A3825]"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('about');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    Our Heritage
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('contact');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    Concierge & Contact
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('faq');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    FAQs & Help Center
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('shipping');
                    }}
                    className="w-full text-left py-2.5 text-slate-800 hover:text-[#0A3825] font-semibold text-base border-b border-slate-100"
                  >
                    Shipping & Delivery Policy
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else if ((window as any).__navigateApp) {
                        (window as any).__navigateApp('/track-order');
                      }
                    }}
                    className="w-full text-left py-2.5 text-emerald-700 font-semibold text-base border-b border-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-600" /> Track Order
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                {currentUser ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0A3825] text-amber-300 border-2 border-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm shadow-md shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-serif font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateToPage('profile');
                        }}
                        className="w-full py-2 bg-[#0A3825] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-amber-300" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutUser();
                        }}
                        className="w-full py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#0A3825] hover:bg-[#062418] text-white border border-[#D4AF37]/40 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    <User className="w-4 h-4 text-amber-300" /> Sign In / Register
                  </button>
                )}

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateToPage('admin');
                    }}
                    className="w-full py-2.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" /> Open Admin Portal
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
