# Supabase

This project connects to an existing Supabase project (see `.env.example`
for the required variables), but no schema exists yet.

Database design, migrations, and Row Level Security policies are built in
**Phase 2** — see [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).
Migrations will live in `supabase/migrations/` and be applied via the
Supabase CLI or MCP tooling, each one versioned per
[../docs/CODING_STANDARDS.md](../docs/CODING_STANDARDS.md).
