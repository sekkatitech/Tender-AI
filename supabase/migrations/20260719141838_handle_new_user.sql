-- Runs after every new auth.users row (i.e. on signup). Owned by the same
-- role that owns companies/profiles, so — like every Postgres table owner —
-- it bypasses RLS on those two tables without needing any special grant.
-- This stays the ONLY way a company/profile row gets created: neither table
-- has a client-facing insert policy (see core_tenancy migration).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
begin
  insert into public.companies (name)
  values (coalesce(new.raw_user_meta_data->>'company_name', 'My Company'))
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role)
  values (new.id, new_company_id, new.raw_user_meta_data->>'full_name', 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only the trigger should ever invoke this — lock out direct RPC calls the
-- same way get_my_company_id() was hardened in Phase 2.
revoke execute on function public.handle_new_user() from public;
