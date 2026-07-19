create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  registration_number text,
  credit_terms text,
  lead_time_days integer,
  performance_rating numeric(3,2) check (performance_rating between 0 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index suppliers_company_id_idx on public.suppliers(company_id);

create trigger set_suppliers_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

create table public.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);

create index supplier_contacts_company_id_idx on public.supplier_contacts(company_id);
create index supplier_contacts_supplier_id_idx on public.supplier_contacts(supplier_id);

alter table public.suppliers enable row level security;
alter table public.supplier_contacts enable row level security;

create policy "Company members can view their suppliers"
  on public.suppliers for select
  using (company_id = public.get_my_company_id());
create policy "Company members can insert their suppliers"
  on public.suppliers for insert
  with check (company_id = public.get_my_company_id());
create policy "Company members can update their suppliers"
  on public.suppliers for update
  using (company_id = public.get_my_company_id())
  with check (company_id = public.get_my_company_id());
create policy "Company members can delete their suppliers"
  on public.suppliers for delete
  using (company_id = public.get_my_company_id());

create policy "Company members can view their supplier contacts"
  on public.supplier_contacts for select
  using (company_id = public.get_my_company_id());
create policy "Company members can insert their supplier contacts"
  on public.supplier_contacts for insert
  with check (company_id = public.get_my_company_id());
create policy "Company members can update their supplier contacts"
  on public.supplier_contacts for update
  using (company_id = public.get_my_company_id())
  with check (company_id = public.get_my_company_id());
create policy "Company members can delete their supplier contacts"
  on public.supplier_contacts for delete
  using (company_id = public.get_my_company_id());
