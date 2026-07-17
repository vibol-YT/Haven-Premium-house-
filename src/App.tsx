import { StoreProvider } from './lib/store';
import { useRouter } from './lib/router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastHost } from './components/Toast';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { LiveChat } from './components/LiveChat';
import { RecentlyViewed } from './components/RecentlyViewed';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SearchPage } from './pages/SearchPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

function Routes() {
  const { route } = useRouter();

  const showRecentlyViewed =
    route.name === 'home' || route.name === 'shop' || route.name === 'search';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {route.name === 'home' && <HomePage />}
        {route.name === 'shop' && <ShopPage category={route.category} />}
        {route.name === 'product' && <ProductPage slug={route.slug} />}
        {route.name === 'cart' && <CartPage />}
        {route.name === 'checkout' && <CheckoutPage />}
        {route.name === 'search' && <SearchPage q={route.q} />}
        {route.name === 'account' && <AccountPage />}
        {route.name === 'about' && <AboutPage />}
        {route.name === 'reviews' && <ReviewsPage />}
        {route.name === 'blog' && <BlogPage />}
        {route.name === 'faq' && <FaqPage />}
        {route.name === 'contact' && <ContactPage />}
      </main>
      {showRecentlyViewed && <RecentlyViewed />}
      <Footer />
      <ExitIntentPopup />
      <LiveChat />
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Routes />
    </StoreProvider>
  );
}
