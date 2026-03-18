-- Soft delete a single product
-- Sets is_active = false for the specified product
create or replace function public.deactivate_product(p_product_id uuid)
returns public.products
language plpgsql
security definer
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

-- Soft delete a brand and all its products
-- Sets is_active = false for the brand AND all products belonging to it
-- Returns the number of affected products
create or replace function public.deactivate_brand(p_brand_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  affected_products integer;
begin
  -- Soft delete all products for this brand
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
