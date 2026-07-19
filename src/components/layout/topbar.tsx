import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher"

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <WorkspaceSwitcher />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          U
        </div>
      </div>
    </header>
  )
}
