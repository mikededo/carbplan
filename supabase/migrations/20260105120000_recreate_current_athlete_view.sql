-- Recreate current_athlete view to include is_admin column
-- PostgreSQL views with SELECT * capture columns at creation time,
-- so we need to recreate the view after adding new columns to athletes
drop view if exists public.current_athlete;
create view public.current_athlete
with (security_invoker = true)
as
select * from public.athletes
where id = auth.uid();

