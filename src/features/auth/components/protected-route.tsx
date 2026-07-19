import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Structural seam for Phase 3 (Authentication). Currently a pass-through —
 * it will check the Supabase session and redirect to /login once real auth
 * is wired in, without any other file needing to change.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>
}
