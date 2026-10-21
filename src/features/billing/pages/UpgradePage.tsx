import { useState } from "react"
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ANNUAL_MONTHS_CHARGED,
  ANNUAL_SAVING_PERCENT,
  formatRand,
  PLANS,
  type Plan,
} from "@/config/plans"
import { useCompany } from "@/features/administration/hooks/use-administration"
import { cn } from "@/lib/utils"

type Billing = "monthly" | "yearly"

const SALES_EMAIL = "hello@tenderpilot.ai"

function priceLine(plan: Plan, billing: Billing) {
  if (plan.monthlyRand == null) return { main: "Custom", sub: "Tailored to your volume" }
  if (billing === "monthly") {
    return {
      main: `${formatRand(plan.monthlyRand)}/month`,
      sub: `or ${formatRand(plan.monthlyRand * ANNUAL_MONTHS_CHARGED)}/year (save ${ANNUAL_SAVING_PERCENT}%)`,
    }
  }
  const yearly = plan.monthlyRand * ANNUAL_MONTHS_CHARGED
  return {
    main: `${formatRand(yearly)}/year`,
    sub: `≈ ${formatRand(yearly / 12)}/month · you save ${formatRand(plan.monthlyRand * 12 - yearly)}`,
  }
}

export function UpgradePage() {
  const { data: company } = useCompany()
  const [billing, setBilling] = useState<Billing>("yearly")
  const [chosen, setChosen] = useState<Plan | null>(null)

  const currentIndex = PLANS.findIndex((p) => p.id === company?.subscription_tier)

  // Online checkout isn't wired yet (payment provider still to be chosen), so
  // an upgrade is requested by email and activated manually for now.
  const mailto = chosen
    ? `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(
        `Upgrade request: ${chosen.name} (${billing})`
      )}&body=${encodeURIComponent(
        `Hi TenderPilot team,\n\nPlease upgrade ${company?.name ?? "our workspace"} to the ${chosen.name} plan, billed ${billing}.\n\nThank you.`
      )}`
    : undefined

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Upgrade your plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every plan includes unlimited uploads, e-tender links and NOVA phone scans. You pay for
            AI tender analyses and team size.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 backdrop-blur-xl">
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all",
                billing === option
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_hsl(195_100%_60%/0.6)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option === "monthly" ? "Monthly" : "Yearly"}
              {option === "yearly" && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    billing === "yearly"
                      ? "bg-primary-foreground/15"
                      : "bg-emerald-400/15 text-emerald-300"
                  )}
                >
                  2 months free
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan, i) => {
          const isCurrent = i === currentIndex
          const isDowngrade = currentIndex >= 0 && i < currentIndex
          const { main, sub } = priceLine(plan, billing)

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative gap-5",
                plan.featured && "border-primary/50 shadow-[0_0_40px_-12px_hsl(195_100%_60%/0.5)]",
                isCurrent && "ring-2 ring-primary/60"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                {isCurrent ? (
                  <Badge>Current plan</Badge>
                ) : plan.featured ? (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="size-3" />
                    Most popular
                  </Badge>
                ) : null}
              </div>
              <p className="min-h-10 text-sm text-muted-foreground">{plan.blurb}</p>

              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{main}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </div>

              <ul className="flex-1 space-y-2.5 border-t border-border pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground/85">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === "enterprise" ? (
                <Button variant="outline" asChild>
                  <a href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent("Enterprise enquiry")}`}>
                    Talk to sales
                  </a>
                </Button>
              ) : (
                <Button
                  variant={plan.featured && !isCurrent ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => setChosen(plan)}
                >
                  {isCurrent ? "Your plan" : isDowngrade ? `Switch to ${plan.name}` : `Upgrade to ${plan.name}`}
                </Button>
              )}
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex-row items-start gap-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Fair metering</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All documents for one tender count as one analysis. Addenda and re-runs within 30 days
              are free. Top-up packs of 10 analyses are available on every paid plan.
            </p>
          </div>
        </Card>
        <Card className="flex-row items-start gap-4">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Billing in rand</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Prices exclude VAT. Cancel or change plan any time; yearly plans are charged up front
              for 10 months and give you 12.
            </p>
          </div>
        </Card>
      </div>

      <Dialog open={chosen != null} onOpenChange={(open) => !open && setChosen(null)}>
        <DialogContent>
          {chosen && (
            <>
              <DialogHeader>
                <DialogTitle>Upgrade to {chosen.name}</DialogTitle>
                <DialogDescription>
                  {priceLine(chosen, billing).main} · {chosen.aiAnalysesPerMonth} AI tender analyses a
                  month · up to {chosen.seats} {chosen.seats === 1 ? "user" : "users"}.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Online card and EFT checkout is launching soon. Until then, send us your request and
                we'll activate {chosen.name} on your workspace within one business day. Your current
                plan keeps working in the meantime.
              </p>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setChosen(null)}>
                  Cancel
                </Button>
                <Button asChild>
                  <a href={mailto} onClick={() => setChosen(null)}>
                    Request upgrade
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
