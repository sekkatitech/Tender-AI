import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const COLOR_STYLES = {
  blue: { badge: "bg-blue-500", border: "border-blue-100 dark:border-blue-900/50", blob: "bg-blue-400" },
  emerald: {
    badge: "bg-emerald-500",
    border: "border-emerald-100 dark:border-emerald-900/50",
    blob: "bg-emerald-400",
  },
  amber: {
    badge: "bg-amber-500",
    border: "border-amber-100 dark:border-amber-900/50",
    blob: "bg-amber-400",
  },
  rose: { badge: "bg-rose-500", border: "border-rose-100 dark:border-rose-900/50", blob: "bg-rose-400" },
  violet: {
    badge: "bg-violet-500",
    border: "border-violet-100 dark:border-violet-900/50",
    blob: "bg-violet-400",
  },
} as const

export type StatTileColor = keyof typeof COLOR_STYLES

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  color?: StatTileColor
}

/**
 * Shared across every module's stat-tile row (Dashboard, Reports,
 * Compliance, …) — the color is a decorative per-tile accent for
 * scannability, not a data encoding, so tiles can each pick any color
 * without implying a relationship between them.
 */
export function StatTile({ icon: Icon, label, value, color = "blue" }: StatTileProps) {
  const styles = COLOR_STYLES[color]

  return (
    <Card className={cn("relative gap-3 overflow-hidden p-5", styles.border)}>
      <div
        className={cn(
          "absolute -top-6 -right-6 size-24 rounded-full opacity-[0.12] blur-2xl",
          styles.blob
        )}
      />
      <div className="relative flex items-center gap-2.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
            styles.badge
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="relative text-3xl font-bold tracking-tight text-foreground">{value}</p>
    </Card>
  )
}
