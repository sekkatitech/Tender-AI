import type { LucideIcon } from "lucide-react"

interface PlaceholderTabProps {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * Shared by every tab that belongs to a module not built yet (BOQ, Pricing,
 * Suppliers, Documents, AI Analysis, Timeline, History) — keeps the full
 * Tender Workspace tab structure visible now, per blueprint §10, while each
 * tab's real functionality lands with its own module.
 */
export function PlaceholderTab({ title, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
