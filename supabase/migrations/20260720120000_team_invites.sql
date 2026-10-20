-- Team invites: closes the gap where handle_new_user() was the only way a
-- companies/profiles row could ever be created, and it always created a new
-- company — no second person could ever join an existing one.

create table public.company_invites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  email text not null,
  role public.user_role not null default 'member',
  token text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

create index company_invites_company_id_idx on public.company_invites(company_id);
create index company_invites_invited_by_idx on public.company_invites(invited_by);

alter table public.company_invites enable row level security;

-- Only owners/admins manage invites for their own company. No public select
-- policy — that would leak every pending invite's email address across
-- tenants. Unauthenticated lookup instead goes through get_invite_preview(),
-- which requires already knowing the exact (unguessable) token.
create policy "Owners and admins can view their company's invites"
  on public.company_invites for select
  using (
    company_id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );

create policy "Owners and admins can create invites for their company"
  on public.company_invites for insert
  with check (
    company_id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );

create policy "Owners and admins can revoke their company's invites"
  on public.company_invites for delete
  using (
    company_id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );

-- Lets the (unauthenticated) signup page preview an invite by its token
-- before the person has an account. Safe to expose to anon: the token is a
-- 24-byte random secret, so this can't be used to enumerate other invites.
create or replace function public.get_invite_preview(invite_token text)
returns table(company_name text, email text, role public.user_role)
language sql
security definer
set search_path = public
stable
as $$
  select c.name, i.email, i.role
  from public.company_invites i
  join public.companies c on c.id = i.company_id
  where i.token = invite_token
    and i.accepted_at is null
    and i.expires_at > now()
$$;

revoke execute on function public.get_invite_preview(text) from public;
grant execute on function public.get_invite_preview(text) to anon, authenticated;

-- profiles has no email column (email lives in auth.users, which clients
-- can't query directly), so this is the only way to show a usable team
-- list. Scoped to the caller's own company via get_my_company_id(), same
-- tenant boundary as every other table.
create or replace function public.list_company_member_emails()
returns table(id uuid, email text)
language sql
security definer
set search_path = public
stable
as $$
  select u.id, u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where p.company_id = public.get_my_company_id()
$$;

revoke execute on function public.list_company_member_emails() from public, anon;
grant execute on function public.list_company_member_emails() to authenticated;

-- Pre-existing privilege-escalation gap: "Users can update their own
-- profile" (core_tenancy) lets a member update every column on their own
-- row, including role — a member could self-promote to owner. This is the
-- actual enforcement point, layered on top of RLS rather than replacing it,
-- so it closes the gap no matter which policy let the UPDATE through.
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin') and company_id = old.company_id
    ) then
      raise exception 'Only an owner or admin can change a member''s role';
    end if;
  end if;
  return new;
end;
$$;

create trigger guard_profile_role_change
  before update on public.profiles
  for each row execute function public.prevent_self_role_escalation();

-- Lets an owner/admin actually change a teammate's role from the client —
-- the existing self-update policy only ever covered a user's own row.
create policy "Owners and admins can update profiles in their company"
  on public.profiles for update
  using (
    company_id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  )
  with check (company_id = public.get_my_company_id());

-- Redeems an invite token instead of always creating a new company, when one
-- is present in the signup payload.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  invite_token text;
  matched_invite public.company_invites;
begin
  invite_token := new.raw_user_meta_data->>'invite_token';

  if invite_token is not null then
    select * into matched_invite
    from public.company_invites
    where token = invite_token
      and accepted_at is null
      and expires_at > now()
    for update;

    if matched_invite is null then
      raise exception 'This invite link is invalid or has expired.';
    end if;

    if lower(matched_invite.email) is distinct from lower(new.email) then
      raise exception 'This invite was sent to a different email address.';
    end if;

    insert into public.profiles (id, company_id, full_name, role)
    values (new.id, matched_invite.company_id, new.raw_user_meta_data->>'full_name', matched_invite.role);

    update public.company_invites set accepted_at = now() where id = matched_invite.id;

    return new;
  end if;

  insert into public.companies (name)
  values (coalesce(new.raw_user_meta_data->>'company_name', 'My Company'))
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role)
  values (new.id, new_company_id, new.raw_user_meta_data->>'full_name', 'owner');

  return new;
end;
$$;
