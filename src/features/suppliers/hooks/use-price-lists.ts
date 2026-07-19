import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/suppliers/api/suppliers"

export function usePriceLists(supplierId: string) {
  return useQuery({
    queryKey: ["suppliers", supplierId, "price-lists"],
    queryFn: () => api.listPriceLists(supplierId),
  })
}

export function useUploadPriceList(supplierId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (file: File) =>
      api.uploadPriceList({
        companyId: workspace.id,
        supplierId,
        uploadedBy: user?.id ?? null,
        file,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", supplierId, "price-lists"] })
    },
  })
}

export function useDownloadPriceList() {
  return useMutation({
    mutationFn: (storagePath: string) => api.getPriceListDownloadUrl(storagePath),
  })
}
