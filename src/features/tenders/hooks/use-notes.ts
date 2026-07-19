import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useNotes(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "notes"],
    queryFn: () => api.listNotes(tenderId),
  })
}

export function useAddNote(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (body: string) =>
      api.createNote({
        tender_id: tenderId,
        company_id: workspace.id,
        author_id: user?.id ?? null,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "notes"] })
    },
  })
}
