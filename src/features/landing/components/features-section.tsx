import { ArrowRightCircle, ListChecks, Network, Sigma, TrendingUp } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Tender Intelligence",
    body: "A live pipeline view of every tender you're tracking, with status, deadlines, and win-rate reporting built in.",
  },
  {
    icon: Network,
    title: "Supplier Intel",
    body: "A searchable supplier and product catalogue, built from the price lists you already collect every month.",
  },
  {
    icon: Sigma,
    title: "Pricing Engine",
    body: "A full cost breakdown per BOQ line — supplier cost, freight, labour, overheads, markup, and VAT — calculated automatically.",
  },
  {
    icon: ListChecks,
    title: "BOQ Builder",
    body: "Build, price, and manage bills of quantities per tender, with a company-wide library to search across every one you've built.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative border-y border-white/5 bg-[#08192b]/40 py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="max-w-xl">
            <h2 className="font-display mb-4 text-3xl font-bold text-landing-fg">
              Precision-Engineered Features
            </h2>
            <p className="text-landing-fg-muted">
              Tools designed for the highest-stakes procurement environments.
            </p>
          </div>
          <a
            href="#pricing"
            className="glass flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-landing-fg hover:bg-white/5"
          >
            View Feature Tour
            <ArrowRightCircle className="size-4" />
          </a>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08} className="group cursor-default">
              <div className="glass h-full rounded-3xl p-8 transition-all group-hover:-translate-y-2 group-hover:border-landing-accent/50">
                <Icon className="mb-6 size-12 text-landing-accent" />
                <h4 className="font-display mb-4 text-xl font-semibold text-landing-fg">{title}</h4>
                <p className="text-sm leading-relaxed text-landing-fg-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
