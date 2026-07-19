insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('price-lists', 'price-lists', false)
on conflict (id) do nothing;

-- Path convention: {company_id}/... — the first path segment is the tenant
-- boundary, checked against the same get_my_company_id() helper used by
-- every table's RLS policy.
create policy "Company members can view their files"
  on storage.objects for select
  using (
    bucket_id in ('documents', 'price-lists')
    and (storage.foldername(name))[1] = public.get_my_company_id()::text
  );

create policy "Company members can upload their files"
  on storage.objects for insert
  with check (
    bucket_id in ('documents', 'price-lists')
    and (storage.foldername(name))[1] = public.get_my_company_id()::text
  );

create policy "Company members can update their files"
  on storage.objects for update
  using (
    bucket_id in ('documents', 'price-lists')
    and (storage.foldername(name))[1] = public.get_my_company_id()::text
  )
  with check (
    bucket_id in ('documents', 'price-lists')
    and (storage.foldername(name))[1] = public.get_my_company_id()::text
  );

create policy "Company members can delete their files"
  on storage.objects for delete
  using (
    bucket_id in ('documents', 'price-lists')
    and (storage.foldername(name))[1] = public.get_my_company_id()::text
  );
