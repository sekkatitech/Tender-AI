# Coding standards

## Folder structure

```
src/
  app/                    Router, providers, root-level wiring
    providers/
    router.tsx
  components/
    ui/                   shadcn/ui primitives (Button, Card, Input, ...)
    layout/               AppShell, Sidebar, Topbar, WorkspaceSwitcher
    common/                Small components shared across features (PlaceholderPage, ...)
  config/
    navigation.ts          Single source of truth for every module (id, label, path, icon)
  features/
    <module>/
      pages/                Route-level page components
      components/           Components used only within this module
      index.ts               Barrel export — the module's public surface
  lib/
    supabase/              Supabase client
    utils.ts                cn() and other framework-agnostic helpers
  hooks/                    Shared React hooks
```

## Rules

- **Every feature is its own module** under `src/features/<name>/`, with an
  `index.ts` barrel as its only public surface. Other code imports from the
  barrel, never reaches into `pages/` or `components/` directly.
- **No duplicated logic.** Shared UI goes in `components/ui` or
  `components/common`; shared data (like the module list) lives in one
  place (`config/navigation.ts`) and is read by whatever needs it (sidebar,
  router).
- **Strict TypeScript.** `strict` and `noUncheckedIndexedAccess` are on in
  `tsconfig.app.json`. Don't relax them to silence an error — fix the type.
- **Path alias:** import app code via `@/...` (maps to `src/`), never deep
  relative paths like `../../../`.
- **Reusable components only.** If a piece of UI is used in more than one
  place, it belongs in `components/`, not copy-pasted.
- **Every database migration is versioned** (Phase 2 onward) — no manual,
  undocumented schema changes against a shared project.
- **No shortcuts.** A module without real functionality yet still gets a
  real folder, a real route, and a real placeholder page — not a TODO
  comment or a commented-out route.
