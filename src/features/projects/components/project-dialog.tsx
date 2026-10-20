import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PROJECT_STATUS_OPTIONS } from "@/features/projects/components/project-status-badge"
import type { Project } from "@/features/projects/api/projects"
import { useCreateProject, useUpdateProject } from "@/features/projects/hooks/use-projects"
import { useTenders } from "@/features/tenders/hooks/use-tenders"
import type { Database } from "@/types/database"

type ProjectStatus = Database["public"]["Enums"]["project_status"]

const NO_TENDER = "none"

interface FormState {
  name: string
  tenderId: string
  status: ProjectStatus
  startDate: string
  endDate: string
  notes: string
}

const EMPTY_FORM: FormState = {
  name: "",
  tenderId: NO_TENDER,
  status: "active",
  startDate: "",
  endDate: "",
  notes: "",
}

function toFormState(project: Project): FormState {
  return {
    name: project.name,
    tenderId: project.tender_id ?? NO_TENDER,
    status: project.status,
    startDate: project.start_date ?? "",
    endDate: project.end_date ?? "",
    notes: project.notes ?? "",
  }
}

interface ProjectDialogProps {
  item: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDialog({ item, open, onOpenChange }: ProjectDialogProps) {
  const { data: tenders } = useTenders()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (open) {
      setForm(item ? toFormState(item) : EMPTY_FORM)
    }
  }, [open, item])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTenderChange(tenderId: string) {
    set("tenderId", tenderId)
    if (!item && !form.name.trim() && tenderId !== NO_TENDER) {
      const tender = tenders?.find((t) => t.id === tenderId)
      if (tender) set("name", tender.title)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = {
      name: form.name,
      tenderId: form.tenderId === NO_TENDER ? null : form.tenderId,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      notes: form.notes,
    }
    if (item) {
      await updateProject.mutateAsync({ id: item.id, input })
    } else {
      await createProject.mutateAsync(input)
    }
    onOpenChange(false)
  }

  const isPending = createProject.isPending || updateProject.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Office furniture rollout"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Linked tender</Label>
                <Select value={form.tenderId} onValueChange={handleTenderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_TENDER}>None</SelectItem>
                    {(tenders ?? []).map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                        {t.client ? ` — ${t.client}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => set("status", value as ProjectStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="project-start">Start date</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="project-end">End date</Label>
                <Input
                  id="project-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="project-notes">Notes</Label>
              <Textarea
                id="project-notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.name.trim()}>
              {isPending ? "Saving…" : item ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
