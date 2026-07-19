import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import type { Database } from "@/types/database"

type TenderStatus = Database["public"]["Enums"]["tender_status"]

const STATUS_CONFIG: Record<
  TenderStatus,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  discovered: { label: "Discovered", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  submitted: { label: "Submitted", variant: "outline" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
  archived: { label: "Archived", variant: "secondary" },
}

export function TenderStatusBadge({ status }: { status: TenderStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const TENDER_STATUS_OPTIONS: { value: TenderStatus; label: string }[] = (
  Object.keys(STATUS_CONFIG) as TenderStatus[]
).map((value) => ({ value, label: STATUS_CONFIG[value].label }))
