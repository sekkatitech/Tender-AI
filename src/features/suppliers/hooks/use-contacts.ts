import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/suppliers/api/suppliers"

export function useContacts(supplierId: string) {
  return useQuery({
    queryKey: ["suppliers", supplierId, "contacts"],
    queryFn: () => api.listContacts(supplierId),
  })
}

interface AddContactInput {
  name: string
  email?: string
  phone?: string
  role?: string
}

export function useAddContact(supplierId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: AddContactInput) =>
      api.createContact({
        supplier_id: supplierId,
        company_id: workspace.id,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        role: input.role || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", supplierId, "contacts"] })
    },
  })
}

export function useDeleteContact(supplierId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", supplierId, "contacts"] })
    },
  })
}
