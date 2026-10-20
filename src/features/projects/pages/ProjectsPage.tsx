import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FolderKanban, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NAV_MODULES } from "@/config/navigation"
import type { Project } from "@/features/projects/api/projects"
import { ProjectDialog } from "@/features/projects/components/project-dialog"
import { PROJECT_STATUS_OPTIONS, ProjectStatusBadge } from "@/features/projects/components/project-status-badge"
import { useDeleteProject, useProjects } from "@/features/projects/hooks/use-projects"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/types/database"

type ProjectStatus = Database["public"]["Enums"]["project_status"]

const entry = NAV_MODULES.find((m) => m.id === "projects")!
const ALL_STATUSES = "all"

export function ProjectsPage() {
  const navigate = useNavigate()
  const { data: projects, isLoading, error } = useProjects()
  const deleteProject = useDeleteProject()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProjectStatus | typeof ALL_STATUSES>(ALL_STATUSES)
  const [dialogState, setDialogState] = useState<{ open: boolean; item: Project | null }>({
    open: false,
    item: null,
  })

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (projects ?? []).filter((p) => {
      const matchesStatus = status === ALL_STATUSES || p.status === status
      const matchesSearch = !term || p.name.toLowerCase().includes(term)
      return matchesStatus && matchesSearch
    })
  }, [projects, search, status])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
        </div>
        <Button onClick={() => setDialogState({ open: true, item: null })}>
          <Plus />
          New Project
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading projects…</p>}

      {error && (
        <p className="text-sm text-destructive">Couldn&apos;t load projects: {error.message}</p>
      )}

      {projects && projects.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FolderKanban className="size-6" />
            </div>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription className="max-w-sm">
              Create a project to start tracking delivery once a tender is won.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}

      {projects && projects.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="max-w-xs"
            />
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                {PROJECT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Linked Tender</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Start</th>
                  <th className="px-4 py-2.5">End</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => setDialogState({ open: true, item: project })}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground">{project.name}</td>
                    <td className="px-4 py-2.5">
                      {project.tenders ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate(`/tenders/${project.tenders!.id}`)
                          }}
                          className="text-primary hover:underline"
                        >
                          {project.tenders.title}
                          {project.tenders.client ? ` — ${project.tenders.client}` : ""}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDate(project.start_date)}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDate(project.end_date)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Delete project"
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteProject.mutate(project.id)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ProjectDialog
        item={dialogState.item}
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      />
    </div>
  )
}
