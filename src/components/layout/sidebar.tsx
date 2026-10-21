import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { NAV_MODULES } from "@/config/navigation"
import { PLANS } from "@/config/plans"
import { useCompany } from "@/features/administration/hooks/use-administration"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { data: company } = useCompany()
  const currentIndex = PLANS.findIndex((p) => p.id === company?.subscription_tier)
  // The plan one step up from the current one; Enterprise users see "Compare plans".
  const nextPlan = PLANS[Math.max(currentIndex, 0) + 1]

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl md:flex">
      <div className="flex flex-col items-center gap-2 border-b border-sidebar-border px-4 py-6">
        <img
          src="/logo.png"
          alt="TenderPilot AI"
          className="size-16 shrink-0 rounded-2xl shadow-[0_0_28px_-2px_hsl(195_100%_60%/0.55)]"
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
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_20px_-4px_hsl(195_100%_60%/0.55)] hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              )
            }
          >
            <mod.icon className="size-4 shrink-0" />
            <span className="truncate">{mod.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(195_100%_45%)] to-[hsl(262_70%_55%)] ring-1 ring-white/15 p-4">
          <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" />
          <p className="text-sm font-semibold text-white">
            {nextPlan ? `Upgrade to ${nextPlan.name}` : "Compare plans"}
          </p>
          <p className="mt-1 text-xs text-white/80">
            {nextPlan?.aiAnalysesPerMonth
              ? `${nextPlan.aiAnalysesPerMonth} AI tender analyses a month and up to ${nextPlan.seats} users.`
              : "Custom AI volume, your own AI key and SSO."}
          </p>
          <NavLink
            to="/upgrade"
            className="mt-3 inline-flex rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            See plans
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
