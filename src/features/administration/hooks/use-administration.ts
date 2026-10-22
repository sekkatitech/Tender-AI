import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import * as api from "@/features/administration/api/administration"
import type { Database } from "@/types/database"

type UserRole = Database["public"]["Enums"]["user_role"]

export interface Member {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
  email: string | null
}

export function useMembers() {
  return useQuery({
    queryKey: ["administration", "members"],
    queryFn: async (): Promise<Member[]> => {
      const [profiles, emails] = await Promise.all([
        api.listProfiles(),
        api.listMemberEmails(),
      ])
      const emailById = new Map(emails.map((e) => [e.id, e.email]))
      return profiles.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        role: p.role,
        created_at: p.created_at,
        email: emailById.get(p.id) ?? null,
      }))
    },
  })
}

export function useMyProfile() {
  const { user } = useAuth()
  const { data: members } = useMembers()
  return members?.find((m) => m.id === user?.id) ?? null
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      api.updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "members"] })
    },
  })
}

export function useInvites() {
  return useQuery({
    queryKey: ["administration", "invites"],
    queryFn: api.listInvites,
  })
}

export function useCreateInvite() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: { email: string; role: UserRole }) =>
      api.createInvite({
        company_id: workspace.id,
        invited_by: user?.id ?? null,
        email: input.email,
        role: input.role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "invites"] })
    },
  })
}

export function useRevokeInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.revokeInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "invites"] })
    },
  })
}

export function useCompany(options?: { refetchInterval?: number | false }) {
  const { workspace } = useCompanyWorkspace()

  return useQuery({
    queryKey: ["administration", "company", workspace.id],
    queryFn: () => api.getCompany(workspace.id),
    refetchInterval: options?.refetchInterval,
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  const { workspace } = useCompanyWorkspace()

  return useMutation({
    mutationFn: (name: string) => api.updateCompany(workspace.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration", "company", workspace.id] })
      queryClient.invalidateQueries({ queryKey: ["company-workspace"] })
    },
  })
}
