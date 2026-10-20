import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/crm/api/crm"

export function useCrmContacts() {
  return useQuery({
    queryKey: ["crm-contacts"],
    queryFn: api.listContacts,
  })
}

interface CreateCrmContactInput {
  name: string
  organization?: string
  role?: string
  email?: string
  phone?: string
  notes?: string
}

export function useCreateCrmContact() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: CreateCrmContactInput) =>
      api.createContact({
        company_id: workspace.id,
        name: input.name,
        organization: input.organization || null,
        role: input.role || null,
        email: input.email || null,
        phone: input.phone || null,
        notes: input.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] })
    },
  })
}

export function useUpdateCrmContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCrmContactInput }) =>
      api.updateContact(id, {
        name: input.name,
        organization: input.organization || null,
        role: input.role || null,
        email: input.email || null,
        phone: input.phone || null,
        notes: input.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] })
    },
  })
}

export function useDeleteCrmContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] })
    },
  })
}
