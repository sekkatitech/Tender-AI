import { BellRing, FileCheck2, LineChart, Trophy } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const FINAL_OUTCOMES = [
  {
    icon: FileCheck2,
    title: "Nothing missing",
    body: "Every mandatory returnable checked off before you submit.",
  },
  {
    icon: BellRing,
    title: "Never late",
    body: "Closing dates and compulsory briefings pushed to your phone by NOVA.",
  },
  {
    icon: LineChart,
    title: "Learn from every bid",
    body: "Win/loss history feeds smarter pricing for the next tender.",
  },
] as const

const STEPS = [
  {
    number: "01",
    label: "Discover",
    heading: "Discover Every Opportunity That Matters",
    paragraphs: [
      "TenderPilot AI continuously helps you identify and organise tender opportunities from government departments, municipalities, state-owned enterprises and private organisations. Instead of searching multiple websites manually every day, your team works from a centralised opportunity hub where every tender is categorised, prioritised and tracked according to your business profile.",
      "Your sourcing workspace ensures that no valuable opportunity is missed and every potential contract is captured before the deadline.",
    ],
  },
  {
    number: "02",
    label: "Analyse",
    heading: "Analyse Complex Tender Documents in Minutes",
    paragraphs: [
      "Upload one or multiple tender documents and let AI perform the heavy lifting. TenderPilot AI automatically reads hundreds of pages, extracts critical information, identifies mandatory returnable documents, highlights compliance requirements, summarises technical specifications and creates a structured tender workspace for your team.",
      "Instead of spending hours reading documents manually, your team can immediately focus on preparing a competitive response.",
    ],
  },
  {
    number: "03",
    label: "Price",
    heading: "Build Accurate Pricing with Confidence",
    paragraphs: [
      "Create professional Bills of Quantities (BOQs) using intelligent pricing tools that combine supplier price lists, labour costs, logistics, mark-ups, overheads, contingency and profit margins into one calculation engine. TenderPilot AI recommends suitable products, compares multiple suppliers and helps ensure your pricing remains competitive while protecting your profitability.",
      "Every quotation is calculated using consistent business rules to reduce costly pricing mistakes.",
    ],
  },
  {
    number: "04",
    label: "Manage",
    heading: "Manage Every Tender from One Workspace",
    paragraphs: [
      "TenderPilot AI transforms every tender into a collaborative digital workspace where your entire team can work together. Assign tasks, upload supporting documents, monitor compliance, track deadlines, communicate internally and monitor project progress through a single dashboard.",
      "Every activity is recorded, ensuring complete visibility, accountability and version control throughout the tender preparation process.",
    ],
  },
] as const

const FINAL_STEP = {
  number: "05",
  label: "Win",
  heading: "Submit Winning Tenders with Confidence",
  paragraphs: [
    "When every requirement has been verified, TenderPilot AI helps your team finalise and submit a complete, compliant and professionally prepared tender package. Built-in validation ensures mandatory documents are included, compliance risks are minimised and submission deadlines are never overlooked.",
    "After submission, continue tracking the tender lifecycle, monitor outcomes and use historical data to improve future bid performance.",
  ],
} as const

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mb-20">
          <h2 className="font-display mb-4 text-3xl font-bold text-landing-fg">
            The TenderPilot Workflow
          </h2>
          <p className="text-landing-fg-muted">Five steps from discovery to contract victory.</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} className="glass rounded-3xl p-8 sm:p-10">
              <div className="font-display mb-4 text-4xl text-landing-accent/20">
                {step.number}
              </div>
              <p className="font-mono-label mb-2 text-xs tracking-widest text-landing-accent uppercase">
                {step.label}
              </p>
              <h3 className="font-display mb-4 text-xl font-semibold text-landing-fg">
                {step.heading}
              </h3>
              <div className="space-y-4">
                {step.paragraphs.map((paragraph, j) => (
                  <p key={j} className="text-sm leading-relaxed text-landing-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal
            delay={0.4}
            className="glass-active relative overflow-hidden rounded-3xl p-8 sm:p-12 md:col-span-2"
          >
            <Trophy className="pointer-events-none absolute -right-6 -bottom-8 size-56 text-landing-accent/[0.07]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-display text-4xl text-landing-accent/40">
                    {FINAL_STEP.number}
                  </span>
                  <span className="rounded-full border border-landing-accent/40 bg-landing-accent/10 px-3 py-1 font-mono-label text-xs tracking-widest text-landing-accent uppercase">
                    {FINAL_STEP.label}
                  </span>
                </div>
                <h3 className="font-display mb-5 text-3xl leading-tight font-bold text-landing-fg sm:text-4xl">
                  Submit winning tenders <span className="text-landing-accent">with confidence</span>
                </h3>
                <div className="space-y-3">
                  {FINAL_STEP.paragraphs.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-landing-fg-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <ul className="space-y-3">
                {FINAL_OUTCOMES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="glass flex items-start gap-4 rounded-2xl p-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-landing-accent/15 ring-1 ring-landing-accent/40">
                      <Icon className="size-5 text-landing-accent" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-landing-fg">{title}</p>
                      <p className="mt-1 text-sm text-landing-fg-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
