import { Reveal } from "@/features/landing/components/reveal"

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
            className="rounded-3xl bg-landing-accent p-8 text-landing-on-accent sm:p-10 md:col-span-2"
          >
            <div className="font-display mb-4 text-4xl opacity-30">{FINAL_STEP.number}</div>
            <p className="font-mono-label mb-2 text-xs tracking-widest uppercase opacity-70">
              {FINAL_STEP.label}
            </p>
            <h3 className="font-display mb-4 text-2xl font-bold">{FINAL_STEP.heading}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {FINAL_STEP.paragraphs.map((paragraph, j) => (
                <p key={j} className="text-sm leading-relaxed opacity-90">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
