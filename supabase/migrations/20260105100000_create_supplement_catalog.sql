-- Supplement Catalog Migration
-- 
-- Nutritional data sourced from:
-- - Open Food Facts (https://world.openfoodfacts.org) - Open database licensed under ODbL
-- - Manufacturer websites and product labels
-- 
-- Credit: Open Food Facts contributors (https://world.openfoodfacts.org/credits)

-- Add is_admin column to athletes
alter table public.athletes add column is_admin boolean not null default false;

-- Create product form enum
create type public.product_form as enum (
  'gel',
  'bar',
  'chew',
  'drink_mix',
  'powder',
  'capsule',
  'liquid',
  'solid'
);

-- Create brands table
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  website text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  slug text not null,
  form product_form not null,
  flavor text,
  
  -- Serving info
  serving_size numeric(6, 2) not null,
  serving_unit text not null default 'g',
  servings_per_package integer,
  
  -- Nutrition per serving
  calories integer,
  carbs_g numeric(5, 1),
  sugar_g numeric(5, 1),
  protein_g numeric(5, 1),
  fat_g numeric(5, 1),
  sodium_mg integer,
  caffeine_mg integer,
  
  -- Additional info
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique (brand_id, slug)
);

-- Create favorite brands table
create table public.favorite_brands (
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  created_at timestamptz not null default now(),
  
  primary key (athlete_id, brand_id)
);

-- Create favorite products table
create table public.favorite_products (
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  
  primary key (athlete_id, product_id)
);

-- Enable RLS
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.favorite_brands enable row level security;
alter table public.favorite_products enable row level security;

-- Brands policies (anyone authenticated can read, only admins can write)
create policy "Anyone can view active brands"
  on public.brands for select
  using (is_active = true);

create policy "Admins can view all brands"
  on public.brands for select
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can insert brands"
  on public.brands for insert
  with check (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update brands"
  on public.brands for update
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can delete brands"
  on public.brands for delete
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

-- Products policies (anyone authenticated can read, only admins can write)
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

create policy "Admins can view all products"
  on public.products for select
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.athletes
      where id = auth.uid() and is_admin = true
    )
  );

-- Favorite brands policies
create policy "Users can view own favorite brands"
  on public.favorite_brands for select
  using (athlete_id = auth.uid());

create policy "Users can add favorite brands"
  on public.favorite_brands for insert
  with check (athlete_id = auth.uid());

create policy "Users can remove favorite brands"
  on public.favorite_brands for delete
  using (athlete_id = auth.uid());

-- Favorite products policies
create policy "Users can view own favorite products"
  on public.favorite_products for select
  using (athlete_id = auth.uid());

create policy "Users can add favorite products"
  on public.favorite_products for insert
  with check (athlete_id = auth.uid());

create policy "Users can remove favorite products"
  on public.favorite_products for delete
  using (athlete_id = auth.uid());

-- Triggers for updated_at
create trigger update_brands_updated_at
  before update on public.brands
  for each row execute function public.update_updated_at_column();

create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();

-- Indexes
create index brands_slug_idx on public.brands (slug);
create index brands_is_active_idx on public.brands (is_active);
create index products_brand_id_idx on public.products (brand_id);
create index products_slug_idx on public.products (slug);
create index products_form_idx on public.products (form);
create index products_is_active_idx on public.products (is_active);
create index products_caffeine_idx on public.products (caffeine_mg) where caffeine_mg is not null;
create index favorite_brands_athlete_idx on public.favorite_brands (athlete_id);
create index favorite_products_athlete_idx on public.favorite_products (athlete_id);

-- Helper function to generate slug
create or replace function public.generate_slug(input text)
returns text
language plpgsql
as $$
begin
  return lower(regexp_replace(regexp_replace(input, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
end;
$$;

-- View for products with brand info
create view public.products_with_brand
with (security_invoker = true)
as
select 
  p.*,
  b.name as brand_name,
  b.slug as brand_slug,
  b.logo_url as brand_logo_url
from public.products p
join public.brands b on p.brand_id = b.id;

-- View for catalog browsing (includes favorite status for current user)
create view public.catalog_products
with (security_invoker = true)
as
select 
  p.*,
  b.name as brand_name,
  b.slug as brand_slug,
  b.logo_url as brand_logo_url,
  exists (
    select 1 from public.favorite_products fp
    where fp.product_id = p.id and fp.athlete_id = auth.uid()
  ) as is_favorite
from public.products p
join public.brands b on p.brand_id = b.id
where p.is_active = true and b.is_active = true;

-- View for catalog brands (includes favorite status)
create view public.catalog_brands
with (security_invoker = true)
as
select 
  b.*,
  (select count(*) from public.products where brand_id = b.id and is_active = true) as product_count,
  exists (
    select 1 from public.favorite_brands fb
    where fb.brand_id = b.id and fb.athlete_id = auth.uid()
  ) as is_favorite
from public.brands b
where b.is_active = true;

