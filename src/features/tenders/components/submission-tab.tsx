import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { useAddSubmission, useSubmissions } from "@/features/tenders/hooks/use-submissions"

export function SubmissionTab({ tenderId }: { tenderId: string }) {
  const { data: submissions, isLoading } = useSubmissions(tenderId)
  const addSubmission = useAddSubmission(tenderId)

  const [method, setMethod] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [submittedAt, setSubmittedAt] = useState("")
  const [notes, setNotes] = useState("")

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addSubmission.mutateAsync({
      method,
      referenceNumber,
      submittedAt: submittedAt ? new Date(submittedAt).toISOString() : undefined,
      notes,
    })
    setMethod("")
    setReferenceNumber("")
    setSubmittedAt("")
    setNotes("")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading submissions…</p>}

      {submissions && submissions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing submitted yet — log the submission once it goes in.
        </p>
      )}

      {submissions && submissions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-medium text-foreground">
                  {submission.method || "Submission"}
                </span>
                {submission.reference_number && (
                  <span className="text-muted-foreground">
                    Ref: {submission.reference_number}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {formatDate(submission.submitted_at)}
                </span>
              </div>
              {submission.notes && (
                <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                  {submission.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-4 border-t border-border pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-method">Method</Label>
            <Input
              id="sub-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              placeholder="Online portal, hand delivery…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-reference">Reference number</Label>
            <Input
              id="sub-reference"
              value={referenceNumber}
              onChange={(event) => setReferenceNumber(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-date">Submitted on</Label>
            <Input
              id="sub-date"
              type="date"
              value={submittedAt}
              onChange={(event) => setSubmittedAt(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sub-notes">Notes</Label>
          <Textarea
            id="sub-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={addSubmission.isPending}>
            {addSubmission.isPending ? "Logging…" : "Log submission"}
          </Button>
        </div>
      </form>
    </div>
  )
}
