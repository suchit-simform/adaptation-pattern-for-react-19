import { CartProvider } from "./context/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ProductDetail } from "./components/ProductDetail/ProductDetail";
import { CartSummary } from "./components/Cart/CartSummary";
import "./App.css";

function AppContent() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-header__title">ECommerce Store</h1>
        <CartSummary />
      </header>

      <main className="app-main">
        <ProductDetail productId="product-1" />
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 ECommerce Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
