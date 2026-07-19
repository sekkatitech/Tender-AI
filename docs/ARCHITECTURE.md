# Architecture

## Vision

TenderPilot AI combines Tender Management, AI Document Analysis, Supplier
Intelligence, Pricing Intelligence, a Company Knowledge Base, and
Procurement Automation into one platform. Long-term, it evolves from a
tender management system into a full Procurement Operating System.

## Development strategy: Framework First

The codebase is built in phases, each building on a stable foundation from
the last. No business logic is implemented until its phase's framework
seam exists.

| Phase | Scope |
|---|---|
| 1 | Framework skeleton — folders, routing, layout, design system, placeholder pages |
| 2 | Database — Supabase schema, RLS policies, multi-tenant tables |
| 3 | Authentication — real Supabase Auth, session handling, protected routes |
| 4 | Dashboard — real data on the dashboard module |
| 5 | Business modules — Tender Management, Supplier Intelligence, Pricing Engine, BOQ Builder, Compliance, etc. |
| 6 | Artificial Intelligence — document analysis, extraction, recommendations |

**This repo is currently at the end of Phase 1.**

## Multi-tenant model

Every company's data is isolated. Each company owns its own Users,
Suppliers, Products, Tenders, Pricing, Documents, Reports, Knowledge Base,
and Settings — no company can access another's data. Every table will
include a `company_id` column, enforced by Row Level Security (Phase 2/3).

`src/app/providers/company-workspace-context.tsx` is the structural stand-in
for this today: it exposes `useCompanyWorkspace()` with a placeholder
workspace list. Phase 2/3 replace the placeholder list with the real
companies the authenticated user belongs to — no consumer of the hook needs
to change.

## Major modules

Dashboard, Tender Management, Supplier Intelligence, Pricing Engine, BOQ
Builder, Compliance, Document Management, Knowledge Base, Reports,
Notifications, CRM, Projects, Administration, Settings, AI Assistant.

Each module lives in its own folder under `src/features/<module>/` and is
registered once in `src/config/navigation.ts` — the single source of truth
the sidebar and router both read from. Adding a module means adding one
entry there plus its `features/<module>/` folder; nothing else needs to
change.

## Layers

```
Frontend → API Layer → Business Services → Supabase Database → Storage → AI Engine → Knowledge Base
```

Every service is designed to be independent and swappable.

## Subscription model

Feature-based licensing is planned: every feature will check the
customer's subscription tier (Starter / Professional / Business /
Enterprise) before becoming available. Not implemented yet — this is a
later-phase concern once billing exists.
