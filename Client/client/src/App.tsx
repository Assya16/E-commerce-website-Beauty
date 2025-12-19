import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Wishlist from "@/pages/wishlist";
import Orders from "@/pages/orders";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/orders" component={Orders} />
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
