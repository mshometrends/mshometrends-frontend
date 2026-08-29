import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';
import { SEOHead } from '../components/SEOHead';
import { buildCollectionSchema, buildBreadcrumbSchema } from '../utils/seoSchemas';
import { SlidersHorizontal, Search, RotateCcw, ChevronDown, Filter, X, Tag } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, categories, isProductsLoading, selectedCategorySlug, searchQuery, setSearchQuery } = useStore();

  const [search, setSearch] = useState(searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug || 'all');
  const [priceRange, setPriceRange] = useState<number>(600);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if searchQuery changed externally (e.g. from header search)
  React.useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSearchQuery(val);
  };

  // Materials list
  const materials = ['Bone China', 'Porcelain', 'Ceramic', 'Crystal Glass', 'Stoneware'];

  // Enhanced Filter logic
  let filtered = products.filter((p) => {
    const searchLower = search.trim().toLowerCase();
    if (searchLower) {
      const matchName = p.name.toLowerCase().includes(searchLower);
      const matchDesc = p.description.toLowerCase().includes(searchLower);
      const matchCategory = p.category.toLowerCase().includes(searchLower);
      const matchMaterial = p.material.toLowerCase().includes(searchLower);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(searchLower));

      if (!matchName && !matchDesc && !matchCategory && !matchMaterial && !matchTags) {
        return false;
      }
    }
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj && p.category.toLowerCase() !== catObj.name.toLowerCase()) {
        return false;
      }
    }
    if (p.price > priceRange) return false;
    if (selectedMaterial !== 'all' && p.material !== selectedMaterial) return false;
    if (inStockOnly && !p.inStock) return false;
    return true;
  });

  // Sort logic
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceRange(600);
    setSelectedMaterial('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 text-slate-800">
      <SEOHead
        title="Luxury Crockery, Bone China Dinner Sets & Tableware Shop"
        description="Browse MS Home Trends complete tableware catalog. Shop 24K gold-plated fine bone china dinnerware, royal afternoon tea sets, serving platters, and cutlery with Pakistan nationwide delivery."
        keywords="crockery shop, buy bone china dinner set, gold tableware Pakistan, luxury crockery online, porcelain tea sets, MS Home Trends catalog"
        canonicalUrl="/products"
        jsonLd={[
          buildCollectionSchema('All Luxury Tableware', 'Complete collection of premium bone china crockery, tea sets, and fine dinnerware.', filtered),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'All Tableware Products', url: '/products' },
          ]),
        ]}
      />
      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#B45309]">
              The Complete Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#0A3825] mt-1">
              Fine Crockery & Tableware Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              Showing {filtered.length} curated luxury items
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden bg-white border border-slate-200 text-[#0A3825] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <Filter className="w-4 h-4 text-[#B45309]" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-xs">
              <span className="text-slate-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-[#0A3825] focus:outline-none font-semibold cursor-pointer"
              >
                <option value="featured" className="bg-white">Featured</option>
                <option value="price-asc" className="bg-white">Price: Low to High</option>
                <option value="price-desc" className="bg-white">Price: High to Low</option>
                <option value="rating" className="bg-white">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROMINENT TOP SEARCH & CATEGORY FILTER BAR */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B45309]" />
              <input
                type="text"
                placeholder="Search products by name, category, or material (e.g. Gold Plated, Dinnerware)..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Select Dropdown in Search Bar */}
            <div className="w-full md:w-64 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-700">
              <Tag className="w-4 h-4 text-[#0A3825]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-[#0A3825] font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((cat, idx) => (
                  <option key={cat.id || cat._id ? `opt-${cat.id || cat._id}-${idx}` : `opt-cat-${idx}`} value={cat.slug}>
                    {cat.name} ({cat.itemCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters Button */}
            {(search || selectedCategory !== 'all' || selectedMaterial !== 'all' || inStockOnly || priceRange < 600) && (
              <button
                onClick={resetFilters}
                className="w-full md:w-auto text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B45309]" /> Reset
              </button>
            )}
          </div>

          {/* Quick Category Suggestion Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] uppercase tracking-wider">
              Quick Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0A3825] text-amber-300 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            {categories.map((cat, idx) => (
              <button
                key={cat.id || cat._id ? `qf-${cat.id || cat._id}-${idx}` : `qf-cat-${idx}`}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#0A3825] text-amber-300 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside
            className={`space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-[#0A3825] uppercase tracking-wider flex items-center gap-2 font-serif-title">
                <SlidersHorizontal className="w-4 h-4 text-[#B45309]" /> Refine Catalog
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-[#B45309] flex items-center gap-1 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Keyword Search inside Sidebar */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0A3825]">Sidebar Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0A3825]">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#0A3825] text-amber-300 font-bold'
                      : 'text-slate-600 hover:text-[#0A3825] hover:bg-slate-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id || cat._id ? `side-${cat.id || cat._id}-${idx}` : `side-cat-${idx}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-[#0A3825] text-amber-300 font-bold'
                        : 'text-slate-600 hover:text-[#0A3825] hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-[#0A3825]">Max Price</label>
                <span className="text-[#B45309] font-bold">${priceRange}</span>
              </div>
              <input
                type="range"
                min={30}
                max={600}
                step={10}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0A3825] bg-slate-200 cursor-pointer"
              />
            </div>

            {/* Material Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="text-xs font-semibold text-[#0A3825]">Material Craft</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedMaterial === 'all'
                      ? 'bg-[#0A3825] text-amber-300 font-bold'
                      : 'text-slate-600 hover:text-[#0A3825]'
                  }`}
                >
                  All Materials
                </button>
                {materials.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedMaterial === m
                        ? 'bg-[#0A3825] text-amber-300 font-bold'
                        : 'text-slate-600 hover:text-[#0A3825]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0A3825]">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#0A3825] rounded cursor-pointer"
              />
            </div>
          </aside>

          {/* Main Products Grid */}
          <main className="lg:col-span-3">
            {isProductsLoading ? (
              <ProductGridSkeleton count={6} className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" />
            ) : filtered.length === 0 ? (
              <div className="p-8 sm:p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-[#B45309] flex items-center justify-center shadow-inner">
                  <Search className="w-8 h-8 text-[#B45309]" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg sm:text-xl font-serif-title font-bold text-[#0A3825]">
                    {search ? `No tableware found for "${search}"` : 'No products match your filters'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    We couldn't find any products matching your current criteria. Try expanding your price range, clearing filters, or exploring popular collections.
                  </p>
                </div>

                {/* Quick suggestions */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Popular suggestions:
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {['24K Gold Dinner Set', 'Fine Bone China', 'Tea Sets', 'Crystal Glassware', 'Porcelain'].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchChange(term)}
                        className="text-xs bg-slate-100 hover:bg-[#0A3825] hover:text-white text-slate-700 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl font-medium transition-all cursor-pointer border border-slate-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
                  {search && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Clear Search Query
                    </button>
                  )}
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto bg-[#0A3825] hover:bg-[#062418] text-amber-300 font-bold text-xs px-6 py-2.5 rounded-xl shadow-md border border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {filtered.map((product, idx) => (
                  <ProductCard key={product.id || product._id ? `${product.id || product._id}-${idx}` : `pp-${idx}`} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

