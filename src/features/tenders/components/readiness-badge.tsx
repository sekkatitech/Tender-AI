import type { Readiness, ReadinessBand } from "@/features/tenders/lib/readiness"
import { cn } from "@/lib/utils"

export const READINESS_BAND: Record<ReadinessBand, { label: string; className: string }> = {
  ready: { label: "Ready to submit", className: "text-emerald-500" },
  on_track: { label: "On track", className: "text-primary" },
  at_risk: { label: "At risk", className: "text-amber-500" },
  critical: { label: "Critical", className: "text-destructive" },
}

/** Score and band in one line, for table rows. */
export function ReadinessBadge({ readiness }: { readiness: Readiness }) {
  const band = READINESS_BAND[readiness.band]
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 whitespace-nowrap", band.className)}>
      <span className="font-semibold tabular-nums">{readiness.score}</span>
      <span className="text-xs">{band.label}</span>
    </span>
  )
}
