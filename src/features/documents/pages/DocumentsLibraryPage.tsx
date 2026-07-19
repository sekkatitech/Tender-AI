import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FolderOpen } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import { DOCUMENT_CATEGORY_LABELS, type DocumentCategory } from "@/config/document-categories"
import { useAllDocuments, useDownloadDocument } from "@/features/documents/hooks/use-documents-library"
import { formatDate } from "@/lib/utils"

const ALL_CATEGORIES = "all"

export function DocumentsLibraryPage() {
  const navigate = useNavigate()
  const { data: documents, isLoading, error } = useAllDocuments()
  const downloadDocument = useDownloadDocument()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<DocumentCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES)

  const filtered = useMemo(() => {
    return (documents ?? []).filter((doc) => {
      const matchesCategory = category === ALL_CATEGORIES || doc.category === category
      const matchesSearch = doc.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [documents, search, category])

  async function handleDownload(doc: { category: DocumentCategory; storage_path: string }) {
    const url = await downloadDocument.mutateAsync({
      category: doc.category,
      storagePath: doc.storage_path,
    })
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Document Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every tender and company document in one place.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading documents…</p>}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load documents: {error.message}
        </p>
      )}

      {documents && documents.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FolderOpen className="size-6" />
            </div>
            <CardTitle>No documents yet</CardTitle>
            <CardDescription className="max-w-sm">
              Documents uploaded to a tender or a supplier&apos;s price lists will
              show up here automatically.
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
            <Select value={category} onValueChange={(value) => setCategory(value as typeof category)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
                  <th className="px-4 py-2.5">Linked to</th>
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
                    <td className="px-4 py-2.5">
                      {doc.tenders ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/tenders/${doc.tenders!.id}`)}
                          className="text-primary hover:underline"
                        >
                          {doc.tenders.title}
                        </button>
                      ) : doc.suppliers ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/suppliers/${doc.suppliers!.id}`)}
                          className="text-primary hover:underline"
                        >
                          {doc.suppliers.name}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{formatDate(doc.created_at)}</td>
                    <td className="px-4 py-2.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        disabled={downloadDocument.isPending}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
