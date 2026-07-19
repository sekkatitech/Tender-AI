create table public.boq_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  quantity numeric(14,3) not null default 1,
  unit text,
  sort_order integer not null default 0,

  -- Cost inputs (blueprint §14)
  supplier_cost numeric(14,2) not null default 0,
  freight numeric(14,2) not null default 0,
  insurance numeric(14,2) not null default 0,
  import_costs numeric(14,2) not null default 0,
  labour numeric(14,2) not null default 0,
  travel numeric(14,2) not null default 0,
  accommodation numeric(14,2) not null default 0,
  support numeric(14,2) not null default 0,
  warranty numeric(14,2) not null default 0,
  overheads numeric(14,2) not null default 0,
  risk numeric(14,2) not null default 0,
  contingency numeric(14,2) not null default 0,

  -- Derived pricing outputs — computed by the Phase 5 Pricing Engine, stored
  -- so results are persisted/auditable rather than recalculated on every read.
  markup_percent numeric(6,3) not null default 0,
  vat_percent numeric(6,3) not null default 15,
  gross_profit numeric(14,2) not null default 0,
  net_profit numeric(14,2) not null default 0,
  selling_price numeric(14,2) not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index boq_items_company_id_idx on public.boq_items(company_id);
create index boq_items_tender_id_idx on public.boq_items(tender_id);
create index boq_items_product_id_idx on public.boq_items(product_id);

create trigger set_boq_items_updated_at
  before update on public.boq_items
  for each row execute function public.set_updated_at();

alter table public.boq_items enable row level security;

create policy "Company members can view their boq items" on public.boq_items for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their boq items" on public.boq_items for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their boq items" on public.boq_items for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their boq items" on public.boq_items for delete using (company_id = public.get_my_company_id());
