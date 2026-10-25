import { Link } from "react-router-dom"

import { Reveal } from "@/features/landing/components/reveal"

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 text-center md:px-12">
        <Reveal>
          <div className="glass-active rounded-[48px] px-8 py-24">
            <h2 className="font-display mb-6 text-4xl font-extrabold text-landing-fg sm:text-5xl">
              Ready to Lead the Market?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-landing-fg-muted">
              Join the next generation of procurement teams using AI to win more of the tenders
              they go after.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-2xl bg-landing-accent px-12 py-5 text-lg font-bold text-landing-on-accent transition-all hover:scale-105"
              >
                Start Your Free Trial
              </Link>
              <a
                href="mailto:info@sekkatitech.co.za"
                className="glass rounded-2xl border border-white/10 px-12 py-5 text-lg font-bold text-landing-fg transition-all hover:bg-white/5"
              >
                Schedule a Private Demo
              </a>
            </div>
            <p className="font-mono-label mt-6 text-xs tracking-widest text-landing-fg-muted uppercase">
              1 month free · No credit card required
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
