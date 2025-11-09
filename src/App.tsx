import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { CanteenPage } from './pages/CanteenPage';
import { TermsPage } from './pages/TermsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CartSidebar } from './components/CartSidebar';

type Page = 'home' | 'menu' | 'orders' | 'canteen' | 'terms' | 'checkout' | 'order-success';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage('menu');
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentPage('order-success');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} onCartClick={() => setCartOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {currentPage === 'home' && <HomePage onCategoryClick={handleCategoryClick} />}
      {currentPage === 'menu' && (
        <MenuPage categoryId={selectedCategory} onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'orders' && <OrdersPage />}
      {currentPage === 'canteen' && profile?.role === 'canteen' && <CanteenPage />}
      {currentPage === 'terms' && <TermsPage />}
      {currentPage === 'checkout' && (
        <CheckoutPage onBack={() => setCurrentPage('home')} onOrderComplete={handleOrderComplete} />
      )}
      {currentPage === 'order-success' && (
        <OrderSuccessPage orderId={orderId} onGoHome={handleGoHome} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
