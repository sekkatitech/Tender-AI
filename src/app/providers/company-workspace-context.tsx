import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

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
 * Structural stand-in for the multi-tenant "company owns its data" model
 * (blueprint §8). Phase 2/3 replace this static list with the company the
 * authenticated user belongs to, scoped by `company_id` in Supabase — every
 * consumer of `useCompanyWorkspace()` stays unchanged.
 */
const DEFAULT_WORKSPACE: CompanyWorkspace = { id: "demo-company", name: "Demo Company" }
const PLACEHOLDER_WORKSPACES: CompanyWorkspace[] = [DEFAULT_WORKSPACE]

export function CompanyWorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState(DEFAULT_WORKSPACE.id)

  const value = useMemo<CompanyWorkspaceContextValue>(() => {
    const workspace =
      PLACEHOLDER_WORKSPACES.find((w) => w.id === workspaceId) ??
      DEFAULT_WORKSPACE

    return { workspace, workspaces: PLACEHOLDER_WORKSPACES, setWorkspaceId }
  }, [workspaceId])

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
