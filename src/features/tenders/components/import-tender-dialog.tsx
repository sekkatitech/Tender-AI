import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { FileUp, Link2, Loader2, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ImportSource, TenderExtraction } from "@/features/tenders/api/ai-import"
import { useExtractTender, useSaveImportedTender } from "@/features/tenders/hooks/use-tenders"

type TextField =
  | "title"
  | "tender_number"
  | "client"
  | "department"
  | "submission_method"
  | "evaluation_method"
  | "preference_points"
  | "warranty_requirements"

const TEXT_FIELDS: { key: TextField; label: string; long?: boolean }[] = [
  { key: "title", label: "Title" },
  { key: "tender_number", label: "Tender number" },
  { key: "client", label: "Client" },
  { key: "department", label: "Department" },
  { key: "submission_method", label: "Submission method", long: true },
  { key: "evaluation_method", label: "Evaluation method", long: true },
  { key: "preference_points", label: "Preference points" },
  { key: "warranty_requirements", label: "Warranty requirements", long: true },
]

const SEVERITY_VARIANT = { low: "secondary", medium: "outline", high: "destructive" } as const

/** ISO timestamp ↔ the value a datetime-local input wants, in local time. */
function toLocalInput(iso: string | null) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function fromLocalInput(value: string) {
  return value ? new Date(value).toISOString() : null
}

/** "p. 12", linked to that page of the PDF so the reader can check the AI's work. */
function PageRef({ page, pdfUrl }: { page: number | null | undefined; pdfUrl: string | null }) {
  if (!page) return null
  if (!pdfUrl) return <span className="text-xs font-normal text-muted-foreground">p. {page}</span>
  return (
    <a
      href={`${pdfUrl}#page=${page}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open page ${page} of the tender`}
      className="text-xs font-normal text-primary underline-offset-2 hover:underline"
    >
      p. {page}
    </a>
  )
}

export function ImportTenderDialog() {
  const navigate = useNavigate()
  const extract = useExtractTender()
  const save = useSaveImportedTender()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"file" | "link">("file")
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState("")
  const [source, setSource] = useState<ImportSource | null>(null)
  const [draft, setDraft] = useState<TenderExtraction | null>(null)
  // The uploaded file as a local blob URL, or the pasted link, for PageRef.
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  function reset() {
    setFile(null)
    setLink("")
    setSource(null)
    setDraft(null)
    if (pdfUrl?.startsWith("blob:")) URL.revokeObjectURL(pdfUrl)
    setPdfUrl(null)
    extract.reset()
    save.reset()
  }

  function pageFor(field: string) {
    return draft?.sources.find((s) => s.field === field)?.page
  }

  function update<K extends keyof TenderExtraction>(key: K, value: TenderExtraction[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  async function handleRead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = mode === "file" && file ? { file } : { link: link.trim() }
    const result = await extract.mutateAsync(input)
    setSource(result.source)
    setDraft(result.extraction)
    setPdfUrl(mode === "file" && file ? URL.createObjectURL(file) : link.trim() || null)
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || !source) return
    const tender = await save.mutateAsync({ extraction: draft, source })
    setOpen(false)
    reset()
    navigate(`/tenders/${tender.id}`)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (extract.isPending || save.isPending) return
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles />
          Import with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {!draft ? (
          <form onSubmit={handleRead}>
            <DialogHeader>
              <DialogTitle>Import a tender with AI</DialogTitle>
              <DialogDescription>
                Upload the tender PDF or paste the e-tender link. TenderPilot reads it and fills
                in the tender for you to check, with the page each detail came from.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={mode === "file" ? "secondary" : "ghost"}
                onClick={() => setMode("file")}
              >
                <FileUp />
                Upload PDF
              </Button>
              <Button
                type="button"
                variant={mode === "link" ? "secondary" : "ghost"}
                onClick={() => setMode("link")}
              >
                <Link2 />
                Paste link
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              {mode === "file" ? (
                <>
                  <Label htmlFor="import-file">Tender document (PDF)</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    required
                  />
                </>
              ) : (
                <>
                  <Label htmlFor="import-link">Tender link</Label>
                  <Input
                    id="import-link"
                    type="url"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="https://www.etenders.gov.za/…/tender.pdf"
                    required
                  />
                </>
              )}
            </div>

            {extract.isError && (
              <p className="mt-3 text-sm text-destructive">{extract.error.message}</p>
            )}

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={extract.isPending}>
                {extract.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Reading the tender…
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Read tender
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Check the details</DialogTitle>
              <DialogDescription>{draft.summary}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map(({ key, label, long }) => (
                <div key={key} className={`flex flex-col gap-1.5 ${long ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor={`import-${key}`} className="justify-between">
                    {label}
                    <PageRef page={pageFor(key)} pdfUrl={pdfUrl} />
                  </Label>
                  {long ? (
                    <Textarea
                      id={`import-${key}`}
                      value={draft[key] ?? ""}
                      onChange={(event) => update(key, event.target.value || null)}
                    />
                  ) : (
                    <Input
                      id={`import-${key}`}
                      value={draft[key] ?? ""}
                      onChange={(event) =>
                        update(key, key === "title" ? event.target.value : event.target.value || null)
                      }
                      required={key === "title"}
                    />
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="import-closing" className="justify-between">
                  Closing date
                  <PageRef page={pageFor("closing_date")} pdfUrl={pdfUrl} />
                </Label>
                <Input
                  id="import-closing"
                  type="datetime-local"
                  value={toLocalInput(draft.closing_date)}
                  onChange={(event) => update("closing_date", fromLocalInput(event.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="import-briefing" className="justify-between">
                  Briefing
                  <PageRef page={pageFor("briefing_date")} pdfUrl={pdfUrl} />
                </Label>
                <Input
                  id="import-briefing"
                  type="datetime-local"
                  value={toLocalInput(draft.briefing_date)}
                  onChange={(event) => update("briefing_date", fromLocalInput(event.target.value))}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.is_briefing_compulsory}
                    onChange={(event) => update("is_briefing_compulsory", event.target.checked)}
                  />
                  Compulsory briefing
                </label>
              </div>
            </div>

            {draft.risks.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-medium">Risks spotted</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {draft.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Badge variant={SEVERITY_VARIANT[risk.severity]} className="capitalize">
                        {risk.severity}
                      </Badge>
                      <span className="flex-1">{risk.risk}</span>
                      <PageRef page={risk.page} pdfUrl={pdfUrl} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {draft.returnable_documents.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-medium">
                  Returnable documents ({draft.returnable_documents.length}) — added to the checklist
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {draft.returnable_documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-1">{doc.label}</span>
                      {doc.is_mandatory && <Badge variant="outline">Mandatory</Badge>}
                      <PageRef page={doc.page} pdfUrl={pdfUrl} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {save.isError && <p className="mt-3 text-sm text-destructive">{save.error.message}</p>}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={reset} disabled={save.isPending}>
                Start over
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Creating…" : "Create tender"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
