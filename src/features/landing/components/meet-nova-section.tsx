import { BellRing, ScanLine, Sunrise } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const NOVA_FEATURES = [
  {
    icon: Sunrise,
    title: "Daily briefing",
    body: "What closes this week, what's still missing and which tasks are due.",
  },
  {
    icon: BellRing,
    title: "Deadlines and alerts",
    body: "Closing dates and compulsory briefings, wherever you are.",
  },
  {
    icon: ScanLine,
    title: "Scan documents",
    body: "Photograph IDs, certificates and tender pages into one PDF, saved to your company documents.",
  },
]

export function MeetNovaSection() {
  return (
    <section id="nova" className="relative overflow-hidden py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal delay={0.2} className="relative order-last lg:order-first">
          <div className="absolute inset-0 scale-110 rounded-full bg-landing-accent/10 blur-[100px]" />
          <img
            src="/nova-mascot.png"
            alt="NOVA, the TenderPilot AI mobile assistant, a chrome-and-blue robot"
            className="relative mx-auto h-auto w-full max-w-sm drop-shadow-2xl"
          />
        </Reveal>

        <Reveal>
          <p className="mb-3 font-mono-label text-xs tracking-[0.25em] text-landing-accent uppercase">
            On your phone
          </p>
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-landing-fg sm:text-4xl">
            Meet <span className="text-landing-accent">NOVA</span>, your mobile assistant
          </h2>
          <p className="mb-5 max-w-lg text-landing-fg-muted">
            NOVA brings your TenderPilot AI workspace to your phone. Same account, same tenders —
            so you can stay on top of a bid from the site, the office or the road.
          </p>
          <p className="mb-8 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
            Free with every TenderPilot AI account
          </p>

          <ul className="space-y-4">
            {NOVA_FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-landing-accent/20">
                  <Icon className="size-4 text-landing-accent" />
                </div>
                <div>
                  <p className="font-display font-semibold text-landing-fg">{title}</p>
                  <p className="text-sm text-landing-fg-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
