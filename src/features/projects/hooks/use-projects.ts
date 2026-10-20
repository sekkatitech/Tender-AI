import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/projects/api/projects"
import type { Database } from "@/types/database"

type ProjectStatus = Database["public"]["Enums"]["project_status"]

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: api.listProjects,
  })
}

interface ProjectFormInput {
  name: string
  tenderId: string | null
  status: ProjectStatus
  startDate: string
  endDate: string
  notes: string
}

function toInsertPayload(input: ProjectFormInput) {
  return {
    name: input.name,
    tender_id: input.tenderId,
    status: input.status,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    notes: input.notes || null,
  }
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (input: ProjectFormInput) =>
      api.createProject({ company_id: workspace.id, ...toInsertPayload(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProjectFormInput }) =>
      api.updateProject(id, toInsertPayload(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
