import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing Supabase env vars. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  image_url: string;
  display_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  compare_at_cents: number | null;
  category_id: string | null;
  short_desc: string | null;
  description: string | null;
  rating: number;
  review_count: number;
  stock: number;
  is_bestseller: boolean;
  is_new: boolean;
  image_url: string;
  badges: string[];
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  position: number;
};

export type Review = {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  created_at: string;
};

export type ProductWithCategory = Product & {
  categories: Pick<Category, 'slug' | 'name'> | null;
};
