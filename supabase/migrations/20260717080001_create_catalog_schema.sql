/*
# Create Haven catalog schema (single-tenant, no auth)

1. Overview
   Public-facing storefront catalog. No sign-in screen, so all reads/writes
   run as the `anon` role. Policies are scoped to `anon, authenticated`.

2. New Tables
   - `categories` — top-level shop categories (e.g. Living, Kitchen, Bath).
     id, slug, name, tagline, image_url, display_order, created_at.
   - `products` — sellable items.
     id, slug, name, price_cents, compare_at_cents (for sale strikethrough),
     category_id, short_desc, description, rating, review_count, stock,
     is_bestseller, is_new, image_url, badges, created_at.
   - `product_images` — additional gallery images per product.
     id, product_id, url, position.
   - `reviews` — customer reviews with verified-purchase tags.
     id, product_id, author, rating, title, body, verified, created_at.
   - `newsletter` — email capture for first-order discount.
     id, email (unique), created_at.

3. Security
   - RLS enabled on every table.
   - Public read on catalog tables (anon + authenticated).
   - Public insert on reviews + newsletter (anon + authenticated).
   - No updates/deletes from the anon client (write-once public data).
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  image_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price_cents int NOT NULL,
  compare_at_cents int,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  short_desc text,
  description text,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  image_url text NOT NULL,
  badges text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_bestseller_idx ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS products_created_idx ON products(created_at DESC);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  position int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  author text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text NOT NULL,
  verified boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews(product_id);

CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- categories: public read only
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- products: public read only
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- product_images: public read only
DROP POLICY IF EXISTS "anon_read_product_images" ON product_images;
CREATE POLICY "anon_read_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- reviews: public read, public insert (write-once)
DROP POLICY IF EXISTS "anon_read_reviews" ON reviews;
CREATE POLICY "anon_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- newsletter: public read (to check existence), public insert
DROP POLICY IF EXISTS "anon_read_newsletter" ON newsletter;
CREATE POLICY "anon_read_newsletter" ON newsletter FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "anon_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);
