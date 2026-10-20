# TenderPilot AI — Handover

Last updated: 2026-07-20. Read this first if picking work back up cold — it captures the state of the project and what's queued next.

## What TenderPilot AI is

A multi-tenant SaaS tender/procurement management platform for African businesses — "AI Procurement Intelligence Platform," not just tender tracking. Stack: React + TypeScript + Vite + Tailwind + shadcn/ui + TanStack Query (frontend), Supabase/Postgres + RLS + Storage (backend). Every table carries `company_id`; row-level security enforces tenant isolation. Built against a "Master Project Handover & Development Blueprint" the user supplied at the start.

## Build status

**All 15 non-AI business modules are built**: Authentication, Tender Management, Supplier Intelligence, Pricing Engine, BOQ Builder, Document Management, Knowledge Base, Dashboard, Reports, Compliance, Notifications, CRM, Projects, Administration, Settings. Each has a real DB-backed CRUD flow, verified with a throwaway Supabase account via Playwright.

**Still placeholder**: AI Assistant (blueprint Phase 6 — needs an AI provider/API key decision, not yet made). Help Center exists as a static knowledge base + search widget, not real conversational AI (same blocker).

**Public marketing landing page** (`/`, `src/features/landing/`) was built this session as a full port of an approved design prototype — nav, hero (WebGL shader background), trusted-by, problem, "Meet TENDER" (the AI mascot), 5-step workflow, features, dashboard preview (real screenshot, not a mockup), pricing, FAQ, final CTA, footer. `/login` and `/signup` are the real auth pages. Catch-all now redirects to `/` instead of `/dashboard`; authenticated routes are unaffected (still gate to `/login`).

## Today's session (2026-07-20) — landing page polish

- **Pricing language**: replaced "AI document scanning" → "AI document analysis" throughout (`pricing-section.tsx`, `meet-tender-section.tsx`) — the user clarified tenders arrive as digital soft copies with user-selected pages uploaded, not physical scans, so "scanning" was inaccurate.
- **15-day free trial**: added as a hook — genuinely true today since signup collects no payment info at all. Trial messaging now lives in three places: under the Hero CTAs, under the Pricing section heading, and under the Final CTA buttons. Starter/Professional/Business pricing CTAs all read "Start Free Trial"; Enterprise stays "Contact Sales" (no self-serve trial for custom deals).
- **Pricing tiers** (already finalized, ZAR, page-based metering): Starter R199/mo (100 pages), Professional R1,005/mo (300 pages, "Most Popular"), Business R3,999/mo (unlimited), Enterprise (Custom, sales-assisted). Full feature lists per tier in `src/features/landing/components/pricing-section.tsx`.
- **Logo visibility**: nav logo bumped from 36px → 48px (was "too small to recognize" per user); logo also added to the footer (40px, next to the wordmark) — previously footer had text only.
- **FAQ section redesign** (`faq-section.tsx`): was a plain centered accordion that looked out of place. Now a two-column layout — FAQ accordion on the left in a solid accent-blue container (dark text on cyan, stands out against the dark page), and the TENDER mascot with a speech-bubble quote on the right ("I'll guide you through every stage — from discovering opportunities to submitting a complete, compliant tender."). On mobile it stacks FAQ-first-then-mascot (natural DOM order, no CSS reordering needed).
- **Mascot quote softened** (`meet-tender-section.tsx` blockquote): "I don't just manage tenders... I help you win them." → "...I help you stand a good chance of winning them." — user felt the original overpromised.

All changes verified via `npx tsc -b` + `npx oxlint`, and live-rendered screenshots (desktop + mobile) with a temp Playwright script, per the established verification pattern for this project (installed with `--no-save`, deleted after, never committed to package.json/lockfile).

## Signup gap fixed (2026-07-20, end of session)

The user asked how team members get named, which surfaced a real gap: neither the owner-signup form nor the invite-acceptance form ever collected the person's actual name — `handle_new_user()` always read `full_name` from signup metadata, but the client never sent it, so everyone showed as "Unnamed" in Administration/Topbar until they separately visited Settings → My Profile.

