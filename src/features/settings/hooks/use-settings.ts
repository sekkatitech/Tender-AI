import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import * as api from "@/features/settings/api/settings"

export function useMyProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => api.getMyProfile(user!.id),
    enabled: !!user,
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: { fullName: string; avatarUrl: string }) =>
      api.updateMyProfile(user!.id, {
        full_name: input.fullName || null,
        avatar_url: input.avatarUrl || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile", user?.id] })
    },
  })
}
