create type public.project_status as enum ('active', 'on_hold', 'completed', 'cancelled');

create table public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  organization text,
  email text,
  phone text,
  role text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crm_contacts_company_id_idx on public.crm_contacts(company_id);

create trigger set_crm_contacts_updated_at
  before update on public.crm_contacts
  for each row execute function public.set_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid references public.tenders(id) on delete set null,
  name text not null,
  status public.project_status not null default 'active',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_company_id_idx on public.projects(company_id);
create index projects_tender_id_idx on public.projects(tender_id);

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.crm_contacts enable row level security;
alter table public.projects enable row level security;

create policy "Company members can view their crm contacts" on public.crm_contacts for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their crm contacts" on public.crm_contacts for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their crm contacts" on public.crm_contacts for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their crm contacts" on public.crm_contacts for delete using (company_id = public.get_my_company_id());

create policy "Company members can view their projects" on public.projects for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their projects" on public.projects for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their projects" on public.projects for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their projects" on public.projects for delete using (company_id = public.get_my_company_id());
