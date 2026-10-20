import { Reveal } from "@/features/landing/components/reveal"

export function DashboardPreviewSection() {
  return (
    <section id="dashboard-preview" className="relative py-32">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-landing-fg">
            See It In Action
          </h2>
          <p className="text-landing-fg-muted">
            The real dashboard — pipeline, pricing, suppliers, and reports, all in one place.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="glass-active relative rounded-[40px] p-4 shadow-2xl md:p-8">
            <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-r from-landing-accent/20 to-transparent opacity-50 blur" />
            <div className="relative aspect-16/9 overflow-hidden rounded-[32px] border border-white/10 bg-landing-bg">
              <img
                src="/dashboard-preview.png"
                alt="TenderPilot AI dashboard showing tender pipeline, stat tiles, and closing-soon list"
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
