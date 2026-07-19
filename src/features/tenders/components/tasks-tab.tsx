import { useState, type FormEvent } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/utils"
import {
  useAddTask,
  useDeleteTask,
  useSetTaskStatus,
  useTasks,
} from "@/features/tenders/hooks/use-tasks"

export function TasksTab({ tenderId }: { tenderId: string }) {
  const { data: tasks, isLoading } = useTasks(tenderId)
  const addTask = useAddTask(tenderId)
  const setStatus = useSetTaskStatus(tenderId)
  const deleteTask = useDeleteTask(tenderId)

  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    await addTask.mutateAsync({ title, dueDate })
    setTitle("")
    setDueDate("")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading tasks…</p>}

      {tasks && tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No tasks yet — add one below.</p>
      )}

      {tasks && tasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => {
            const isDone = task.status === "done"
            return (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
              >
                <Checkbox
                  checked={isDone}
                  onCheckedChange={(checked) =>
                    setStatus.mutate({ id: task.id, status: checked === true ? "done" : "pending" })
                  }
                />
                <span
                  className={
                    isDone
                      ? "flex-1 text-sm text-muted-foreground line-through"
                      : "flex-1 text-sm text-foreground"
                  }
                >
                  {task.title}
                </span>
                {task.due_date && (
                  <span className="text-xs text-muted-foreground">
                    Due {formatDate(task.due_date)}
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete task"
                  onClick={() => deleteTask.mutate(task.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex items-end gap-3 border-t border-border pt-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="task-new-title">Add task</Label>
          <Input
            id="task-new-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Request updated BBBEE certificate"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-new-due">Due date</Label>
          <Input
            id="task-new-due"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={addTask.isPending || !title.trim()}>
          Add
        </Button>
      </form>
    </div>
  )
}
