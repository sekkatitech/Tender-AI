-- Enums
create type public.subscription_tier as enum ('starter', 'professional', 'business', 'enterprise');
create type public.user_role as enum ('owner', 'admin', 'member');

-- Companies: the tenant root. Every business table below scopes to one of these.
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_tier public.subscription_tier not null default 'starter',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- Profiles: one row per auth.users, scoped to a company.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'member',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_company_id_idx on public.profiles(company_id);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS helper: the authenticated user's company_id. security definer so it can
-- read `profiles` even though `profiles` itself has RLS enabled (avoids
-- recursive policy evaluation).
create or replace function public.get_my_company_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select company_id from public.profiles where id = auth.uid()
$$;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;

-- Companies: members can see their own company; owners/admins can update it.
-- No insert/delete policy yet — company creation is wired in Phase 3 (signup).
create policy "Members can view their own company"
  on public.companies for select
  using (id = public.get_my_company_id());

create policy "Owners and admins can update their own company"
  on public.companies for update
  using (
    id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin')
    )
  )
  with check (id = public.get_my_company_id());

-- Profiles: members can see everyone in their company; a user can update their own row.
-- No insert/delete policy yet — profile creation is wired in Phase 3 (signup).
create policy "Members can view profiles in their company"
  on public.profiles for select
  using (company_id = public.get_my_company_id());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());
