import { useQuery } from "@tanstack/react-query"

import * as api from "@/features/reports/api/reports"

export function useBoqItemsWithTenders() {
  return useQuery({
    queryKey: ["reports", "boq-items"],
    queryFn: api.listBoqItemsWithTenders,
  })
}
