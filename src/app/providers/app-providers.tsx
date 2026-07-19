import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

import { AuthProvider } from "@/app/providers/auth-context"
import { CompanyWorkspaceProvider } from "@/app/providers/company-workspace-context"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CompanyWorkspaceProvider>{children}</CompanyWorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
