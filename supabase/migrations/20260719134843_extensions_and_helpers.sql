-- Extensions
create extension if not exists pgcrypto with schema extensions;

-- Shared trigger function: keeps `updated_at` fresh on every table that has one.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
