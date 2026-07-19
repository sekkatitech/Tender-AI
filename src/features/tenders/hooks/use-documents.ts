import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import type { DocumentCategory } from "@/config/document-categories"
import * as api from "@/features/tenders/api/documents"

export function useTenderDocuments(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "documents"],
    queryFn: () => api.listTenderDocuments(tenderId),
  })
}

export function useUploadTenderDocument(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ file, category }: { file: File; category: DocumentCategory }) =>
      api.uploadTenderDocument({
        tenderId,
        companyId: workspace.id,
        uploadedBy: user?.id ?? null,
        category,
        file,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "documents"] })
    },
  })
}

export function useDeleteTenderDocument(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, storagePath }: { id: string; storagePath: string }) =>
      api.deleteTenderDocument(id, storagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "documents"] })
    },
  })
}

export function useDownloadTenderDocument() {
  return useMutation({
    mutationFn: (storagePath: string) => api.getTenderDocumentDownloadUrl(storagePath),
  })
}
