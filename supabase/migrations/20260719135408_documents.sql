create type public.document_category as enum (
  'tender_mandatory',
  'tender_technical',
  'tender_submission',
  'tender_other',
  'company_profile',
  'supplier_agreement',
  'pricing_policy',
  'proposal_template',
  'reference_letter',
  'technical_document',
  'past_winning_tender',
  'certificate',
  'supplier_price_list',
  'other'
);

-- One unified table for Document Management (§Document Management), the
-- Company Knowledge Base (§16), and supplier price lists (§12) — a document
-- is distinguished by `category` plus which optional scope column is set.
-- Price lists are versioned by inserting a new row (higher `version`), never
-- overwriting the previous one, per §12.
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  category public.document_category not null,
  tender_id uuid references public.tenders(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  name text not null,
  storage_path text not null,
  file_size bigint,
  mime_type text,
  version integer not null default 1,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index documents_company_id_idx on public.documents(company_id);
create index documents_tender_id_idx on public.documents(tender_id);
create index documents_supplier_id_idx on public.documents(supplier_id);
create index documents_category_idx on public.documents(category);

alter table public.products
  add constraint products_source_document_id_fkey
  foreign key (source_document_id) references public.documents(id) on delete set null;

alter table public.documents enable row level security;

create policy "Company members can view their documents" on public.documents for select using (company_id = public.get_my_company_id());
create policy "Company members can insert their documents" on public.documents for insert with check (company_id = public.get_my_company_id());
create policy "Company members can update their documents" on public.documents for update using (company_id = public.get_my_company_id()) with check (company_id = public.get_my_company_id());
create policy "Company members can delete their documents" on public.documents for delete using (company_id = public.get_my_company_id());
