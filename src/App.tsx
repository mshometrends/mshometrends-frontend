import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore, PageView } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { LiveSearchModal } from './components/LiveSearchModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { BackToTop } from './components/BackToTop';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { Home } from './pages/Home';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { InvoicePage } from './pages/InvoicePage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { FAQPage } from './pages/FAQPage';
import { ShippingPage } from './pages/ShippingPage';
import { HowToPayPage } from './pages/HowToPayPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Navigation Bridge Component to connect Store Context with React Router
function NavigationSync() {
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).__navigateApp = (path: string) => {
      navigate(path);
    };
  }, [navigate]);

  return null;
}

// Wrapper for standard static pages with animated entry
function PageWrapper({ page, children }: { page: PageView; children: React.ReactNode }) {
  const { setCurrentPage } = useStore();

  useEffect(() => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, setCurrentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// Dynamic Category Route Wrapper
function CategoryRouteWrapper() {
  const { slug } = useParams<{ slug?: string }>();
  const { setSelectedCategorySlug, setCurrentPage } = useStore();

  useEffect(() => {
    if (slug) {
      setSelectedCategorySlug(slug);
    }
    setCurrentPage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, setSelectedCategorySlug, setCurrentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <CategoryPage />
    </motion.div>
  );
}

// Dynamic Product Detail Route Wrapper
function ProductRouteWrapper() {
  const { id } = useParams<{ id?: string }>();
  const { setSelectedProductId, setCurrentPage } = useStore();

  useEffect(() => {
    if (id) {
      setSelectedProductId(id);
    }
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, setSelectedProductId, setCurrentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <ProductDetailPage />
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Hide store header & footer if navigating within admin portal (/MS/admin/panel)
  const isAdminPage = path.includes('/ms/admin') || path.includes('/admin');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A3825] flex flex-col font-sans antialiased selection:bg-[#0A3825] selection:text-amber-200">
      <NavigationSync />

      {/* Store Header - Hidden on Admin Page */}
      {!isAdminPage && <Header />}

      {/* Animated Route Views */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            {/* User Public Frontend Routes */}
            <Route path="/" element={<PageWrapper page="home"><Home /></PageWrapper>} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/products" element={<PageWrapper page="products"><ProductsPage /></PageWrapper>} />
            <Route path="/shop" element={<Navigate to="/products" replace />} />
            <Route path="/category" element={<CategoryRouteWrapper />} />
            <Route path="/category/:slug" element={<CategoryRouteWrapper />} />
            <Route path="/product/:id" element={<ProductRouteWrapper />} />
            <Route path="/item/:id" element={<ProductRouteWrapper />} />
            <Route path="/about" element={<PageWrapper page="about"><AboutUsPage /></PageWrapper>} />
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/contact" element={<PageWrapper page="contact"><ContactPage /></PageWrapper>} />
            <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
            <Route path="/faq" element={<PageWrapper page="faq"><FAQPage /></PageWrapper>} />
            <Route path="/faqs" element={<Navigate to="/faq" replace />} />
            <Route path="/questions" element={<Navigate to="/faq" replace />} />
            <Route path="/shipping" element={<PageWrapper page="shipping"><ShippingPage /></PageWrapper>} />
            <Route path="/shipping-policy" element={<Navigate to="/shipping" replace />} />
            <Route path="/delivery" element={<Navigate to="/shipping" replace />} />
            <Route path="/how-to-pay" element={<PageWrapper page="how-to-pay"><HowToPayPage /></PageWrapper>} />
            <Route path="/payment-guide" element={<Navigate to="/how-to-pay" replace />} />
            <Route path="/easypaisa" element={<Navigate to="/how-to-pay" replace />} />
            <Route path="/cart" element={<PageWrapper page="cart"><CartPage /></PageWrapper>} />
            <Route path="/checkout" element={<PageWrapper page="checkout"><CheckoutPage /></PageWrapper>} />
            <Route path="/order-success/:orderId" element={<PageWrapper page="checkout"><OrderSuccessPage /></PageWrapper>} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />
            <Route path="/track-order" element={<PageWrapper page="products"><TrackOrderPage /></PageWrapper>} />
            <Route path="/wishlist" element={<PageWrapper page="wishlist"><WishlistPage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper page="profile"><UserProfile /></PageWrapper>} />

            {/* Admin Panel Route: MS/admin/panel */}
            <Route path="/MS/admin/panel" element={<PageWrapper page="admin"><AdminDashboard /></PageWrapper>} />
            <Route path="/admin" element={<Navigate to="/MS/admin/panel" replace />} />
            <Route path="/ms/admin" element={<Navigate to="/MS/admin/panel" replace />} />
            <Route path="/admin/panel" element={<Navigate to="/MS/admin/panel" replace />} />
            <Route path="/ms/admin/panel" element={<Navigate to="/MS/admin/panel" replace />} />

            {/* 404 Page Not Found catch-all route for any wrong or unknown URL */}
            <Route path="/404" element={<PageWrapper page="404"><NotFoundPage /></PageWrapper>} />
            <Route path="*" element={<PageWrapper page="404"><NotFoundPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Store Footer - Hidden on Admin Page */}
      {!isAdminPage && <Footer />}

      {/* Mobile Quick Navigation Bar - Hidden on Desktop & Admin */}
      {!isAdminPage && <MobileBottomNav />}

      {/* Global Modals & Overlays */}
      <LiveSearchModal />
      <QuickViewModal />
      <AuthModal />
      <CartDrawer />
      <ToastContainer />
      <BackToTop />
      <FloatingWhatsApp />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;

