import { ChevronDown } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const FAQS = [
  {
    question: "How secure is my proprietary bid data?",
    answer:
      "Every company's data is isolated with row-level security enforced at the database layer — no other company can ever query or see your tenders, pricing, or documents. Your data is never used to train any AI model.",
  },
  {
    question: "Does the AI replace human evaluators?",
    answer:
      "No. TenderPilot is built as a force-multiplier, not a replacement. It automates the tedious data extraction and calculation work, so your team can focus on strategy and proposal quality.",
  },
  {
    question: "Can I trust what the AI pulls out of a tender?",
    answer:
      "You can check it. Every date, returnable document and risk the AI finds shows the page of the tender it came from, and nothing is saved until you have reviewed it. If the document doesn't say something, the AI leaves it blank rather than guessing.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes — NOVA, your mobile assistant. Sign in with your TenderPilot AI account to see a daily briefing, upcoming closing dates and alerts, and to scan IDs, certificates and tender pages straight into your company documents.",
  },
  {
    question: "What industries do you support?",
    answer:
      "We're built for document-heavy, mathematically complex tendering — Construction, ICT, Engineering, Security, Medical, Energy, and Professional Services, across government and private-sector procurement.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-landing-bg-low/20 py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-12">
        <Reveal>
          <h2 className="font-display mb-16 text-center text-3xl font-bold text-landing-fg">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal>
            <div className="rounded-3xl bg-landing-accent p-6 sm:p-10">
              {FAQS.map((faq, i) => (
                <details
                  key={faq.question}
                  className="group border-b border-landing-on-accent/15 py-5 first:pt-0 last:border-0 last:pb-0"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-display text-base font-semibold text-landing-on-accent sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown className="size-5 shrink-0 text-landing-on-accent transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pt-3 text-sm leading-relaxed text-landing-on-accent/80">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col items-center gap-6">
              <div className="glass-active relative max-w-xs rounded-2xl rounded-bl-md p-5">
                <p className="text-sm leading-relaxed text-landing-fg">
                  &quot;I&apos;ll guide you through every stage — from discovering opportunities
                  to submitting a complete, compliant tender.&quot;
                </p>
                <cite className="font-mono-label mt-3 block text-[10px] tracking-widest text-landing-accent uppercase not-italic">
                  — TENDER
                </cite>
                <div className="absolute -bottom-2 left-9 size-4 rotate-45 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl" />
              </div>
              <img
                src="/mascot-hero.png"
                alt="TENDER, the TenderPilot AI mascot"
                className="h-auto w-full max-w-[220px] drop-shadow-2xl"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
