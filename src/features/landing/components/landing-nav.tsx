import { Link } from "react-router-dom"

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Solutions" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "Resources" },
]

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-landing-bg/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-12">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TenderPilot AI" className="size-12 shrink-0 rounded-lg" />
          <span className="font-display text-xl font-bold tracking-tight text-landing-fg">
            TenderPilot AI
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono-label text-xs tracking-widest text-landing-fg-muted uppercase transition-colors hover:text-landing-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden rounded-lg border border-landing-border/50 px-6 py-2.5 font-mono-label text-xs text-landing-fg transition-all hover:bg-white/5 lg:block"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-landing-accent px-6 py-2.5 font-mono-label text-xs font-bold text-landing-on-accent transition-all hover:brightness-110 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}
