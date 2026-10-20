import { ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { Link } from "react-router-dom"

import { Reveal } from "@/features/landing/components/reveal"
import { ShaderBackground } from "@/features/landing/components/shader-background"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <ShaderBackground className="absolute inset-0 h-full w-full opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-landing-bg via-transparent to-landing-bg" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-16 px-4 py-24 md:px-12 lg:grid-cols-2 lg:items-center lg:py-0">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-accent/30 bg-landing-accent/5 px-3 py-1">
            <Zap className="size-3.5 text-landing-accent" />
            <span className="font-mono-label text-xs tracking-widest text-landing-accent uppercase">
              Africa&apos;s AI-Powered Tender Platform
            </span>
          </div>

          <h1 className="font-display mb-6 text-4xl leading-tight font-extrabold tracking-tight text-landing-fg sm:text-5xl lg:text-[60px] lg:leading-[72px]">
            Win More Tenders <br />
            <span className="text-glow text-landing-accent">with AI Intelligence.</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-landing-fg-muted">
            TenderPilot AI is an intelligent procurement and tender management platform that
            helps businesses analyse tenders, automate compliance, compare supplier pricing,
            generate BOQs, and prepare winning submissions faster than ever before.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="font-display group flex items-center gap-3 rounded-xl bg-landing-accent px-8 py-4 font-bold text-landing-on-accent transition-all hover:brightness-110"
            >
              Start Winning Now
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#dashboard-preview"
              className="glass font-display rounded-xl border border-white/10 px-8 py-4 font-bold text-landing-fg transition-all hover:bg-white/5"
            >
              View Demo
            </a>
          </div>

          <p className="font-mono-label mt-4 text-xs tracking-widest text-landing-fg-muted uppercase">
            15-day free trial · No credit card required
          </p>
        </Reveal>

        <Reveal delay={0.2} className="relative">
          <div className="absolute inset-0 rounded-full bg-landing-accent/10 blur-[120px]" />

          <div className="glass-active absolute -top-6 -left-4 z-20 rounded-xl p-4 sm:-top-10 sm:-left-10">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-landing-accent/20">
                <ShieldCheck className="size-5 text-landing-accent" />
              </div>
              <div>
                <p className="font-mono-label text-[10px] text-landing-fg">Compliance Score</p>
                <p className="font-display text-lg font-bold text-landing-accent">98.4%</p>
              </div>
            </div>
          </div>

          <img
            src="/mascot-hero.png"
            alt="TENDER, the TenderPilot AI mascot"
            className="relative z-10 mx-auto h-auto w-full max-w-md drop-shadow-2xl"
          />

          <div className="glass-active absolute -right-2 -bottom-4 z-20 w-56 rounded-xl p-4 sm:-right-6 sm:-bottom-6">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-landing-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-landing-accent" />
              </span>
              <p className="font-mono-label text-[10px] text-landing-fg">AI Analysis Complete</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[95%] bg-landing-accent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
