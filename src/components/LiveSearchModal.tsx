import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Sparkles,
  ShoppingBag,
  Eye,
  ArrowRight,
  TrendingUp,
  History,
  Tag,
  Layers,
  Star,
  Check,
  Package,
  Clock,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Product, Category } from '../types';

const POPULAR_SEARCH_TERMS = [
  '24K Gold Dinner Set',
  'Imperial Tea Set',
  'Emerald Elegance',
  'Bone China Bowls',
  'Crystal Wine Glass',
  'Serving Platters',
  'Coffee Mugs',
  'Royal Teaware',
];

const RECENT_SEARCHES_KEY = 'ms_recent_searches_v1';

export const LiveSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    navigateToPage,
    addToCart,
    setQuickViewProduct,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 6));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Focus input whenever modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Predictive Matching Calculations
  const query = searchQuery.trim().toLowerCase();

  const { matchingCategories, matchingMaterials, matchingProducts, totalMatchesCount } = useMemo(() => {
    if (!query) {
      return {
        matchingCategories: [],
        matchingMaterials: [],
        matchingProducts: [],
        totalMatchesCount: 0,
      };
    }

    // 1. Categories match
    const matchedCats = categories
      .filter((c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
      .slice(0, 4);

    // 2. Materials match
    const allMaterials: string[] = Array.from(new Set(products.map((p) => p.material).filter((m): m is string => Boolean(m))));
    const matchedMats = allMaterials.filter((m) => m.toLowerCase().includes(query)).slice(0, 4);

    // 3. Products match (score based)
    const scoredProducts = products
      .map((p) => {
        let score = 0;
        const nameLower = p.name.toLowerCase();
        const catLower = p.category.toLowerCase();
        const matLower = p.material.toLowerCase();
        const descLower = p.description.toLowerCase();
        const tags = p.tags || [];

        if (nameLower === query) score += 100;
        else if (nameLower.startsWith(query)) score += 50;
        else if (nameLower.includes(query)) score += 30;

        if (catLower.includes(query)) score += 20;
        if (matLower.includes(query)) score += 20;
        if (tags.some((t) => t.toLowerCase().includes(query))) score += 25;
        if (descLower.includes(query)) score += 10;

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      matchingCategories: matchedCats,
      matchingMaterials: matchedMats,
      matchingProducts: scoredProducts.slice(0, 6).map((item) => item.product),
      totalMatchesCount: scoredProducts.length,
    };
  }, [query, categories, products]);

  // Keyboard navigation through search results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      return;
    }

    if (matchingProducts.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < matchingProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matchingProducts.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < matchingProducts.length) {
        const prod = matchingProducts[selectedIndex];
        saveRecentSearch(prod.name);
        setIsSearchOpen(false);
        navigateToPage('product-detail', prod.id);
      } else if (query) {
        saveRecentSearch(searchQuery);
        setIsSearchOpen(false);
        navigateToPage('products');
      }
    }
  };

  const handleProductClick = (prod: Product) => {
    saveRecentSearch(prod.name);
    setIsSearchOpen(false);
    navigateToPage('product-detail', prod.id);
  };

  const handleCategoryClick = (cat: Category) => {
    saveRecentSearch(cat.name);
    setIsSearchOpen(false);
    navigateToPage('category', cat.slug);
  };

  const handleTermSelect = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    inputRef.current?.focus();
  };

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart(prod, 1);
    setAddedItemNotice(prod.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

  const handleQuickPreview = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    setIsSearchOpen(false);
    setQuickViewProduct(prod);
  };

  const handleFullSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    saveRecentSearch(searchQuery);
    setIsSearchOpen(false);
    navigateToPage('products');
  };

  // Helper to highlight matched query substring in text
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-100 text-[#0A3825] font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-50 bg-[#0A3825]/75 backdrop-blur-md flex flex-col items-center pt-8 sm:pt-16 px-3 sm:px-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden flex flex-col my-auto max-h-[88vh]"
          >
            {/* Header & Main Live Search Input */}
            <form onSubmit={handleFullSearchSubmit} className="p-4 sm:p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 rounded-2xl px-4 py-3 transition-all">
                <Search className="w-5 h-5 text-[#B45309] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to search bone china, tea sets, 24K gold dinnerware, platters..."
                  className="w-full bg-transparent text-[#0A3825] text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="hidden sm:inline-flex items-center gap-1 bg-[#0A3825] hover:bg-[#062418] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  Search
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="sm:hidden p-1 text-slate-500 hover:text-[#0A3825] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subheader bar with keyboard hints */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#B45309]" />
                  Predictive live search active
                </span>
                <div className="hidden sm:flex items-center gap-2">
                  <span>Use <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
                  <span>•</span>
                  <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">ESC</kbd> to close</span>
                </div>
              </div>
            </form>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 divide-y divide-slate-100">
              {/* STATE 1: User hasn't typed anything yet */}
              {!query && (
                <div className="space-y-6 pt-1">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-slate-400" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearAllRecentSearches}
                          className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => handleTermSelect(term)}
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A3825] hover:text-white text-slate-700 text-xs font-medium transition-all cursor-pointer border border-slate-200 hover:border-[#0A3825]"
                          >
                            <Clock className="w-3 h-3 text-slate-400 group-hover:text-amber-300" />
                            <span>{term}</span>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(e, term)}
                              className="text-slate-400 hover:text-red-500 group-hover:text-amber-200 p-0.5"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Popular Suggestions */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A3825] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#B45309]" />
                      Trending Crockery & Searches
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {POPULAR_SEARCH_TERMS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleTermSelect(term)}
                          className="text-left p-3 rounded-2xl bg-amber-50/50 hover:bg-[#0A3825] hover:text-white border border-amber-200/60 hover:border-[#0A3825] text-slate-800 text-xs font-semibold transition-all group cursor-pointer shadow-2xs flex flex-col justify-between h-20"
                        >
                          <span className="group-hover:text-white leading-tight">{term}</span>
                          <span className="text-[10px] text-[#B45309] group-hover:text-amber-300 font-normal flex items-center gap-1">
                            Explore <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Category Shortcuts */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      Browse by Department
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#D4AF37]/50 text-left transition-all cursor-pointer group"
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#0A3825] group-hover:text-[#B45309] truncate">
                              {cat.name}
                            </h5>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {cat.itemCount || 'Curated'} sets
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: User is typing, results found */}
              {query && totalMatchesCount > 0 && (
                <div className="space-y-6 pt-2">
                  {/* Category & Material Predictive Match Pills */}
                  {(matchingCategories.length > 0 || matchingMaterials.length > 0) && (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#B45309]" />
                        Suggested Categories & Collections
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchingCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat)}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#0A3825] text-[#0A3825] hover:text-white border border-emerald-200 hover:border-[#0A3825] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>Category: <strong>{cat.name}</strong></span>
                            <span className="text-[10px] bg-white/80 text-slate-700 px-1.5 py-0.2 rounded-full">
                              {cat.itemCount || 0}
                            </span>
                          </button>
                        ))}

                        {matchingMaterials.map((mat) => (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => handleTermSelect(mat)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/70 hover:bg-[#0A3825] text-slate-700 hover:text-white border border-amber-200 text-xs font-medium transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Material: {mat}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Previews List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="font-bold text-[#0A3825] uppercase tracking-wider text-[11px]">
                        Product Previews ({totalMatchesCount})
                      </span>
                      <span>Showing top results</span>
                    </div>

                    <div className="space-y-2">
                      {matchingProducts.map((prod, idx) => {
                        const isSelected = selectedIndex === idx;
                        const isAdded = addedItemNotice === prod.id;

                        return (
                          <div
                            key={prod.id || `match-${idx}`}
                            onClick={() => handleProductClick(prod)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`group flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50/90 border-[#D4AF37] shadow-sm'
                                : 'bg-white hover:bg-slate-50 border-slate-200/80'
                            }`}
                          >
                            {/* Product Thumbnail */}
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded">
                                  SALE
                                </span>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-[#B45309] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                                  {prod.category}
                                </span>
                                {prod.material && (
                                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                    • {prod.material}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-serif-title font-bold text-[#0A3825] mt-0.5 truncate group-hover:text-[#B45309] transition-colors">
                                {highlightMatch(prod.name, searchQuery)}
                              </h4>

                              <div className="flex items-center gap-3 mt-1 text-xs">
                                <div className="flex items-center text-amber-500 gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-[11px] font-bold text-slate-700">
                                    {prod.rating.toFixed(1)}
                                  </span>
                                  <span className="text-[10px] text-slate-400">({prod.reviewsCount})</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <span className={`text-[10px] font-semibold ${prod.inStock ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  {prod.inStock ? 'In Stock' : 'Pre-Order'}
                                </span>
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="text-right">
                                <div className="text-sm sm:text-base font-bold text-[#0A3825]">
                                  ${(prod.price ?? 0).toFixed(2)}
                                </div>
                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                  <div className="text-[10px] text-slate-400 line-through">
                                    ${(prod.originalPrice ?? 0).toFixed(2)}
                                  </div>
                                )}
                              </div>

                              {/* Quick View Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQuickPreview(e, prod)}
                                title="Quick View"
                                className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#0A3825] hover:text-white text-slate-600 items-center justify-center transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Quick Add To Cart Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQuickAdd(e, prod)}
                                title="Add to Cart"
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#0A3825] hover:bg-[#062418] text-amber-300'
                                }`}
                              >
                                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 3: Query typed, but ZERO results found -> Clean Empty State */}
              {query && totalMatchesCount === 0 && (
                <div className="py-10 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-[#B45309] flex items-center justify-center shadow-inner">
                    <Search className="w-8 h-8 text-[#B45309]" />
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-xl font-serif-title font-bold text-[#0A3825]">
                      No crockery found for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      We couldn't find exact matches for your search. Try checking your spelling or explore our popular tableware collections below.
                    </p>
                  </div>

                  {/* Alternative Suggestions */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                      Try searching for:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Dinner Sets', 'Bone China', 'Gold Trim', 'Tea Cup', 'Porcelain Platter', 'Stemware'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleTermSelect(s)}
                          className="text-xs bg-slate-100 hover:bg-[#0A3825] hover:text-white text-slate-700 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer border border-slate-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        inputRef.current?.focus();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Clear Search Query
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        navigateToPage('products');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Browse Entire Catalog
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bottom Bar with Full Catalog CTA */}
            {query && totalMatchesCount > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600 font-medium">
                  Found <strong className="text-[#0A3825]">{totalMatchesCount} items</strong> matching "{searchQuery}"
                </div>

                <button
                  type="button"
                  onClick={() => {
                    saveRecentSearch(searchQuery);
                    setIsSearchOpen(false);
                    navigateToPage('products');
                  }}
                  className="w-full sm:w-auto bg-[#0A3825] hover:bg-[#062418] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[#D4AF37]/30 group"
                >
                  <span>View all {totalMatchesCount} results in Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
