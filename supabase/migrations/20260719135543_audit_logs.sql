create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_company_id_idx on public.audit_logs(company_id);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

alter table public.audit_logs enable row level security;

-- Read-only for company members. No insert/update/delete policy: audit rows
-- are written by triggers/service-role code in a later phase, never
-- directly by a client, so client roles get no write policy at all.
create policy "Company members can view their audit logs"
  on public.audit_logs for select
  using (company_id = public.get_my_company_id());
