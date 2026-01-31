-- Add Missing Foreign Key Indexes
-- Fixes unindexed_foreign_keys warnings for better query performance

create index favorite_brands_brand_idx on public.favorite_brands (brand_id);
create index favorite_products_product_idx on public.favorite_products (product_id);
