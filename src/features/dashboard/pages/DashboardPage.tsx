import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Clock, FileText, ListChecks, Trophy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatTile } from "@/components/common/stat-tile"
import { NAV_MODULES } from "@/config/navigation"
import { TENDER_STATUS_OPTIONS, TenderStatusBadge } from "@/features/tenders/components/tender-status-badge"
import { useTenders } from "@/features/tenders/hooks/use-tenders"
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers"
import { useOpenTasks } from "@/features/dashboard/hooks/use-dashboard"
import { formatDate } from "@/lib/utils"

const entry = NAV_MODULES.find((m) => m.id === "dashboard")!

const CLOSED_STATUSES = new Set(["won", "lost", "archived"])
const MS_PER_DAY = 1000 * 60 * 60 * 24

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: tenders, isLoading: tendersLoading, error: tendersError } = useTenders()
  const { data: suppliers } = useSuppliers()
  const { data: openTasks, isLoading: tasksLoading } = useOpenTasks()

  const stats = useMemo(() => {
    const list = tenders ?? []
    const now = Date.now()

    const activeTenders = list.filter(
      (t) => t.status === "discovered" || t.status === "in_progress"
    ).length

    const closingSoon = list.filter((t) => {
      if (!t.closing_date || CLOSED_STATUSES.has(t.status)) return false
      const days = (new Date(t.closing_date).getTime() - now) / MS_PER_DAY
      return days >= 0 && days <= 7
    }).length

    const won = list.filter((t) => t.status === "won").length
    const lost = list.filter((t) => t.status === "lost").length
    const winRate = won + lost > 0 ? `${Math.round((won / (won + lost)) * 100)}%` : "—"

    const statusCounts = TENDER_STATUS_OPTIONS.map(({ value, label }) => ({
      value,
      label,
      count: list.filter((t) => t.status === value).length,
    }))
    const maxCount = Math.max(1, ...statusCounts.map((s) => s.count))

    const upcoming = list
      .filter((t) => t.closing_date && !CLOSED_STATUSES.has(t.status))
      .sort((a, b) => new Date(a.closing_date!).getTime() - new Date(b.closing_date!).getTime())
      .slice(0, 6)

    return { activeTenders, closingSoon, winRate, statusCounts, maxCount, upcoming }
  }, [tenders])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      {tendersError && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load tenders: {tendersError.message}
        </p>
      )}

      {!tendersLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile
            icon={FileText}
            label="Active Tenders"
            value={String(stats.activeTenders)}
            color="blue"
          />
          <StatTile
            icon={Clock}
            label="Closing in 7 Days"
            value={String(stats.closingSoon)}
            color="amber"
          />
          <StatTile icon={Trophy} label="Win Rate" value={stats.winRate} color="emerald" />
          <StatTile
            icon={Building2}
            label="Suppliers"
            value={String(suppliers?.length ?? 0)}
            color="violet"
          />
          <StatTile
            icon={ListChecks}
            label="Open Tasks"
            value={tasksLoading ? "…" : String(openTasks?.length ?? 0)}
            color="rose"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Status</CardTitle>
            <CardDescription>How your tenders are distributed right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {stats.statusCounts.map((s) => (
              <div key={s.value} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-foreground">{s.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.count / stats.maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm text-muted-foreground">
                  {s.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Closing Soon</CardTitle>
            <CardDescription>Upcoming closing dates across your pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming closing dates.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stats.upcoming.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/tenders/${t.id}`)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.client || "—"}
                        </p>
                      </div>
                      <TenderStatusBadge status={t.status} />
                      <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                        {formatDate(t.closing_date)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Tasks</CardTitle>
          <CardDescription>Outstanding tasks across every tender.</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading && <p className="text-sm text-muted-foreground">Loading tasks…</p>}
          {!tasksLoading && (openTasks?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">No open tasks — you&apos;re all caught up.</p>
          )}
          {!tasksLoading && openTasks && openTasks.length > 0 && (
            <ul className="flex flex-col gap-2">
              {openTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                    {task.tenders && (
                      <button
                        type="button"
                        onClick={() => navigate(`/tenders/${task.tenders!.id}`)}
                        className="truncate text-xs text-primary hover:underline"
                      >
                        {task.tenders.title}
                      </button>
                    )}
                  </div>
                  {task.due_date && (
                    <Badge variant="secondary">Due {formatDate(task.due_date)}</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