**Fixed**: added a required "Your full name" field to `SignupPage.tsx` (shown in both the owner-creates-workspace and invite-acceptance flows), threaded through `useAuth().signUp()` (`auth-context.tsx` — signature is now `signUp(email, password, fullName, companyName, inviteToken?)`, note the param order change if anything else ever calls it) as `full_name` in the Supabase signup metadata. No migration needed — `handle_new_user()` already read that key, it just never received a value. Verified end-to-end with a throwaway signup: Administration's Team Members table now shows the real name immediately after signup, no "Unnamed" placeholder and no detour through Settings required.

## Content-integrity rules established this project (keep following these)

- Never ship fabricated certifications, stats, or social proof (a past pass caught and rewrote a fake "SOC-2 Type II compliant" claim, a fake "99.9% OCR accuracy" stat, and fake customer logos in the "Trusted By" section).
- Aspirational language about the product vision is fine and encouraged ("sell the vision"); specific verifiable-sounding false claims are not.
- Document-handling copy should say "AI reads/analyses already-digital pages," never "scans" — matches how the product actually works (soft-copy PDFs, user-selected pages).

## Tomorrow: payment integration + testing

**Current state — clean slate, nothing built yet:**
- `subscription_tier` Postgres enum already exists (`starter | professional | business | enterprise`) and is shown read-only on the Administration page (`AdministrationPage.tsx`) — no upgrade/downgrade UI, no billing table, no webhook handling.
- No payment provider is wired in anywhere — grepped the whole repo, zero references to Stripe/PayFast/Paystack/any payment SDK. No billing-related env vars (`.env.example` only has the two Supabase keys).
- Landing page pricing (R199/R1,005/R3,999/Custom, ZAR) and the "15-day free trial, no credit card required" messaging are live and public-facing now — whatever gets built needs to honor those numbers and the trial promise, or the pricing copy needs to change alongside it.

**Open decisions to make before starting:**
1. **Which payment provider** — this is a South African business charging in ZAR. Stripe has real limitations for South African merchants (no direct ZAR payout support historically); PayFast and Paystack are the common local alternatives. Worth deciding this explicitly before writing any integration code.
2. **Trial enforcement mechanism** — right now "15-day free trial" is just marketing copy; there's no code that starts a trial clock, checks expiry, or gates features when it lapses. Needs a `trial_ends_at` (or similar) on `companies`, checked somewhere (RLS? app-level gate? both?).
3. **Metering** — pricing is "pages of AI document analysis per month," but there's no AI document analysis feature built yet (that's the still-placeholder AI Assistant / Phase 6 work) and no page-count tracking anywhere. Decide whether payment integration this round is just "collect a card, start a subscription, gate by tier" (plan enforcement can come later), or whether metering needs to land at the same time.
4. **Where billing UI lives** — Administration currently just displays the tier as a read-only badge; that's the natural place for an "Upgrade" / "Manage billing" flow, but confirm with the user before building.

**Suggested first step tomorrow**: don't start writing code — walk through these four decisions with the user first (payment provider especially, since it constrains everything else), then plan the DB schema (subscription records, trial tracking) before touching the UI.

## Useful environment notes

- Supabase project ref: `vlmqwunhjtonopoydizh`. CLI has cached login credentials on this machine — `npx supabase link --project-ref vlmqwunhjtonopoydizh`, `npx supabase db push`, `npx supabase gen types typescript --linked` all work without a fresh login prompt.
- `pgcrypto` functions live in the `extensions` schema on this project, not `public` — qualify as `extensions.gen_random_bytes(...)` etc.
- First Supabase request after a fresh `npm run dev` start has intermittently failed once with "Failed to fetch" — safe to retry, not a real bug.
- Verification pattern for any UI change: `npm install --no-save playwright` → temp `.tmp.cjs` script → screenshot/assert → delete script + screenshots → `npm uninstall playwright --no-save`. Never let this touch `package.json`/lockfile permanently.
