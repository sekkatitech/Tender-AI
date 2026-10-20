import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import type { Database } from "@/types/database"

type ProjectStatus = Database["public"]["Enums"]["project_status"]

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  active: { label: "Active", variant: "default" },
  on_hold: { label: "On Hold", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = (
  Object.keys(STATUS_CONFIG) as ProjectStatus[]
).map((value) => ({ value, label: STATUS_CONFIG[value].label }))
