import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { NAV_MODULES } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex flex-col items-center gap-2 border-b border-sidebar-border px-4 py-6">
        <img
          src="/logo.png"
          alt="TenderPilot AI"
          className="size-16 shrink-0 rounded-2xl shadow-[0_0_28px_-2px_hsl(205_90%_50%/0.7)]"
        />
        <span className="text-sm font-semibold tracking-wide text-white">
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
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_20px_-4px_hsl(205_90%_50%/0.7)] hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              )
            }
          >
            <mod.icon className="size-4 shrink-0" />
            <span className="truncate">{mod.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(205_90%_50%)] to-[hsl(258_70%_58%)] p-4">
          <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" />
          <p className="text-sm font-semibold text-white">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-white/80">
            Unlock AI tender analysis and advanced pricing intelligence.
          </p>
          <NavLink
            to="/administration"
            className="mt-3 inline-flex rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            Upgrade
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
