import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

/** Highlights the link for whichever section is currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    for (const id of ids) {
      const el = document.getElementById(id.slice(1))
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}

const SECTION_IDS = NAV_LINKS.map((l) => l.href)

export function LandingNav() {
  const active = useActiveSection(SECTION_IDS)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-12">
        <a href="#" className="flex items-center gap-3">
          <img src="/logo.png" alt="TenderPilot AI" className="size-11 shrink-0 rounded-xl" />
          <span className="font-display text-xl font-bold tracking-tight text-landing-fg">
            TenderPilot AI
          </span>
        </a>

        <div className="glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium text-landing-fg-muted transition-all hover:bg-white/10 hover:text-landing-fg",
                active === link.href &&
                  "bg-landing-accent/15 text-landing-accent shadow-[inset_0_0_0_1px_rgba(0,218,243,0.35)] hover:bg-landing-accent/20 hover:text-landing-accent"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm font-medium text-landing-fg transition-all hover:bg-white/10 lg:block"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-landing-accent px-6 py-2.5 text-sm font-semibold text-landing-on-accent shadow-lg shadow-landing-accent/20 transition-all hover:brightness-110 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}
