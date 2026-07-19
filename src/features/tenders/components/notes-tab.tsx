import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { useAddNote, useNotes } from "@/features/tenders/hooks/use-notes"

export function NotesTab({ tenderId }: { tenderId: string }) {
  const { data: notes, isLoading } = useNotes(tenderId)
  const addNote = useAddNote(tenderId)

  const [body, setBody] = useState("")

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!body.trim()) return
    await addNote.mutateAsync(body)
    setBody("")
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a note for the team…"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={addNote.isPending || !body.trim()}>
            {addNote.isPending ? "Adding…" : "Add note"}
          </Button>
        </div>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading notes…</p>}

      {notes && notes.length === 0 && (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      )}

      {notes && notes.length > 0 && (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md border border-border p-3">
              <p className="text-sm whitespace-pre-wrap text-foreground">{note.body}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatDate(note.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
