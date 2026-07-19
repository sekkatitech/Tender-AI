# TenderPilot AI

TenderPilot AI is a cloud-based, multi-tenant SaaS platform that helps
businesses discover, analyse, prepare, price, manage, submit, and track
tenders using AI. It's an AI Procurement Intelligence Platform, not just a
tender management system — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
for the full picture.

## Status

**Phase 1 — Framework Skeleton (Sprint 0).** This repo currently contains
the application shell only: routing, layout, design system, and one
placeholder page per module. No business logic, database schema, or
authentication has been implemented yet — see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the phased roadmap.

## Tech stack

- **Frontend:** React, TypeScript (strict), Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router
- **Backend:** Supabase (PostgreSQL, Row Level Security, Storage, Edge Functions)
- **Hosting:** Vercel
- **AI:** OpenAI, Claude, Gemini (Phase 6)

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + publishable key
npm run dev
```

Other scripts:

```bash
npm run build     # type-check + production build
npm run lint       # oxlint
npm run preview    # preview the production build locally
```

## Project structure

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for the
feature-based folder structure and coding conventions used throughout the
codebase.
