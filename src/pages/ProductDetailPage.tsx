import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { buildProductSchema, buildBreadcrumbSchema } from '../utils/seoSchemas';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Bell,
  Mail,
  AlertCircle,
  Tag,
  Info,
  HelpCircle,
  Flame,
  Check,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    coupons,
    reviews,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToPage,
    showToast,
    addReview,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.color || 'Imperial White & 24K Gold');

  // Notify Me form state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

  const isOutOfStock = !product?.inStock || (product?.stockQuantity ?? 0) <= 0;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim() || !notifyEmail.includes('@')) {
      showToast('Please enter a valid email address to receive stock notifications.', 'error');
      return;
    }

    setIsSubmittingNotify(true);
    setTimeout(() => {
      setIsNotified(true);
      setIsSubmittingNotify(false);
      showToast(
        `Restock alert activated! We will notify ${notifyEmail} as soon as ${product.name} is available.`,
        'success'
      );
    }, 400);
  };

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productReviews = reviews.filter(
    (r) =>
      (r.productId === product?.id || r.productId === product?.sku) &&
      r.approved !== false
  );
  const pendingReviewsForProduct = reviews.filter(
    (r) =>
      (r.productId === product?.id || r.productId === product?.sku) &&
      r.approved === false
  );
  const isSaved = product ? isInWishlist(product.id) : false;

  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !newComment.trim()) {
      showToast('Please enter your name and review comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        productId: product.id,
        userName: authorName.trim(),
        rating: newRating,
        comment: newComment.trim(),
      });
      setAuthorName('');
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => navigateToPage('products')}
          className="mt-4 px-4 py-2 bg-[#0A3825] text-white rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tableware Catalog', url: '/products' },
    { name: product.category || 'Luxury Crockery', url: `/category/${encodeURIComponent(product.category?.toLowerCase().replace(/\s+/g, '-') || 'dinner-sets')}` },
    { name: product.name, url: `/product/${product.id}` },
  ];

  const productSchema = buildProductSchema(product, reviews);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div
      itemScope
      itemType="https://schema.org/Product"
      className="min-h-screen bg-[#FAF9F6] py-8 sm:py-12 text-slate-800"
    >
      <SEOHead
        title={`${product.name} - Luxury ${product.material || 'Bone China'} Tableware`}
        description={`${product.description?.slice(0, 155) || `Buy ${product.name} online at MS Home Trends. 24K gold-gilded fine bone china tableware with break-safe express delivery.`}...`}
        keywords={`${product.name}, ${product.category}, ${product.material}, 24k gold tableware, luxury crockery Karachi, fine dining dinnerware Pakistan, MS Home Trends`}
        canonicalUrl={`/product/${product.id}`}
        ogImage={product.images && product.images.length > 0 ? product.images[0] : undefined}
        ogType="product"
        jsonLd={[productSchema, breadcrumbSchema]}
      />

      <div className="max-w-[1760px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-10">
        {/* Breadcrumb Navigation (SEO & AEO) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-400">/</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-[#0A3825] truncate max-w-xs">{crumb.name}</span>
              ) : (
                <a
                  href={crumb.url}
                  onClick={(e) => {
                    e.preventDefault();
                    if (crumb.url === '/') navigateToPage('home');
                    else if (crumb.url === '/products') navigateToPage('products');
                    else if (crumb.url.startsWith('/category/')) navigateToPage('category');
                  }}
                  className="hover:text-[#B45309] transition-colors"
                >
                  {crumb.name}
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
              <img
                itemProp="image"
                src={product.images[activeImgIndex] || product.images[0]}
                alt={`${product.name} - Luxury ${product.material || 'Bone China'} Crockery`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />

              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      i === activeImgIndex ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Information Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span itemProp="category" className="text-xs font-bold text-[#B45309] uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="text-xs bg-emerald-50 text-[#0A3825] font-semibold px-3 py-1 rounded-full border border-emerald-200">
                  SKU: <span itemProp="sku">{product.sku}</span>
                </span>
              </div>

              <h1 itemProp="name" className="text-2xl sm:text-4xl font-serif-title font-bold text-[#0A3825] leading-tight">
                {product.name}
              </h1>

              {/* AEO Aggregate Rating Entity */}
              <div
                itemProp="aggregateRating"
                itemScope
                itemType="https://schema.org/AggregateRating"
                className="flex items-center gap-3"
              >
                <meta itemProp="ratingValue" content={String(product.rating || '5.0')} />
                <meta itemProp="reviewCount" content={String(productReviews.length || product.reviewCount || 1)} />
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {product.rating} ({product.reviewCount || productReviews.length} verified customer reviews)
                </span>
              </div>
            </div>

            {/* Price & Offer Schema */}
            <div
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
              className="p-4 bg-white border border-slate-200 rounded-2xl flex items-baseline gap-4 shadow-sm"
            >
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="price" content={String(product.price ?? 0)} />
              <link
                itemProp="availability"
                href={isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'}
              />
              <span className="text-3xl font-bold text-[#0A3825]">
                ${(product.price ?? 0).toFixed(2)}
              </span>
              {Boolean(product.oldPrice) && (
                <span className="text-base text-slate-400 line-through">
                  ${(product.oldPrice ?? 0).toFixed(2)}
                </span>
              )}
              {isOutOfStock ? (
                <span className="ml-auto text-xs font-bold text-rose-800 bg-rose-50 border border-rose-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Out of Stock
                </span>
              ) : (
                <span className="ml-auto text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                  In Stock ({product.stockQuantity} sets available)
                </span>
              )}
            </div>

            <p itemProp="description" className="text-sm text-slate-600 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Material & Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block">Craft Material</span>
                <strong itemProp="material" className="text-[#0A3825] text-sm">{product.material}</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block">Dimensions / Pieces</span>
                <strong className="text-[#0A3825] text-sm">{product.dimensions || 'Standard Suite'}</strong>
              </div>
            </div>

            {/* Product Key Features & Craft Highlights */}
            <div className="p-4 bg-[#0A3825]/5 border border-[#0A3825]/15 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-serif-title font-bold text-[#0A3825] uppercase tracking-wider">
                  Artisanal Quality & Craftsmanship
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(
                  product.features && product.features.length > 0
                    ? product.features
                    : [
                        '24K Hand-Gilded Gold Trim',
                        'High Thermal Shock Resistance',
                        'Dishwasher Safe Fine China',
                        'Lead-Free Eco Glaze',
                        'Micro-Craze Free Porcelain Finish',
                        'Royal Luxury Dining Grade',
                      ]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0A3825] shrink-0" />
                    <span className="text-slate-700 font-medium text-[11px]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Coupon Banner if available */}
            {(() => {
              const prodCoupon = coupons.find((c) => c.active && (c.productId === product.id || c.productId === product.sku));
              if (!prodCoupon) return null;
              return (
                <div className="p-4 bg-gradient-to-r from-[#0A3825] to-[#051811] border border-[#D4AF37]/50 rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0A3825] font-bold shrink-0 shadow-sm">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                        <span>Exclusive Product Coupon</span>
                        <span className="bg-amber-400/20 text-amber-200 text-[10px] px-2 py-0.5 rounded-full border border-amber-300/30 font-semibold">
                          {prodCoupon.discountType === 'percentage' ? `${prodCoupon.discountValue}% OFF` : `$${prodCoupon.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-100/90 mt-0.5">
                        Use promo code <strong className="font-mono text-amber-300 text-sm tracking-wider">{prodCoupon.code}</strong> for instant discount on this item!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(prodCoupon.code);
                      showToast(`Coupon code ${prodCoupon.code} copied!`, 'info');
                    }}
                    className="bg-[#D4AF37] hover:bg-amber-400 text-[#0A3825] font-bold text-xs px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    Copy Code
                  </button>
                </div>
              );
            })()}

            {/* Care instructions */}
            {product.careInstructions && (
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                <strong className="text-[#B45309] block font-semibold">Artisan Care Note:</strong>
                <p>{product.careInstructions}</p>
              </div>
            )}

            {/* Quantity & Actions / Notify Me */}
            {isOutOfStock ? (
              <div className="bg-[#051811] border border-[#D4AF37]/40 rounded-2xl p-5 text-white shadow-xl space-y-4 my-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0A3825] border border-[#D4AF37]/50 text-amber-300 shrink-0">
                    <Bell className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif-title font-bold text-amber-300">
                      Notify Me When Back In Stock
                    </h4>
                    <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                      This artisan piece is currently sold out. Enter your email address below and we will notify you the moment it is restocked.
                    </p>
                  </div>
                </div>

                {isNotified ? (
                  <div className="p-4 bg-[#0A3825]/90 border border-emerald-500/50 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Restock Notification Active!
                    </div>
                    <p className="text-xs text-emerald-100/90">
                      We will send an immediate notification to <strong className="text-amber-300">{notifyEmail}</strong> as soon as inventory arrives.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNotified(false)}
                      className="text-[11px] text-amber-300/80 hover:text-amber-300 underline pt-1 cursor-pointer"
                    >
                      Update email address
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="w-full bg-[#030F0A] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-emerald-800 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingNotify}
                      className="bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-60 text-[#0A3825] font-bold px-5 py-3 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-98"
                    >
                      <Bell className="w-4 h-4 fill-current" />
                      <span>{isSubmittingNotify ? 'Registering...' : 'Notify Me'}</span>
                    </button>
                  </form>
                )}

                {/* Wishlist option alongside */}
                <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-xs text-emerald-200/80">
                  <span>Want to save this for later?</span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-300' : ''}`} />
                    <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1 shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-[#0A3825]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-lg text-slate-600 hover:text-[#0A3825] flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border border-slate-300 transition-colors shadow-xs cursor-pointer ${
                      isSaved ? 'bg-[#D4AF37] text-[#0A3825]' : 'bg-white text-slate-700 hover:text-[#0A3825]'
                    }`}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => addToCart(product, quantity, selectedColor)}
                    className="bg-[#0A3825] hover:bg-[#062418] text-white font-semibold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#D4AF37]/30 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" /> Add To Cart
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, quantity, selectedColor);
                      navigateToPage('checkout');
                    }}
                    className="bg-[#D4AF37] hover:bg-amber-500 text-[#0A3825] font-bold py-3.5 sm:py-4 rounded-xl border border-amber-400 transition-all text-xs sm:text-sm shadow-md cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Direct WhatsApp Order / Inquiry Button */}
                <a
                  href={`https://wa.me/923242303895?text=${encodeURIComponent(
                    `*MS Home Trends - Product Inquiry & Order*\n\n` +
                    `Product: ${product.name}\n` +
                    `Price: $${product.price?.toFixed(2)}\n` +
                    `SKU: ${product.sku || product.id}\n` +
                    `Quantity: ${quantity}\n` +
                    `Link: ${window.location.origin}/product/${product.id}\n\n` +
                    `Hello, I would like to order or ask about this product.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-emerald-500"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order / Inquire on WhatsApp (+92 324 2303895)</span>
                </a>
              </div>
            )}

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-[10.5px] sm:text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>Express Insured Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>Zero Breakage Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* AEO & GEO Structured Answer & Technical Specifications Sheet */}
        <div className="pt-8 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Answer Engine & Technical Specifications</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-[#0A3825] mt-1">
                  Product Facts & Direct Details
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Authentic 24K Gold Embellished
              </span>
            </div>

            {/* Structured Table for AI Engine and Shopper Direct Answers */}
            <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Material Composition</dt>
                <dd className="text-sm font-bold text-[#0A3825]">{product.material || 'Grade-A Fine Bone China (45%+ Bone Ash)'}</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">Chip-resistant, ultra-translucent body</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Gilding & Ornamentation</dt>
                <dd className="text-sm font-bold text-[#0A3825]">24-Karat Real Gold Trim</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">Hand-painted artisanal border finish</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Safety & Glaze Standard</dt>
                <dd className="text-sm font-bold text-emerald-700">100% Lead-Free & Cadmium-Free</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">Eco-friendly food safe certification</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Delivery Time (GEO)</dt>
                <dd className="text-sm font-bold text-[#0A3825]">1-2 Days Karachi | 2-3 Days Nationwide</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">5-7 Days International (DHL/FedEx)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Breakage Protection</dt>
                <dd className="text-sm font-bold text-[#0A3825]">100% Zero-Breakage Guarantee</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">Instant free replacement if damaged in transit</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <dt className="text-slate-500 font-semibold mb-1">Maintenance & Care</dt>
                <dd className="text-sm font-bold text-[#0A3825]">Gentle Hand Wash Recommended</dd>
                <span className="text-[11px] text-slate-500 mt-1 block">Mild detergent preserves 24K gold longevity</span>
              </div>
            </dl>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-8 border-t border-slate-200 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif-title font-bold text-[#0A3825] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#B45309]" /> Customer Reviews & Ratings
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {pendingReviewsForProduct.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs shadow-xs mb-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Review Submitted — Pending Verification</strong>
                    <span>
                      Thank you! Your review ({pendingReviewsForProduct.length} submission) is pending admin verification and will be published live once verified.
                    </span>
                  </div>
                </div>
              )}

              {productReviews.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm shadow-sm">
                  Be the first to review this fine crockery collection!
                </div>
              ) : (
                productReviews.map((rev, idx) => (
                  <div
                    key={rev.id || rev._id ? `${rev.id || rev._id}-${idx}` : `rev-${idx}`}
                    itemProp="review"
                    itemScope
                    itemType="https://schema.org/Review"
                    className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0A3825] text-amber-300 font-bold flex items-center justify-center text-xs">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <h5 itemProp="author" itemScope itemType="https://schema.org/Person" className="text-sm font-bold text-[#0A3825]">
                            <span itemProp="name">{rev.userName}</span>
                          </h5>
                          <span itemProp="datePublished" className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div
                        itemProp="reviewRating"
                        itemScope
                        itemType="https://schema.org/Rating"
                        className="flex text-[#D4AF37]"
                      >
                        <meta itemProp="ratingValue" content={String(rev.rating)} />
                        <meta itemProp="bestRating" content="5" />
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p itemProp="reviewBody" className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 h-fit shadow-sm">
              <h4 className="text-base font-serif-title font-bold text-[#0A3825]">Write a Verified Review</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`p-1 cursor-pointer ${star <= newRating ? 'text-[#D4AF37]' : 'text-slate-300'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience with the weight, gold trim, and glaze finish..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0A3825] hover:bg-[#062418] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-md text-xs border border-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Saving Review...' : 'Submit Verified Review'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-2xl font-serif-title font-bold text-[#0A3825]">
              Pairs Well With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id || p._id ? `${p.id || p._id}-${idx}` : `rel-${idx}`} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
