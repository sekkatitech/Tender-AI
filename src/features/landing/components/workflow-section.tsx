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
    body: "Closing dates, compulsory briefings and due tasks on your phone in NOVA.",
  },
  {
    icon: LineChart,
    title: "Learn from every bid",
    body: "Each win and loss you record sharpens the AI forecast for the next tender.",
  },
] as const

const STEPS = [
  {
    number: "01",
    label: "Capture",
    heading: "Bring Every Tender into One Pipeline",
    paragraphs: [
      "Found a tender on eTenders, a municipal site or in your inbox? Upload the PDF or paste the link and it becomes a tender workspace in minutes, or add it by hand with just a title.",
      "Every tender you are chasing sits in one list with its status, closing date and readiness score, so nothing slips past its deadline.",
    ],
  },
  {
    number: "02",
    label: "Analyse",
    heading: "Read the Tender Document in Minutes",
    paragraphs: [
      "TenderPilot AI reads the tender document and fills in the tender number, client, closing and briefing dates, submission and evaluation method, and preference points. It lists every returnable document and flags risks such as compulsory briefings, CIDB grading and penalties.",
      "Each detail shows the page it came from. You check it, correct anything, and save — nothing is created until you approve it.",
    ],
  },
  {
    number: "03",
    label: "Price",
    heading: "Build Accurate Pricing with Confidence",
    paragraphs: [
      "Build the Bill of Quantities (BOQ) line by line from your supplier price lists. The pricing engine adds freight, labour, overheads and markup to each line and works out the price with and without VAT.",
      "Every line is calculated with the same rules, which cuts the costly mistakes of spreadsheet pricing.",
    ],
  },
  {
    number: "04",
    label: "Manage",
    heading: "Manage Every Tender from One Workspace",
    paragraphs: [
      "Each tender gets its own workspace: a returnables checklist, documents, BOQ, linked suppliers, team tasks, notes and the submission record. Invite your team and assign tasks with due dates.",
      "Reminders for closing dates, briefings and due tasks reach you on the web and on your phone through NOVA.",
    ],
  },
] as const

const FINAL_STEP = {
  number: "05",
  label: "Win",
  heading: "Submit Winning Tenders with Confidence",
  paragraphs: [
    "Before you submit, the readiness score shows what is still outstanding — missing mandatory documents, open tasks, an unpriced BOQ or too little time left. The AI win forecast explains your chances and recommends whether to bid.",
    "After submission, record the outcome. Your win/loss history makes the next forecast sharper.",
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
          <p className="text-landing-fg-muted">Five steps from tender document to contract won.</p>
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
