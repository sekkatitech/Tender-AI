import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useMemo, type ReactNode } from "react"

import { useAuth } from "@/app/providers/auth-context"
import { supabase } from "@/lib/supabase/client"

export interface CompanyWorkspace {
  id: string
  name: string
}

interface CompanyWorkspaceContextValue {
  workspace: CompanyWorkspace
  workspaces: CompanyWorkspace[]
  setWorkspaceId: (id: string) => void
}

const CompanyWorkspaceContext = createContext<CompanyWorkspaceContextValue | null>(
  null
)

/**
 * The multi-tenant "company owns its data" model (blueprint §8) made real:
 * fetches the signed-in user's company via `profiles` (created by the
 * `handle_new_user` signup trigger). One company per user for now — the
 * shape stays ready for multi-workspace support later without changing any
 * consumer of `useCompanyWorkspace()`.
 */
export function CompanyWorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const { data: workspace, isLoading } = useQuery({
    queryKey: ["company-workspace", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<CompanyWorkspace> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("companies(id, name)")
        .eq("id", user!.id)
        .single()

      if (error) throw error
      return data.companies
    },
  })

  const value = useMemo<CompanyWorkspaceContextValue | null>(() => {
    if (!workspace) return null
    return {
      workspace,
      workspaces: [workspace],
      setWorkspaceId: () => {
        // Single-workspace for now — becomes a real switch once a user can
        // belong to more than one company.
      },
    }
  }, [workspace])

  if (user && isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading your workspace…
      </div>
    )
  }

  return (
    <CompanyWorkspaceContext.Provider value={value}>
      {children}
    </CompanyWorkspaceContext.Provider>
  )
}

export function useCompanyWorkspace() {
  const context = useContext(CompanyWorkspaceContext)
  if (!context) {
    throw new Error(
      "useCompanyWorkspace must be used within a CompanyWorkspaceProvider"
    )
  }
  return context
}
