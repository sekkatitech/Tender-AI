import { useNavigate } from "react-router-dom"
import { Bell, Calendar, Check, Clock, FileUp, ListChecks, RefreshCw } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NAV_MODULES } from "@/config/navigation"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications"
import type { Notification } from "@/features/notifications/api/notifications"
import { formatDate } from "@/lib/utils"

const entry = NAV_MODULES.find((m) => m.id === "notifications")!

const TYPE_ICONS: Record<Notification["type"], LucideIcon> = {
  closing_date_reminder: Clock,
  briefing_reminder: Calendar,
  task_due: ListChecks,
  tender_status_change: RefreshCw,
  document_uploaded: FileUp,
  general: Bell,
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { data: notifications, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = (notifications ?? []).filter((n) => !n.is_read).length

  function handleOpen(notification: Notification) {
    if (!notification.is_read) {
      markRead.mutate({ id: notification.id, isRead: true })
    }
    if (notification.related_tender_id) {
      navigate(`/tenders/${notification.related_tender_id}`)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => markAllRead.mutate()}
          disabled={unreadCount === 0 || markAllRead.isPending}
        >
          <Check />
          Mark all as read
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load notifications: {error.message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading notifications…</p>}

          {!isLoading && notifications && notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notifications yet — reminders for closing dates, briefings, and due tasks will
              show up here automatically.
            </p>
          )}

          {notifications && notifications.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type]
                const isClickable = Boolean(n.related_tender_id)
                return (
                  <li key={n.id}>
                    <div
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onClick={isClickable ? () => handleOpen(n) : undefined}
                      className={`flex items-start gap-3 rounded-md border border-border px-3 py-2.5 ${
                        isClickable ? "cursor-pointer hover:bg-muted/40" : ""
                      } ${!n.is_read ? "bg-accent/40" : ""}`}
                    >
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            n.is_read
                              ? "text-sm text-foreground"
                              : "text-sm font-semibold text-foreground"
                          }
                        >
                          {n.title}
                        </p>
                        {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(n.created_at)}
                        </p>
                      </div>
                      {!n.is_read && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            markRead.mutate({ id: n.id, isRead: true })
                          }}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
