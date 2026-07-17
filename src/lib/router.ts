import { useEffect, useState, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: string }
  | { name: 'product'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'search'; q: string }
  | { name: 'account' }
  | { name: 'about' }
  | { name: 'reviews' }
  | { name: 'blog' }
  | { name: 'faq' }
  | { name: 'contact' };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [path, query] = clean.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query ?? '');

  if (parts.length === 0) return { name: 'home' };
  const [first, second] = parts;

  switch (first) {
    case 'shop':
      return { name: 'shop', category: second };
    case 'product':
      return { name: 'product', slug: second ?? '' };
    case 'cart':
      return { name: 'cart' };
    case 'checkout':
      return { name: 'checkout' };
    case 'search':
      return { name: 'search', q: params.get('q') ?? '' };
    case 'account':
      return { name: 'account' };
    case 'about':
      return { name: 'about' };
    case 'reviews':
      return { name: 'reviews' };
    case 'blog':
      return { name: 'blog' };
    case 'faq':
      return { name: 'faq' };
    case 'contact':
      return { name: 'contact' };
    default:
      return { name: 'home' };
  }
}

export function routeToHref(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'shop':
      return route.category ? `#/shop/${route.category}` : '#/shop';
    case 'product':
      return `#/product/${route.slug}`;
    case 'cart':
      return '#/cart';
    case 'checkout':
      return '#/checkout';
    case 'search':
      return `#/search?q=${encodeURIComponent(route.q)}`;
    case 'account':
      return '#/account';
    case 'about':
      return '#/about';
    case 'reviews':
      return '#/reviews';
    case 'blog':
      return '#/blog';
    case 'faq':
      return '#/faq';
    case 'contact':
      return '#/contact';
  }
}

export function useNavigate() {
  return useCallback((r: Route) => {
    window.location.hash = routeToHref(r);
  }, []);
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useNavigate();

  return { route, navigate };
}
