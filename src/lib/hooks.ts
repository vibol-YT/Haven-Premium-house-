import { useEffect, useState } from 'react';
import { supabase, type Product, type ProductWithCategory, type Category, type Review, type ProductImage } from './supabase';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setCategories(data as Category[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);
  return { categories, loading };
}

export function useProducts(opts?: { category?: string; bestsellersOnly?: boolean; limit?: number }) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, categories(slug, name)')
      .order('created_at', { ascending: false });

    if (opts?.bestsellersOnly) query = query.eq('is_bestseller', true);
    if (opts?.limit) query = query.limit(opts.limit);

    query.then(async ({ data, error: err }) => {
      if (!active) return;
      if (err) { setError(err.message); setLoading(false); return; }
      let rows = data as ProductWithCategory[];
      if (opts?.category) {
        rows = rows.filter((p) => p.categories?.slug === opts.category);
      }
      setProducts(rows);
      setLoading(false);
    });
    return () => { active = false; };
  }, [opts?.category, opts?.bestsellersOnly, opts?.limit]);

  return { products, loading, error };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(async ({ data, error: err }) => {
        if (!active) return;
        if (err) { setError(err.message); setLoading(false); return; }
        setProduct(data as Product);
        if (data) {
          const { data: imgs } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', (data as Product).id)
            .order('position', { ascending: true });
          if (active && imgs) setImages(imgs as ProductImage[]);
        }
        setLoading(false);
      });
    return () => { active = false; };
  }, [slug]);

  return { product, images, loading, error };
}

export function useReviews(productId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    let active = true;
    supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setReviews(data as Review[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, [productId]);

  return { reviews, loading };
}

export function useRelatedProducts(product: Product | null, limit = 4) {
  const [related, setRelated] = useState<Product[]>([]);
  useEffect(() => {
    if (!product) return;
    let active = true;
    supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id ?? '')
      .neq('id', product.id)
      .limit(limit)
      .then(({ data }) => {
        if (active && data) setRelated(data as Product[]);
      });
    return () => { active = false; };
  }, [product, limit]);
  return related;
}

export async function searchProducts(q: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .ilike('name', `%${q}%`);
  if (error || !data) return [];
  return data as ProductWithCategory[];
}

export async function subscribeEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('newsletter').insert({ email });
  if (error) {
    if (error.code === '23505') return { ok: true };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function submitReview(r: {
  product_id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('reviews').insert({ ...r, verified: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
