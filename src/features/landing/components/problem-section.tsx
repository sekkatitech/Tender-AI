import { BookOpen, Clock, TrendingDown } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const PROBLEMS = [
  {
    icon: BookOpen,
    title: "Manual Document Fatigue",
    body: "Wasting hundreds of hours reading thousands of pages of RFP documentation just to find basic requirements.",
  },
  {
    icon: TrendingDown,
    title: "Pricing Inaccuracies",
    body: "Small mistakes in complex pricing engines lead to margin erosion and failed project outcomes.",
  },
  {
    icon: Clock,
    title: "Missed Deadlines",
    body: "Slow internal approval cycles and document preparation cause you to miss critical submission windows.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-landing-fg">
            Old Procurement is Broken
          </h2>
          <p className="text-landing-fg-muted">
            Traditional manual processes lead to missed opportunities and costly errors. It&apos;s
            time to upgrade your arsenal.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="glass h-full rounded-2xl p-8 transition-all hover:border-landing-accent/30">
                <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-landing-error/10">
                  <Icon className="size-6 text-landing-error" />
                </div>
                <h3 className="font-display mb-3 text-xl font-semibold text-landing-fg">{title}</h3>
                <p className="text-landing-fg-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
