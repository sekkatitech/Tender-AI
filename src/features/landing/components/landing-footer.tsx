import { Globe, Share2 } from "lucide-react"

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const COMPANY_LINKS = ["About Us", "Careers", "Contact"]
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Settings"]

export function LandingFooter() {
  return (
    <footer className="border-t border-landing-border/20 bg-landing-bg-lowest px-4 py-16 md:px-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-6 flex items-center gap-3">
            <img src="/logo.png" alt="TenderPilot AI" className="size-10 shrink-0 rounded-lg" />
            <span className="font-display text-xl font-bold text-landing-fg">TenderPilot AI</span>
          </div>
          <p className="mb-8 text-landing-fg-muted">
            Africa&apos;s AI-powered tender and procurement intelligence platform.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:hello@tenderpilot.ai"
              aria-label="Email"
              className="glass flex size-10 items-center justify-center rounded-full transition-colors hover:border-landing-accent"
            >
              <Globe className="size-5 text-landing-fg" />
            </a>
            <span className="glass flex size-10 items-center justify-center rounded-full">
              <Share2 className="size-5 text-landing-fg" />
            </span>
          </div>
        </div>

        <div>
          <h5 className="mb-6 font-mono-label text-xs tracking-widest text-landing-fg uppercase">
            Product
          </h5>
          <ul className="space-y-4">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-landing-fg-muted transition-colors hover:text-landing-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-6 font-mono-label text-xs tracking-widest text-landing-fg uppercase">
            Company
          </h5>
          <ul className="space-y-4">
            {COMPANY_LINKS.map((label) => (
              <li key={label} className="text-landing-fg-muted">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-6 font-mono-label text-xs tracking-widest text-landing-fg uppercase">
            Legal
          </h5>
          <ul className="space-y-4">
            {LEGAL_LINKS.map((label) => (
              <li key={label} className="text-landing-fg-muted">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
        <p className="font-mono-label text-xs text-landing-fg-muted">
          © 2026 TenderPilot AI. All rights reserved.
        </p>
        <p className="font-mono-label text-xs text-landing-fg-muted">Built for champions.</p>
      </div>
    </footer>
  )
}
