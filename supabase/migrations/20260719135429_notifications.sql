create type public.notification_type as enum (
  'closing_date_reminder',
  'briefing_reminder',
  'task_due',
  'tender_status_change',
  'document_uploaded',
  'general'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null default 'general',
  title text not null,
  body text,
  related_tender_id uuid references public.tenders(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_company_id_idx on public.notifications(company_id);
create index notifications_profile_id_idx on public.notifications(profile_id);
create index notifications_related_tender_id_idx on public.notifications(related_tender_id);

alter table public.notifications enable row level security;

-- Notifications are personal (scoped to the recipient), not company-wide.
create policy "Members can view their own notifications"
  on public.notifications for select
  using (company_id = public.get_my_company_id() and profile_id = auth.uid());
create policy "Members can insert notifications in their company"
  on public.notifications for insert
  with check (company_id = public.get_my_company_id());
create policy "Members can update their own notifications"
  on public.notifications for update
  using (company_id = public.get_my_company_id() and profile_id = auth.uid())
  with check (company_id = public.get_my_company_id() and profile_id = auth.uid());
create policy "Members can delete their own notifications"
  on public.notifications for delete
  using (company_id = public.get_my_company_id() and profile_id = auth.uid());
