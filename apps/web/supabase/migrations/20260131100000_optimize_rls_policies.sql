-- Optimize RLS Policies Migration
-- Fixes two performance issues:
-- 1. auth_rls_initplan: Wrap auth.uid() with (select auth.uid()) to prevent re-evaluation per row
-- 2. multiple_permissive_policies: Consolidate multiple SELECT/UPDATE policies into single policies

drop policy if exists "Users can view own profile" on public.athletes;
drop policy if exists "Users can update own profile" on public.athletes;
drop policy if exists "Users can insert own profile" on public.athletes;
drop policy if exists "Coaches can view their athletes" on public.athletes;
drop policy if exists "Coaches can update their athletes" on public.athletes;

-- Consolidated SELECT: own profile OR coached athletes
create policy "Users can view own or coached athletes"
  on public.athletes for select
  using (
    id = (select auth.uid())
    or exists (
      select 1 from public.coaching_relationships
      where coach_id = (select auth.uid())
        and athlete_id = athletes.id
        and accepted_at is not null
    )
  );

-- Consolidated UPDATE: own profile OR coached athletes
create policy "Users can update own or coached athletes"
  on public.athletes for update
  using (
    id = (select auth.uid())
    or exists (
      select 1 from public.coaching_relationships
      where coach_id = (select auth.uid())
        and athlete_id = athletes.id
        and accepted_at is not null
    )
  );

create policy "Users can insert own profile"
  on public.athletes for insert
  with check (id = (select auth.uid()));

drop policy if exists "Coaches can view their relationships" on public.coaching_relationships;
drop policy if exists "Athletes can view relationships to them" on public.coaching_relationships;
drop policy if exists "Coaches can create relationships" on public.coaching_relationships;
drop policy if exists "Athletes can accept (update accepted_at)" on public.coaching_relationships;
drop policy if exists "Either party can delete" on public.coaching_relationships;

-- Consolidated SELECT: coach or athlete can view
create policy "Users can view their relationships"
  on public.coaching_relationships for select
  using (
    coach_id = (select auth.uid())
    or athlete_id = (select auth.uid())
  );

create policy "Coaches can create relationships"
  on public.coaching_relationships for insert
  with check (coach_id = (select auth.uid()));

create policy "Athletes can accept relationships"
  on public.coaching_relationships for update
  using (athlete_id = (select auth.uid()));

create policy "Either party can delete"
  on public.coaching_relationships for delete
  using (
    coach_id = (select auth.uid())
    or athlete_id = (select auth.uid())
  );

drop policy if exists "Anyone can view active brands" on public.brands;
drop policy if exists "Admins can view all brands" on public.brands;
drop policy if exists "Admins can insert brands" on public.brands;
drop policy if exists "Admins can update brands" on public.brands;
drop policy if exists "Admins can delete brands" on public.brands;

-- Consolidated SELECT: active brands OR admin can see all
create policy "Users can view brands"
  on public.brands for select
  using (
    is_active = true
    or exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can insert brands"
  on public.brands for insert
  with check (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can update brands"
  on public.brands for update
  using (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can delete brands"
  on public.brands for delete
  using (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

drop policy if exists "Anyone can view active products" on public.products;
drop policy if exists "Admins can view all products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

-- Consolidated SELECT: active products OR admin can see all
create policy "Users can view products"
  on public.products for select
  using (
    is_active = true
    or exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.athletes
      where id = (select auth.uid()) and is_admin = true
    )
  );

drop policy if exists "Users can view own favorite brands" on public.favorite_brands;
drop policy if exists "Users can add favorite brands" on public.favorite_brands;
drop policy if exists "Users can remove favorite brands" on public.favorite_brands;

create policy "Users can view own favorite brands"
  on public.favorite_brands for select
  using (athlete_id = (select auth.uid()));

create policy "Users can add favorite brands"
  on public.favorite_brands for insert
  with check (athlete_id = (select auth.uid()));

create policy "Users can remove favorite brands"
  on public.favorite_brands for delete
  using (athlete_id = (select auth.uid()));

drop policy if exists "Users can view own favorite products" on public.favorite_products;
drop policy if exists "Users can add favorite products" on public.favorite_products;
drop policy if exists "Users can remove favorite products" on public.favorite_products;

create policy "Users can view own favorite products"
  on public.favorite_products for select
  using (athlete_id = (select auth.uid()));

create policy "Users can add favorite products"
  on public.favorite_products for insert
  with check (athlete_id = (select auth.uid()));

create policy "Users can remove favorite products"
  on public.favorite_products for delete
  using (athlete_id = (select auth.uid()));

drop policy if exists "Athletes can view own plans" on public.nutrition_plans;
drop policy if exists "Athletes can insert own plans" on public.nutrition_plans;
drop policy if exists "Athletes can update own plans" on public.nutrition_plans;
drop policy if exists "Athletes can delete own plans" on public.nutrition_plans;
drop policy if exists "Coaches can view athlete plans" on public.nutrition_plans;
drop policy if exists "Coaches can update athlete plans" on public.nutrition_plans;

-- Consolidated SELECT: own plans OR coach's athlete plans
create policy "Users can view accessible plans"
  on public.nutrition_plans for select
  using (
    (athlete_id = (select auth.uid()) and is_active = true)
    or exists (
      select 1 from public.coaching_relationships
      where coach_id = (select auth.uid())
        and athlete_id = nutrition_plans.athlete_id
        and accepted_at is not null
    )
  );

create policy "Athletes can insert own plans"
  on public.nutrition_plans for insert
  with check (athlete_id = (select auth.uid()));

-- Consolidated UPDATE: own plans OR coach's athlete plans
create policy "Users can update accessible plans"
  on public.nutrition_plans for update
  using (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.coaching_relationships
      where coach_id = (select auth.uid())
        and athlete_id = nutrition_plans.athlete_id
        and accepted_at is not null
    )
  );

create policy "Athletes can delete own plans"
  on public.nutrition_plans for delete
  using (athlete_id = (select auth.uid()));

drop policy if exists "Users can view plan items for accessible plans" on public.plan_items;
drop policy if exists "Users can insert plan items for own plans" on public.plan_items;
drop policy if exists "Users can update plan items for accessible plans" on public.plan_items;
drop policy if exists "Users can delete plan items for own plans" on public.plan_items;

create policy "Users can view plan items for accessible plans"
  on public.plan_items for select
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and (
          athlete_id = (select auth.uid())
          or exists (
            select 1 from public.coaching_relationships
            where coach_id = (select auth.uid())
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
        and athlete_id = (select auth.uid())
    )
  );

create policy "Users can update plan items for accessible plans"
  on public.plan_items for update
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_items.plan_id
        and (
          athlete_id = (select auth.uid())
          or exists (
            select 1 from public.coaching_relationships
            where coach_id = (select auth.uid())
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
        and athlete_id = (select auth.uid())
    )
  );
