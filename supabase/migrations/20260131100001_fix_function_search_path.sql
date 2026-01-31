-- Fix Function Search Path Security Warnings
-- Sets search_path = '' on all functions to prevent search_path injection attacks

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_slug(input text)
returns text
language plpgsql
set search_path = ''
as $$
begin
  return lower(regexp_replace(regexp_replace(input, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
end;
$$;

create or replace function public.deactivate_product(p_product_id uuid)
returns public.products
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.products;
begin
  update public.products
  set is_active = false
  where id = p_product_id
  returning * into result;
  
  return result;
end;
$$;

create or replace function public.deactivate_brand(p_brand_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_products integer;
begin
  update public.products
  set is_active = false
  where brand_id = p_brand_id and is_active = true;
  
  get diagnostics affected_products = row_count;
  
  update public.brands
  set is_active = false
  where id = p_brand_id;
  
  return affected_products;
end;
$$;

create or replace function public.deactivate_plan(p_plan_id uuid)
returns public.nutrition_plans
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.nutrition_plans;
begin
  update public.nutrition_plans
  set is_active = false
  where id = p_plan_id
  returning * into result;
  
  return result;
end;
$$;
