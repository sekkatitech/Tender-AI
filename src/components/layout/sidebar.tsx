import { NavLink } from "react-router-dom"

import { NAV_MODULES } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          TP
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          TenderPilot AI
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_MODULES.map((mod) => (
          <NavLink
            key={mod.id}
            to={mod.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )
            }
          >
            <mod.icon className="size-4 shrink-0" />
            <span className="truncate">{mod.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
