import { useState } from "react"
import { CheckCircle2, Layers, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import {
  ANNUAL_MONTHS_CHARGED,
  ANNUAL_SAVING_PERCENT,
  formatRand,
  PLAN_FINE_PRINT,
  PLANS,
  type Plan,
} from "@/config/plans"
import { Reveal } from "@/features/landing/components/reveal"
import { cn } from "@/lib/utils"

type Billing = "monthly" | "yearly"

function PlanPrice({ plan, billing }: { plan: Plan; billing: Billing }) {
  if (plan.monthlyRand == null) {
    return (
      <div className="mb-6 min-h-[84px]">
        <span className="font-display text-4xl font-bold text-landing-fg">Custom</span>
        <p className="mt-2 text-sm text-landing-fg-muted">Tailored to your volume</p>
      </div>
    )
  }

  if (billing === "monthly") {
    return (
      <div className="mb-6 min-h-[84px]">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold text-landing-fg">
            {formatRand(plan.monthlyRand)}
          </span>
          <span className="text-landing-fg-muted">/month</span>
        </div>
        <p className="mt-2 text-sm text-landing-fg-muted">
          or {formatRand(plan.monthlyRand * ANNUAL_MONTHS_CHARGED)}/year — save {ANNUAL_SAVING_PERCENT}%
        </p>
      </div>
    )
  }

  const yearly = plan.monthlyRand * ANNUAL_MONTHS_CHARGED
  const saving = plan.monthlyRand * 12 - yearly
  return (
    <div className="mb-6 min-h-[84px]">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-landing-fg">{formatRand(yearly)}</span>
        <span className="text-landing-fg-muted">/year</span>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-landing-fg-muted">
        <span className="text-landing-fg-muted/70 line-through">{formatRand(plan.monthlyRand * 12)}</span>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
          You save {formatRand(saving)}
        </span>
      </p>
      <p className="mt-1 text-xs text-landing-fg-muted">
        ≈ {formatRand(yearly / 12)}/month, billed yearly
      </p>
    </div>
  )
}

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly")

  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 font-mono-label text-xs tracking-[0.25em] text-landing-accent uppercase">
            Pricing
          </p>
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-landing-fg sm:text-4xl">
            Pay per tender analysed, not per page
          </h2>
          <p className="mx-auto max-w-2xl text-landing-fg-muted">
            Uploads, e-tender links and phone scans are always free. 15-day free trial on every
            plan — no credit card required.
          </p>
        </Reveal>

        <Reveal className="mb-12 flex justify-center">
          <div className="glass inline-flex items-center gap-1 rounded-full p-1.5" role="radiogroup" aria-label="Billing period">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={billing === option}
                onClick={() => setBilling(option)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                  billing === option
                    ? "bg-landing-accent text-landing-on-accent shadow-lg shadow-landing-accent/25"
                    : "text-landing-fg-muted hover:text-landing-fg"
                )}
              >
                {option === "monthly" ? "Monthly" : "Yearly"}
                {option === "yearly" && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      billing === "yearly"
                        ? "bg-landing-on-accent/15 text-landing-on-accent"
                        : "bg-emerald-400/15 text-emerald-300"
                    )}
                  >
                    2 months free
                  </span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1",
                  plan.featured ? "glass-active lg:-mt-4 lg:pb-12" : "glass"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-landing-accent px-4 py-1 text-xs font-bold text-landing-on-accent shadow-lg shadow-landing-accent/30">
                    <Sparkles className="size-3.5" />
                    Most popular
                  </div>
                )}
                <h3 className="font-display mb-2 text-2xl font-bold text-landing-fg">{plan.name}</h3>
                <p className="mb-6 min-h-[40px] text-sm text-landing-fg-muted">{plan.blurb}</p>

                <PlanPrice plan={plan} billing={billing} />

                <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-landing-fg">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-landing-accent" />
                      <span className="text-landing-fg/85">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.id === "enterprise" ? (
                  <a
                    href="mailto:hello@tenderpilot.ai"
                    className="block w-full rounded-xl border border-white/20 bg-white/5 py-3.5 text-center font-bold text-landing-fg transition-all hover:bg-white/10"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    to={`/signup?plan=${plan.id}&billing=${billing}`}
                    className={cn(
                      "block w-full rounded-xl py-3.5 text-center font-bold transition-all",
                      plan.featured
                        ? "bg-landing-accent text-landing-on-accent shadow-lg shadow-landing-accent/25 hover:brightness-110"
                        : "border border-white/20 bg-white/5 text-landing-fg hover:bg-white/10"
                    )}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {PLAN_FINE_PRINT.map((line) => (
            <div key={line} className="glass flex items-start gap-3 rounded-2xl px-5 py-4 text-sm text-landing-fg-muted">
              <Layers className="mt-0.5 size-4 shrink-0 text-landing-accent" />
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
