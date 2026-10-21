import {
  Briefcase,
  Building2,
  Cpu,
  HeartPulse,
  Package,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/features/landing/components/reveal"

const INDUSTRIES: { label: string; detail: string; icon: LucideIcon; tint: string }[] = [
  { label: "ICT", detail: "Laptops, networks, smart boards", icon: Cpu, tint: "from-cyan-400 to-blue-500" },
  { label: "Construction", detail: "Civil works, building, roads", icon: Building2, tint: "from-amber-400 to-orange-500" },
  { label: "Engineering", detail: "Water, mechanical, electrical", icon: Wrench, tint: "from-sky-400 to-indigo-500" },
  { label: "Security", detail: "Guarding, CCTV, access control", icon: Shield, tint: "from-emerald-400 to-teal-500" },
  { label: "Office Supplies", detail: "Stationery, furniture, printing", icon: Package, tint: "from-violet-400 to-purple-500" },
  { label: "Medical", detail: "Equipment, consumables, PPE", icon: HeartPulse, tint: "from-rose-400 to-pink-500" },
  { label: "Energy", detail: "Solar, generators, maintenance", icon: Zap, tint: "from-yellow-300 to-amber-500" },
  { label: "Professional Services", detail: "Consulting, training, audits", icon: Briefcase, tint: "from-blue-400 to-cyan-500" },
]

export function TrustedBySection() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-24">
      {/* Full-width tinted band so the section stands apart from the hero. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b2236]/80 via-[#0a1a2b]/60 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-landing-accent/60 to-transparent" />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-12">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-mono-label text-xs tracking-[0.25em] text-landing-accent uppercase">
            Built for every tender-heavy industry
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-landing-fg sm:text-4xl">
            One platform for every sector that bids
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {INDUSTRIES.map(({ label, detail, icon: Icon, tint }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <div className="glass group flex h-full flex-col items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-landing-accent/50">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="size-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-landing-fg">{label}</p>
                  <p className="mt-1 text-sm text-landing-fg-muted">{detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
