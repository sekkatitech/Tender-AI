import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/suppliers/api/suppliers"

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: api.listSuppliers,
  })
}

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => api.getSupplier(id!),
    enabled: !!id,
  })
}

interface CreateSupplierInput {
  name: string
  registrationNumber?: string
  creditTerms?: string
  leadTimeDays?: number
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: CreateSupplierInput) =>
      api.createSupplier({
        company_id: workspace.id,
        name: input.name,
        registration_number: input.registrationNumber || null,
        credit_terms: input.creditTerms || null,
        lead_time_days: input.leadTimeDays ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export function useUpdateSupplier(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: api.SupplierUpdate) => api.updateSupplier(id, patch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.setQueryData(["suppliers", id], data)
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}
