import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useSubmissions(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "submissions"],
    queryFn: () => api.listSubmissions(tenderId),
  })
}

interface AddSubmissionInput {
  method?: string
  referenceNumber?: string
  submittedAt?: string
  notes?: string
}

export function useAddSubmission(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: AddSubmissionInput) =>
      api.createSubmission({
        tender_id: tenderId,
        company_id: workspace.id,
        method: input.method || null,
        reference_number: input.referenceNumber || null,
        submitted_at: input.submittedAt || new Date().toISOString(),
        notes: input.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "submissions"] })
    },
  })
}
