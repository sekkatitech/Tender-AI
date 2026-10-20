import { useEffect, useMemo, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/app/providers/auth-context"
import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"
import { useOpenTasks } from "@/features/dashboard/hooks/use-dashboard"
import { computeReminderCandidates } from "@/features/notifications/lib/generate-reminders"
import { useTenders } from "@/features/tenders/hooks/use-tenders"
import * as api from "@/features/notifications/api/notifications"

const QUERY_KEY = ["notifications"]

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: api.listNotifications,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      api.markNotificationRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

/**
 * Generates missing reminder notifications once per mount (ref-gated, so it
 * never re-fires on refetches) — the app has no cron/Edge Function to do
 * this server-side yet, so it happens client-side wherever this hook is
 * mounted (Topbar, above every authenticated route).
 */
export function useGenerateReminders() {
  const { data: tenders } = useTenders()
  const { data: openTasks } = useOpenTasks()
  const { data: notifications } = useNotifications()
  const { workspace } = useCompanyWorkspace()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const firedRef = useRef(false)

  const { mutate: insertReminders } = useMutation({
    mutationFn: api.createNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  useEffect(() => {
    if (firedRef.current) return
    if (!tenders || !openTasks || !notifications || !user) return
    firedRef.current = true

    const candidates = computeReminderCandidates({
      tenders,
      openTasks,
      existingNotifications: notifications,
    })
    if (candidates.length > 0) {
      insertReminders(
        candidates.map((c) => ({ ...c, company_id: workspace.id, profile_id: user.id }))
      )
    }
  }, [tenders, openTasks, notifications, workspace, user, insertReminders])

  const unreadCount = useMemo(
    () => (notifications ?? []).filter((n) => !n.is_read).length,
    [notifications]
  )

  return { unreadCount }
}
