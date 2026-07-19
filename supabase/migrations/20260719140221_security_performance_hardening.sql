-- 1. Pin search_path on the trigger function too (advisor: function_search_path_mutable).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. get_my_company_id() only needs to be callable by signed-in users (RLS
-- policies evaluate it as the querying role) — revoke the default PUBLIC/anon
-- grant (advisor: anon_security_definer_function_executable).
revoke execute on function public.get_my_company_id() from public;
revoke execute on function public.get_my_company_id() from anon;
grant execute on function public.get_my_company_id() to authenticated;

-- 3. Missing indexes on secondary (actor/assignee) foreign keys (advisor: unindexed_foreign_keys).
create index audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index documents_uploaded_by_idx on public.documents(uploaded_by);
create index products_source_document_id_idx on public.products(source_document_id);
create index tender_notes_author_id_idx on public.tender_notes(author_id);
create index tender_tasks_assignee_id_idx on public.tender_tasks(assignee_id);
create index tender_timeline_events_created_by_idx on public.tender_timeline_events(created_by);
create index tenders_created_by_idx on public.tenders(created_by);

-- 4. Wrap auth.<function>() calls as (select auth.<function>()) in RLS
-- policies so Postgres evaluates them once per query, not once per row
-- (advisor: auth_rls_initplan).
drop policy "Owners and admins can update their own company" on public.companies;
create policy "Owners and admins can update their own company"
  on public.companies for update
  using (
    id = public.get_my_company_id()
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  )
  with check (id = public.get_my_company_id());

drop policy "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy "Members can view their own notifications" on public.notifications;
create policy "Members can view their own notifications"
  on public.notifications for select
  using (company_id = public.get_my_company_id() and profile_id = (select auth.uid()));

drop policy "Members can update their own notifications" on public.notifications;
create policy "Members can update their own notifications"
  on public.notifications for update
  using (company_id = public.get_my_company_id() and profile_id = (select auth.uid()))
  with check (company_id = public.get_my_company_id() and profile_id = (select auth.uid()));

drop policy "Members can delete their own notifications" on public.notifications;
create policy "Members can delete their own notifications"
  on public.notifications for delete
  using (company_id = public.get_my_company_id() and profile_id = (select auth.uid()));
