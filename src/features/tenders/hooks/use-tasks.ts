import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/tenders/api/tenders"

export function useTasks(tenderId: string) {
  return useQuery({
    queryKey: ["tenders", tenderId, "tasks"],
    queryFn: () => api.listTasks(tenderId),
  })
}

export function useAddTask(tenderId: string) {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: { title: string; dueDate?: string }) =>
      api.createTask({
        tender_id: tenderId,
        company_id: workspace.id,
        title: input.title,
        due_date: input.dueDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "tasks"] })
    },
  })
}

export function useSetTaskStatus(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.setTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "tasks"] })
    },
  })
}

export function useDeleteTask(tenderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders", tenderId, "tasks"] })
    },
  })
}
