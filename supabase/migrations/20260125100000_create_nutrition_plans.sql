-- Nutrition Plans Migration
-- Creates tables for fueling plan builder

-- Create nutrition_plans table
create table public.nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  name text not null,
  date date not null,
  duration_minutes integer not null,
  target_carbs_per_hour integer,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create plan_items table
create table public.plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.nutrition_plans(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  timing_minutes integer not null,
  servings numeric(4, 2) not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.nutrition_plans enable row level security;
alter table public.plan_items enable row level security;

-- Nutrition plans policies (athletes can CRUD own plans)
create policy "Athletes can view own plans"
  on public.nutrition_plans for select
  using (athlete_id = auth.uid() and is_active = true);

create policy "Athletes can insert own plans"
  on public.nutrition_plans for insert
  with check (athlete_id = auth.uid());

create policy "Athletes can update own plans"
  on public.nutrition_plans for update
  using (athlete_id = auth.uid());

create policy "Athletes can delete own plans"
  on public.nutrition_plans for delete
  using (athlete_id = auth.uid());

-- Coaches can view/edit plans of their athletes
create policy "Coaches can view athlete plans"
  on public.nutrition_plans for select
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = nutrition_plans.athlete_id
        and accepted_at is not null
    )
  );

create policy "Coaches can update athlete plans"
  on public.nutrition_plans for update
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = nutrition_plans.athlete_id
        and accepted_at is not null
    )
  );

-- Plan items policies (inherit from plan ownership)
create policy "Users can view plan items for accessible plans"
  on public.plan_items for select
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and (
          athlete_id = auth.uid()
          or exists (
            select 1 from public.coaching_relationships
            where coach_id = auth.uid()
              and athlete_id = nutrition_plans.athlete_id
              and accepted_at is not null
          )
        )
    )
  );

create policy "Users can insert plan items for own plans"
  on public.plan_items for insert
  with check (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and athlete_id = auth.uid()
    )
  );

create policy "Users can update plan items for accessible plans"
  on public.plan_items for update
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and (
          athlete_id = auth.uid()
          or exists (
            select 1 from public.coaching_relationships
            where coach_id = auth.uid()
              and athlete_id = nutrition_plans.athlete_id
              and accepted_at is not null
          )
        )
    )
  );

create policy "Users can delete plan items for own plans"
  on public.plan_items for delete
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and athlete_id = auth.uid()
    )
  );

-- Triggers for updated_at
create trigger update_nutrition_plans_updated_at
  before update on public.nutrition_plans
  for each row execute function public.update_updated_at_column();

create trigger update_plan_items_updated_at
  before update on public.plan_items
  for each row execute function public.update_updated_at_column();

-- Indexes
create index nutrition_plans_athlete_idx on public.nutrition_plans (athlete_id);
create index nutrition_plans_date_idx on public.nutrition_plans (date);
create index nutrition_plans_is_active_idx on public.nutrition_plans (is_active);
create index plan_items_plan_idx on public.plan_items (plan_id);
create index plan_items_product_idx on public.plan_items (product_id);
create index plan_items_timing_idx on public.plan_items (timing_minutes);

-- View for plans with items summary
create view public.plans_with_summary
with (security_invoker = true)
as
select 
  p.*,
  coalesce(
    (select count(*) from public.plan_items where plan_id = p.id),
    0
  ) as item_count,
  coalesce(
    (select sum(pi.servings * pr.carbs_g) 
     from public.plan_items pi 
     join public.products pr on pi.product_id = pr.id 
     where pi.plan_id = p.id),
    0
  ) as total_carbs_g,
  coalesce(
    (select sum(pi.servings * pr.caffeine_mg) 
     from public.plan_items pi 
     join public.products pr on pi.product_id = pr.id 
     where pi.plan_id = p.id),
    0
  ) as total_caffeine_mg
from public.nutrition_plans p
where p.is_active = true;

-- Soft delete function for plans
create or replace function public.deactivate_plan(p_plan_id uuid)
returns public.nutrition_plans
language plpgsql
security definer
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
