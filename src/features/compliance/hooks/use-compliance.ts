import { useQuery } from "@tanstack/react-query"

import * as api from "@/features/compliance/api/compliance"

export function useAllChecklistItems() {
  return useQuery({
    queryKey: ["compliance", "checklist-items"],
    queryFn: api.listAllChecklistItems,
  })
}
