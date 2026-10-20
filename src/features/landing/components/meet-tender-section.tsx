import { Brain, Search, Trophy } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const PILLARS = [
  {
    icon: Search,
    title: "Discover Opportunities",
    body: "TENDER monitors your tender pipeline to help you find the perfect contracts that match your firm's exact capabilities.",
  },
  {
    icon: Brain,
    title: "Intelligent Analysis",
    body: "Automated extraction of key requirements, risks, and compliance hurdles — designed to happen in seconds, not days.",
  },
  {
    icon: Trophy,
    title: "Winning Strategy",
    body: "AI-driven pricing and proposal support tailored to the specific evaluation criteria of each tender.",
  },
]

export function MeetTenderSection() {
  return (
    <section className="relative overflow-hidden bg-landing-bg-low/30 py-32">
      <div className="mx-auto grid max-w-[1440px] gap-20 px-4 md:px-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="font-display mb-8 text-4xl leading-tight font-extrabold text-landing-fg sm:text-[48px]">
            Meet <span className="text-landing-accent">TENDER</span>,<br />
            Your AI Copilot
          </h2>
          <div className="space-y-8">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-landing-accent/20">
                  <Icon className="size-5 text-landing-accent" />
                </div>
                <div>
                  <h4 className="font-display mb-2 text-xl font-semibold text-landing-fg">
                    {title}
                  </h4>
                  <p className="text-landing-fg-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="glass mt-12 rounded-xl border-l-4 border-landing-accent p-6">
            <p className="mb-2 text-landing-fg italic">
              &quot;I don&apos;t just manage tenders... I help you stand a good chance of winning
              them.&quot;
            </p>
            <cite className="font-mono-label text-xs tracking-widest text-landing-accent uppercase not-italic">
              — TENDER
            </cite>
          </blockquote>
        </Reveal>

        <Reveal delay={0.3} className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-landing-accent/10 blur-[100px]" />
          <div className="glass-active relative overflow-hidden rounded-3xl p-4 shadow-2xl">
            <img
              src="/login-background.png"
              alt="TENDER, a chrome-and-cyan AI mascot, working at a command center surrounded by holographic tender analysis panels"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
