import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useChecklistItems(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "checklist"],
    queryFn: () => api.listChecklistItems(tenderId),
  })
}

export function useAddChecklistItem(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: { label: string; isMandatory: boolean }) =>
      api.createChecklistItem({
        tender_id: tenderId,
        company_id: workspace.id,
        label: input.label,
        is_mandatory: input.isMandatory,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "checklist"] })
    },
  })
}

export function useToggleChecklistItem(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isComplete }: { id: string; isComplete: boolean }) =>
      api.setChecklistItemComplete(id, isComplete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "checklist"] })
    },
  })
}

export function useDeleteChecklistItem(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteChecklistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "checklist"] })
    },
  })
}
