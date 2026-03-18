-- Workouts + Plan Groups Migration

-- Workout source enum
create type public.workout_source as enum (
  'manual',
  'intervals_icu'
);

-- Workouts table
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  name text not null,
  type text,
  source public.workout_source not null default 'manual',
  external_id text,
  raw_text text,
  raw_payload jsonb,
  parsed_doc jsonb,
  start_date_local timestamptz,
  end_date_local timestamptz,
  moving_time_seconds integer,
  tss numeric(7, 2),
  joules bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (athlete_id, source, external_id)
);

-- Plan groups table
create table public.plan_groups (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.nutrition_plans(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  start_offset_minutes integer not null default 0,
  end_offset_minutes integer,
  target_carbs_g_per_hr integer,
  target_sodium_mg_per_hr integer,
  target_caffeine_mg_per_hr integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Link plans to workouts
alter table public.nutrition_plans
  add column workout_id uuid references public.workouts(id) on delete set null,
  add column workout_snapshot jsonb;

-- Link items to groups
alter table public.plan_items
  add column group_id uuid references public.plan_groups(id) on delete set null;

-- Enable RLS
alter table public.workouts enable row level security;
alter table public.plan_groups enable row level security;

-- Workouts policies (athletes can CRUD own workouts)
create policy "Athletes can view own workouts"
  on public.workouts for select
  using (athlete_id = auth.uid());

create policy "Athletes can insert own workouts"
  on public.workouts for insert
  with check (athlete_id = auth.uid());

create policy "Athletes can update own workouts"
  on public.workouts for update
  using (athlete_id = auth.uid());

create policy "Athletes can delete own workouts"
  on public.workouts for delete
  using (athlete_id = auth.uid());

-- Coaches can view/edit workouts of their athletes
create policy "Coaches can view athlete workouts"
  on public.workouts for select
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = workouts.athlete_id
        and accepted_at is not null
    )
  );

create policy "Coaches can update athlete workouts"
  on public.workouts for update
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = workouts.athlete_id
        and accepted_at is not null
    )
  );

-- Plan groups policies (inherit from plan ownership)
create policy "Users can view plan groups for accessible plans"
  on public.plan_groups for select
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_groups.plan_id
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

create policy "Users can insert plan groups for own plans"
  on public.plan_groups for insert
  with check (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_groups.plan_id
        and athlete_id = auth.uid()
    )
  );

create policy "Users can update plan groups for accessible plans"
  on public.plan_groups for update
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_groups.plan_id
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

create policy "Users can delete plan groups for own plans"
  on public.plan_groups for delete
  using (
    exists (
      select 1 from public.nutrition_plans
      where id = plan_groups.plan_id
        and athlete_id = auth.uid()
    )
  );

-- Triggers for updated_at
create trigger update_workouts_updated_at
  before update on public.workouts
  for each row execute function public.update_updated_at_column();

create trigger update_plan_groups_updated_at
  before update on public.plan_groups
  for each row execute function public.update_updated_at_column();

-- Indexes
create index workouts_athlete_idx on public.workouts (athlete_id);
create index workouts_start_date_idx on public.workouts (start_date_local);
create unique index workouts_source_external_idx on public.workouts (athlete_id, source, external_id);
create index plan_groups_plan_idx on public.plan_groups (plan_id);
create index plan_groups_sort_idx on public.plan_groups (plan_id, sort_order);
create index nutrition_plans_workout_idx on public.nutrition_plans (workout_id);
create index plan_items_group_idx on public.plan_items (group_id);
