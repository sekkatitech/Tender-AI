import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

import { CompanyWorkspaceProvider } from "@/app/providers/company-workspace-context"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyWorkspaceProvider>{children}</CompanyWorkspaceProvider>
    </QueryClientProvider>
  )
}
