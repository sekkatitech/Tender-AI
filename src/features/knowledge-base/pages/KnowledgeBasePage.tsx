import { useMemo, useRef, useState, type ChangeEvent } from "react"
import { BookOpen, Download, Trash2, Upload } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DOCUMENT_CATEGORY_LABELS,
  KNOWLEDGE_BASE_DOCUMENT_CATEGORIES,
  type DocumentCategory,
} from "@/config/document-categories"
import { NAV_MODULES } from "@/config/navigation"
import {
  useDeleteKnowledgeBaseDocument,
  useDownloadKnowledgeBaseDocument,
  useKnowledgeBaseDocuments,
  useUploadKnowledgeBaseDocument,
} from "@/features/knowledge-base/hooks/use-knowledge-base"
import { formatDate } from "@/lib/utils"

const ALL_CATEGORIES = "all"
type CategoryFilter = DocumentCategory | typeof ALL_CATEGORIES

const entry = NAV_MODULES.find((m) => m.id === "knowledge-base")!

export function KnowledgeBasePage() {
  const { data: documents, isLoading, error } = useKnowledgeBaseDocuments()
  const uploadDocument = useUploadKnowledgeBaseDocument()
  const deleteDocument = useDeleteKnowledgeBaseDocument()
  const downloadDocument = useDownloadKnowledgeBaseDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CategoryFilter>(ALL_CATEGORIES)
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>(
    KNOWLEDGE_BASE_DOCUMENT_CATEGORIES[0]!
  )
  const [uploadError, setUploadError] = useState<string | null>(null)

  const countByCategory = useMemo(() => {
    const counts = new Map<DocumentCategory, number>()
    for (const doc of documents ?? []) {
      counts.set(doc.category, (counts.get(doc.category) ?? 0) + 1)
    }
    return counts
  }, [documents])

  const filtered = useMemo(() => {
    return (documents ?? []).filter((doc) => {
      const matchesCategory = category === ALL_CATEGORIES || doc.category === category
      const matchesSearch = doc.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [documents, search, category])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setUploadError(null)
    try {
      await uploadDocument.mutateAsync({ file, category: uploadCategory })
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    }
  }

  async function handleDownload(storagePath: string) {
    const url = await downloadDocument.mutateAsync(storagePath)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading knowledge base…</p>}

      {error && (
        <p className="text-sm text-destructive">Couldn&apos;t load documents: {error.message}</p>
      )}

      {documents && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {KNOWLEDGE_BASE_DOCUMENT_CATEGORIES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-lg border p-3 text-left transition-colors hover:border-primary/50 ${
                category === value ? "border-primary bg-accent" : "border-border"
              }`}
            >
              <p className="text-sm font-medium text-foreground">
                {DOCUMENT_CATEGORY_LABELS[value]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {countByCategory.get(value) ?? 0} document
                {(countByCategory.get(value) ?? 0) === 1 ? "" : "s"}
              </p>
            </button>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BookOpen className="size-6" />
            </div>
            <CardTitle>No knowledge base documents yet</CardTitle>
            <CardDescription className="max-w-sm">
              Upload your company profile, proposal templates, past winning tenders, and other
              reusable documents below — they&apos;ll show up here.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}

      {documents && documents.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="max-w-xs"
            />
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryFilter)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {KNOWLEDGE_BASE_DOCUMENT_CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {DOCUMENT_CATEGORY_LABELS[value]}
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
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Uploaded</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium text-foreground">{doc.name}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="secondary">{DOCUMENT_CATEGORY_LABELS[doc.category]}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc.storage_path)}
                          disabled={downloadDocument.isPending}
                        >
                          <Download />
                          Download
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete document"
                          onClick={() =>
                            deleteDocument.mutate({ id: doc.id, storagePath: doc.storage_path })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      <div className="flex items-end gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select
            value={uploadCategory}
            onValueChange={(value) => setUploadCategory(value as DocumentCategory)}
          >
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KNOWLEDGE_BASE_DOCUMENT_CATEGORIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {DOCUMENT_CATEGORY_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadDocument.isPending}
        >
          <Upload />
          {uploadDocument.isPending ? "Uploading…" : "Upload document"}
        </Button>
      </div>
    </div>
  )
}
