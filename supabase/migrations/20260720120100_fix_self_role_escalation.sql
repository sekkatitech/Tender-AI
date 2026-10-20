-- prevent_self_role_escalation() as originally written only checked whether
-- the ACTING user currently held owner/admin — it didn't check whether they
-- were changing their OWN row. That let an admin self-promote to owner via
-- a direct API call (bypassing the UI, which only disables the self-role
-- selector as a soft guard). Role changes must always be performed by a
-- different owner/admin acting on someone else, matching the UI's intent.
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() = old.id then
      raise exception 'You cannot change your own role.';
    end if;

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
