create type public.tender_status as enum (
  'discovered', 'in_progress', 'submitted', 'won', 'lost', 'archived'
);

create table public.tenders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_number text,
  title text not null,
  client text,
  department text,
  closing_date timestamptz,
  briefing_date timestamptz,
  is_briefing_compulsory boolean not null default false,
  submission_method text,
  status public.tender_status not null default 'discovered',
  evaluation_method text,
  preference_points text,
  warranty_requirements text,
  risks text,
  questions text,
  recommendations text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tenders_company_id_idx on public.tenders(company_id);
create index tenders_status_idx on public.tenders(status);

create trigger set_tenders_updated_at
  before update on public.tenders
  for each row execute function public.set_updated_at();

create table public.tender_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);
create index tender_contacts_company_id_idx on public.tender_contacts(company_id);
create index tender_contacts_tender_id_idx on public.tender_contacts(tender_id);

create table public.tender_checklist_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  label text not null,
  is_mandatory boolean not null default true,
  is_complete boolean not null default false,
  created_at timestamptz not null default now()
);
create index tender_checklist_items_company_id_idx on public.tender_checklist_items(company_id);
create index tender_checklist_items_tender_id_idx on public.tender_checklist_items(tender_id);

create table public.tender_suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  status text,
  notes text,
  created_at timestamptz not null default now(),
  unique (tender_id, supplier_id)
);
create index tender_suppliers_company_id_idx on public.tender_suppliers(company_id);
create index tender_suppliers_tender_id_idx on public.tender_suppliers(tender_id);
create index tender_suppliers_supplier_id_idx on public.tender_suppliers(supplier_id);

create table public.tender_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  title text not null,
  description text,
  assignee_id uuid references public.profiles(id) on delete set null,
  due_date date,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tender_tasks_company_id_idx on public.tender_tasks(company_id);
create index tender_tasks_tender_id_idx on public.tender_tasks(tender_id);

create trigger set_tender_tasks_updated_at
  before update on public.tender_tasks
  for each row execute function public.set_updated_at();

create table public.tender_notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index tender_notes_company_id_idx on public.tender_notes(company_id);
create index tender_notes_tender_id_idx on public.tender_notes(tender_id);

create table public.tender_timeline_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  event_type text not null,
  description text,
  occurred_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);
create index tender_timeline_events_company_id_idx on public.tender_timeline_events(company_id);
create index tender_timeline_events_tender_id_idx on public.tender_timeline_events(tender_id);

create table public.tender_submissions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  submitted_at timestamptz,
  method text,
  reference_number text,
  notes text,
  created_at timestamptz not null default now()
);
create index tender_submissions_company_id_idx on public.tender_submissions(company_id);
create index tender_submissions_tender_id_idx on public.tender_submissions(tender_id);

alter table public.tenders enable row level security;
alter table public.tender_contacts enable row level security;
alter table public.tender_checklist_items enable row level security;
alter table public.tender_suppliers enable row level security;
alter table public.tender_tasks enable row level security;
alter table public.tender_notes enable row level security;
alter table public.tender_timeline_events enable row level security;
alter table public.tender_submissions enable row level security;

create policy "Company members can view their tenders" on public.tenders for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tenders" on public.tenders for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tenders" on public.tenders for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tenders" on public.tenders for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender contacts" on public.tender_contacts for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender contacts" on public.tender_contacts for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender contacts" on public.tender_contacts for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender contacts" on public.tender_contacts for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender checklist items" on public.tender_checklist_items for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender checklist items" on public.tender_checklist_items for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender checklist items" on public.tender_checklist_items for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender checklist items" on public.tender_checklist_items for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender suppliers" on public.tender_suppliers for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender suppliers" on public.tender_suppliers for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender suppliers" on public.tender_suppliers for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender suppliers" on public.tender_suppliers for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender tasks" on public.tender_tasks for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender tasks" on public.tender_tasks for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender tasks" on public.tender_tasks for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender tasks" on public.tender_tasks for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender notes" on public.tender_notes for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender notes" on public.tender_notes for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender notes" on public.tender_notes for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender notes" on public.tender_notes for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender timeline events" on public.tender_timeline_events for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender timeline events" on public.tender_timeline_events for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender timeline events" on public.tender_timeline_events for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender timeline events" on public.tender_timeline_events for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their tender submissions" on public.tender_submissions for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their tender submissions" on public.tender_submissions for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their tender submissions" on public.tender_submissions for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their tender submissions" on public.tender_submissions for delete using (company_id = public.get_my_company_id());
