import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/boq"
import type { BoqLineFormInput } from "@/features/tenders/api/boq"

export function useBoqItems(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "boq"],
    queryFn: () => api.listBoqItems(tenderId),
  })
}

export function useCompanyProducts() {
  return useQuery({
    queryKey: ["company-products"],
    queryFn: api.listCompanyProducts,
  })
}

export function useAddBoqItem(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: BoqLineFormInput) =>
      api.createBoqItem({ tenderId, companyId: workspace.id, input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "boq"] })
    },
  })
}

export function useUpdateBoqItem(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BoqLineFormInput }) =>
      api.updateBoqItem({ id, input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "boq"] })
    },
  })
}

export function useDeleteBoqItem(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteBoqItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "boq"] })
    },
  })
}
