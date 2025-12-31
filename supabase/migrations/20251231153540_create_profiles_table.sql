create type public.sex as enum ('male', 'female');

create table public.athletes (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,

  sex sex,
  height_cm numeric(5, 1),
  weight_kg numeric(5, 2),
  ftp integer,
  power_zones jsonb,
  hr_rest integer,
  hr_max integer,
  hr_zones jsonb,
  max_carb_intake_g_per_hr integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coaching_relationships (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.athletes(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),

  unique (coach_id, athlete_id),
  check (coach_id != athlete_id)
);

alter table public.athletes enable row level security;
alter table public.coaching_relationships enable row level security;

-- Athletes policies
create policy "Users can view own profile"
  on public.athletes for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.athletes for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.athletes for insert
  with check (auth.uid() = id);

create policy "Coaches can view their athletes"
  on public.athletes for select
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = athletes.id
        and accepted_at is not null
    )
  );

create policy "Coaches can update their athletes"
  on public.athletes for update
  using (
    exists (
      select 1 from public.coaching_relationships
      where coach_id = auth.uid()
        and athlete_id = athletes.id
        and accepted_at is not null
    )
  );

-- Coaching relationships policies
create policy "Coaches can view their relationships"
  on public.coaching_relationships for select
  using (coach_id = auth.uid());

create policy "Athletes can view relationships to them"
  on public.coaching_relationships for select
  using (athlete_id = auth.uid());

create policy "Coaches can create relationships"
  on public.coaching_relationships for insert
  with check (coach_id = auth.uid());

create policy "Athletes can accept (update accepted_at)"
  on public.coaching_relationships for update
  using (athlete_id = auth.uid());

create policy "Either party can delete"
  on public.coaching_relationships for delete
  using (coach_id = auth.uid() or athlete_id = auth.uid());

-- Triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.athletes (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_athletes_updated_at
  before update on public.athletes
  for each row execute function public.update_updated_at_column();

-- Indexes
create index coaching_relationships_coach_idx on public.coaching_relationships (coach_id);
create index coaching_relationships_athlete_idx on public.coaching_relationships (athlete_id);

-- Views 
create view public.current_athlete
with (security_invoker = true)
as
select * from public.athletes
where id = auth.uid();
