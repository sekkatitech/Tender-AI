-- Owners and admins may update their company row (name, settings), but the
-- plan they pay for is set only by the server after a verified PayFast
-- payment. Without this, an owner could upgrade for free from the browser:
--   supabase.from('companies').update({ subscription_tier: 'business' })
-- The same applies to the billing record kept in settings->'billing'.

create or replace function public.protect_company_billing()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated')
     and (
       new.subscription_tier is distinct from old.subscription_tier
       or new.settings -> 'billing' is distinct from old.settings -> 'billing'
     )
  then
    raise exception 'Plan and billing changes are made through checkout'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_company_billing
  before update on public.companies
  for each row execute function public.protect_company_billing();
