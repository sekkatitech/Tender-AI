import { useRef, useState, type ChangeEvent } from "react"
import { Download, Trash2, Upload } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  TENDER_DOCUMENT_CATEGORIES,
  type DocumentCategory,
} from "@/config/document-categories"
import {
  useDeleteTenderDocument,
  useDownloadTenderDocument,
  useTenderDocuments,
  useUploadTenderDocument,
} from "@/features/tenders/hooks/use-documents"
import { formatDate } from "@/lib/utils"

export function DocumentsTab({ tenderId }: { tenderId: string }) {
  const { data: documents, isLoading } = useTenderDocuments(tenderId)
  const uploadDocument = useUploadTenderDocument(tenderId)
  const deleteDocument = useDeleteTenderDocument(tenderId)
  const downloadDocument = useDownloadTenderDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState<DocumentCategory>("tender_mandatory")
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setError(null)
    try {
      await uploadDocument.mutateAsync({ file, category })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    }
  }

  async function handleDownload(storagePath: string) {
    const url = await downloadDocument.mutateAsync(storagePath)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading documents…</p>}

      {documents && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No documents yet — upload the tender PDF and any mandatory documents below.
        </p>
      )}

      {documents && documents.length > 0 && (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(doc.created_at)}</p>
              </div>
              <Badge variant="secondary">{DOCUMENT_CATEGORY_LABELS[doc.category]}</Badge>
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
                onClick={() => deleteDocument.mutate({ id: doc.id, storagePath: doc.storage_path })}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-end gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TENDER_DOCUMENT_CATEGORIES.map((value) => (
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
