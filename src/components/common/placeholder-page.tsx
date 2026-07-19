import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * Every module renders this in Phase 1 (framework skeleton). Later phases
 * replace the page inside each feature folder without touching routing,
 * navigation, or layout — this is the "plug into the framework" seam.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="items-center justify-center py-16 text-center">
        <CardHeader className="items-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-6" />
          </div>
          <CardTitle>Coming in a later phase</CardTitle>
          <CardDescription className="max-w-sm">
            This module is part of the TenderPilot AI framework skeleton.
            Its functionality is built in a later development phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  )
}
