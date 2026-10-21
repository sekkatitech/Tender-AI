import type { ReactNode } from "react"

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[hsl(212_62%_6%)] bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/login-background.png')" }}
    >
      {/* Dark scrim so the logo, headings, and footer text stay legible over
          every part of the photo, not just its darker corners. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <img
            src="/logo.png"
            alt="TenderPilot AI"
            className="size-10 shrink-0 rounded-xl shadow-[0_0_24px_-2px_hsl(195_100%_60%/0.55)]"
          />
          <span className="text-lg font-semibold tracking-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            TenderPilot AI
          </span>
        </div>

        {/* Frosted glass, not a solid card — lets the background photo show
            through while keeping form text at full contrast. */}
        <div className="rounded-xl border border-white/20 bg-white/75 p-6 shadow-2xl backdrop-blur-xl dark:bg-black/50">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {footer}
          </p>
        )}
      </div>
    </div>
  )
}
