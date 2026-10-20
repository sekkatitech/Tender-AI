import { formatDate } from "@/lib/utils"
import type { OpenTask } from "@/features/dashboard/api/dashboard"
import type { Tender } from "@/features/tenders/api/tenders"
import type { Database, Tables } from "@/types/database"

type NotificationType = Database["public"]["Enums"]["notification_type"]

export interface ReminderCandidate {
  type: NotificationType
  title: string
  body: string
  related_tender_id: string
}

const CLOSED_STATUSES = new Set(["won", "lost", "archived"])
const MS_PER_DAY = 1000 * 60 * 60 * 24

function daysUntil(dateStr: string): number {
  return (new Date(dateStr).getTime() - Date.now()) / MS_PER_DAY
}

/**
 * No `related_task_id` column exists on `notifications`, so `task_due`
 * dedups on the tender alone — a tender with several due tasks only ever
 * gets one `task_due` reminder.
 */
export function computeReminderCandidates({
  tenders,
  openTasks,
  existingNotifications,
}: {
  tenders: Tender[]
  openTasks: OpenTask[]
  existingNotifications: Tables<"notifications">[]
}): ReminderCandidate[] {
  const existingKeys = new Set(
    existingNotifications.map((n) => `${n.type}:${n.related_tender_id}`)
  )
  const candidates: ReminderCandidate[] = []

  function addCandidate(candidate: ReminderCandidate) {
    const key = `${candidate.type}:${candidate.related_tender_id}`
    if (existingKeys.has(key)) return
    existingKeys.add(key)
    candidates.push(candidate)
  }

  for (const t of tenders) {
    if (CLOSED_STATUSES.has(t.status)) continue

    if (t.closing_date) {
      const days = daysUntil(t.closing_date)
      if (days >= 0 && days <= 7) {
        addCandidate({
          type: "closing_date_reminder",
          title: `Closing soon: ${t.title}`,
          body: `Closes ${formatDate(t.closing_date)}`,
          related_tender_id: t.id,
        })
      }
    }

    if (t.briefing_date) {
      const days = daysUntil(t.briefing_date)
      if (days >= 0 && days <= 3) {
        addCandidate({
          type: "briefing_reminder",
          title: `Briefing reminder: ${t.title}`,
          body: `Briefing on ${formatDate(t.briefing_date)}`,
          related_tender_id: t.id,
        })
      }
    }
  }

  for (const task of openTasks) {
    if (!task.due_date || !task.tenders) continue
    const days = daysUntil(task.due_date)
    if (days <= 2) {
      addCandidate({
        type: "task_due",
        title: `Task due: ${task.title}`,
        body: `For ${task.tenders.title}, due ${formatDate(task.due_date)}`,
        related_tender_id: task.tenders.id,
      })
    }
  }

  return candidates
}
