import { useQuery } from "@tanstack/react-query"

import * as api from "@/features/dashboard/api/dashboard"

export function useOpenTasks() {
  return useQuery({
    queryKey: ["dashboard", "open-tasks"],
    queryFn: api.listOpenTasks,
  })
}
