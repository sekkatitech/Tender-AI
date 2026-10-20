import { CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Reveal } from "@/features/landing/components/reveal"

const PLANS = [
  {
    name: "Starter",
    blurb: "Dip a toe in — see what AI tender analysis can do.",
    price: "R199",
    period: "/mo",
    features: [
      "100 pages of AI document analysis / mo",
      "Upload only the pages that matter — key requirements, not every repeated boilerplate page",
      "Tender pipeline dashboard",
      "Basic BOQ & pricing engine",
      "Supplier & product catalogue",
      "Compliance checklist tracking",
      "Email support",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    blurb: "For teams actively bidding every month.",
    price: "R1,005",
    period: "/mo",
    features: [
      "300 pages of AI document analysis / mo",
      "Everything in Starter, plus:",
      "Full pricing engine with margin & cost breakdown",
      "Team collaboration — tasks, notes, timeline",
      "Reports & win-rate analytics",
      "Notifications & deadline reminders",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Business",
    blurb: "For high-volume teams bidding at scale.",
    price: "R3,999",
    period: "/mo",
    features: [
      "Unlimited AI document analysis",
      "Everything in Professional, plus:",
      "Unlimited team members",
      "Company knowledge base",
      "CRM & post-award project tracking",
      "Custom compliance workflows",
      "Priority phone & email support",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Enterprise",
    blurb: "For multi-national firms.",
    price: "Custom",
    period: "",
    features: [
      "Unlimited everything",
      "Dedicated AI models",
      "Custom API integration",
      "Dedicated account manager",
      "Custom onboarding & training",
      "SLA-backed support",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mb-20 text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-landing-fg">
            Strategic Investment Plans
          </h2>
          <p className="mb-3 text-landing-fg-muted">Choose the armor that fits your mission scale.</p>
          <p className="font-mono-label text-xs tracking-widest text-landing-accent uppercase">
            15-day free trial on every plan · No credit card required
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={
                  plan.featured
                    ? "glass-active relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-landing-accent/50 p-8"
                    : "glass flex h-full flex-col rounded-3xl border border-white/5 p-8"
                }
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-landing-accent px-5 py-1 font-mono-label text-[10px] tracking-widest text-landing-on-accent uppercase">
                    Most Popular
                  </div>
                )}
                <h4 className="font-display mb-2 text-xl font-semibold text-landing-fg">
                  {plan.name}
                </h4>
                <p className="mb-6 text-sm text-landing-fg-muted">{plan.blurb}</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-landing-fg">{plan.price}</span>
                  <span className="text-landing-fg-muted">{plan.period}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-landing-fg-muted">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-landing-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.name === "Enterprise" ? (
                  <a
                    href="mailto:hello@tenderpilot.ai"
                    className="block w-full rounded-xl border border-white/10 py-3.5 text-center font-bold text-landing-fg transition-all hover:bg-white/5"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    to="/signup"
                    className={
                      plan.featured
                        ? "block w-full rounded-xl bg-landing-accent py-3.5 text-center font-bold text-landing-on-accent shadow-lg shadow-landing-accent/20 transition-all hover:brightness-110"
                        : "block w-full rounded-xl border border-white/10 py-3.5 text-center font-bold text-landing-fg transition-all hover:bg-white/5"
                    }
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
