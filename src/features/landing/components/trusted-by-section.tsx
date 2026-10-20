import { Briefcase, Building2, Cpu, HeartPulse, Package, Shield, Wrench, Zap } from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const INDUSTRIES = [
  { label: "ICT", icon: Cpu },
  { label: "Construction", icon: Building2 },
  { label: "Engineering", icon: Wrench },
  { label: "Security", icon: Shield },
  { label: "Office Supplies", icon: Package },
  { label: "Medical", icon: HeartPulse },
  { label: "Energy", icon: Zap },
  { label: "Professional Services", icon: Briefcase },
]

export function TrustedBySection() {
  return (
    <section className="border-y border-white/5 bg-landing-bg-lowest/50 py-24">
      <div className="mx-auto max-w-[1440px] px-4 text-center md:px-12">
        <Reveal>
          <p className="mb-12 font-mono-label text-xs tracking-[0.3em] text-landing-fg-muted uppercase">
            Built for teams across every tender-heavy industry
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 opacity-60 grayscale transition-all duration-700 hover:grayscale-0">
            {INDUSTRIES.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 font-display font-bold text-landing-fg">
                <Icon className="size-5 text-landing-accent" />
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
