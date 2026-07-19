# Supabase

Connects to the "Tender Pilot-AI" Supabase project (see `.env.example` for
the required client vars). The full multi-tenant schema is live — see
[../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for the data model
overview.

## Multi-tenancy / RLS

Every business table has a `company_id` column and row-level security
enabled. A `security definer` helper, `public.get_my_company_id()`, resolves
the authenticated user's company (via `profiles`), and every table's
select/insert/update/delete policies check `company_id = get_my_company_id()`
— tenants can never see each other's rows. `companies` and `profiles`
currently have no insert policy: account/company creation is wired in
Phase 3 (Authentication).

## Migrations

Applied via the Supabase MCP tooling and mirrored here in
`supabase/migrations/`, one file per migration, named
`<version>_<name>.sql` to match what's live. Regenerate
`src/types/database.ts` (`generate_typescript_types`) after adding a new
one.

| Migration | Contents |
|---|---|
| `extensions_and_helpers` | `pgcrypto`, shared `set_updated_at()` trigger |
| `core_tenancy` | `companies`, `profiles`, `get_my_company_id()`, RLS |
| `suppliers` | `suppliers`, `supplier_contacts` |
| `products` | `products` (supplier price list line items) |
| `tenders` | `tenders` + workspace tables (contacts, checklist, suppliers, tasks, notes, timeline, submissions) |
| `boq_pricing` | `boq_items` — full cost/pricing column set (§14) |
| `documents` | `documents` — unified table for tender docs, knowledge base, and price lists |
| `notifications` | `notifications` |
| `crm_projects` | `crm_contacts`, `projects` |
| `audit_logs` | `audit_logs` (read-only for clients) |
| `storage_buckets` | `documents` and `price-lists` storage buckets + RLS |
| `security_performance_hardening` | Fixes from `get_advisors`: pinned `search_path`, tightened `get_my_company_id()` grants, missing FK indexes, `(select auth.uid())` in RLS policies |

## Storage

Two private buckets: `documents` and `price-lists`. Files are stored under
`{company_id}/...` — the path's first segment is the RLS tenant boundary,
checked the same way as every table's `company_id`.
