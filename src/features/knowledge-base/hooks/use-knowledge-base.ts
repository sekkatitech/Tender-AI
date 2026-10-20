import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import type { DocumentCategory } from "@/config/document-categories"
import * as api from "@/features/knowledge-base/api/knowledge-base"

const QUERY_KEY = ["knowledge-base-documents"]

export function useKnowledgeBaseDocuments() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: api.listKnowledgeBaseDocuments,
  })
}

export function useUploadKnowledgeBaseDocument() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ file, category }: { file: File; category: DocumentCategory }) =>
      api.uploadKnowledgeBaseDocument({
        companyId: workspace.id,
        uploadedBy: user?.id ?? null,
        category,
        file,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteKnowledgeBaseDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, storagePath }: { id: string; storagePath: string }) =>
      api.deleteKnowledgeBaseDocument(id, storagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDownloadKnowledgeBaseDocument() {
  return useMutation({
    mutationFn: (storagePath: string) => api.getKnowledgeBaseDocumentDownloadUrl(storagePath),
  })
}
