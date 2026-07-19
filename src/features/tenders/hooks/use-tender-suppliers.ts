import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useTenderSuppliers(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "suppliers"],
    queryFn: () => api.listTenderSuppliers(tenderId),
  })
}

export function useLinkSupplier(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (supplierId: string) =>
      api.linkSupplier({ tenderId, companyId: workspace.id, supplierId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "suppliers"] })
    },
  })
}

export function useUnlinkSupplier(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.unlinkSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "suppliers"] })
    },
  })
}
