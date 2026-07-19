import { useMutation, useQuery } from "@tanstack/react-query"

import * as api from "@/features/documents/api/documents"
import type { LibraryDocument } from "@/features/documents/api/documents"

export function useAllDocuments() {
  return useQuery({
    queryKey: ["documents-library"],
    queryFn: api.listAllDocuments,
  })
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: ({ category, storagePath }: { category: LibraryDocument["category"]; storagePath: string }) =>
      api.getDocumentDownloadUrl(category, storagePath),
  })
}
