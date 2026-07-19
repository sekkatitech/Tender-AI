create table public.products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  -- FK to public.documents added in the `documents` migration (documents
  -- table doesn't exist yet at this point in the migration sequence).
  source_document_id uuid,
  sku text,
  description text not null,
  manufacturer text,
  category text,
  cost numeric(14,2),
  currency text not null default 'ZAR',
  availability text,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_company_id_idx on public.products(company_id);
create index products_supplier_id_idx on public.products(supplier_id);

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "Company members can view their products"
  on public.products for select
  using (company_id = public.get_my_company_id());
create policy "Company members can insert their products"
  on public.products for insert
  with check (company_id = public.get_my_company_id());
create policy "Company members can update their products"
  on public.products for update
  using (company_id = public.get_my_company_id())
  with check (company_id = public.get_my_company_id());
create policy "Company members can delete their products"
  on public.products for delete
  using (company_id = public.get_my_company_id());
