import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/suppliers/api/suppliers"

export function useProducts(supplierId: string) {
  return useQuery({
    queryKey: ["suppliers", supplierId, "products"],
    queryFn: () => api.listProducts(supplierId),
  })
}

interface AddProductInput {
  sku?: string
  description: string
  manufacturer?: string
  category?: string
  cost?: number
  currency?: string
  availability?: string
}

export function useAddProduct(supplierId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: AddProductInput) =>
      api.createProduct({
        supplier_id: supplierId,
        company_id: workspace.id,
        sku: input.sku || null,
        description: input.description,
        manufacturer: input.manufacturer || null,
        category: input.category || null,
        cost: input.cost ?? null,
        currency: input.currency || "ZAR",
        availability: input.availability || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", supplierId, "products"] })
    },
  })
}

export function useDeleteProduct(supplierId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", supplierId, "products"] })
    },
  })
}
