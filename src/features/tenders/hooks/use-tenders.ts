import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useTenders() {
  return useQuery({
    queryKey: ["tenders"],
    queryFn: api.listTenders,
  })
}

export function useTender(id: string | undefined) {
  return useQuery({
    queryKey: ["tenders", id],
    queryFn: () => api.getTender(id!),
    enabled: !!id,
  })
}

interface CreateTenderInput {
  title: string
  tenderNumber?: string
  client?: string
  department?: string
  closingDate?: string
}

export function useCreateTender() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: CreateTenderInput) =>
      api.createTender({
        company_id: workspace.id,
        created_by: user?.id ?? null,
        title: input.title,
        tender_number: input.tenderNumber || null,
        client: input.client || null,
        department: input.department || null,
        closing_date: input.closingDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] })
    },
  })
}

export function useUpdateTender(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: api.TenderUpdate) => api.updateTender(id, patch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] })
      queryClient.setQueryData(["tenders", id], data)
    },
  })
}

export function useDeleteTender() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] })
    },
  })
}
