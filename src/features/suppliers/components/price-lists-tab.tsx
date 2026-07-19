import { useRef, useState, type ChangeEvent } from "react"
import { Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import {
  useDownloadPriceList,
  usePriceLists,
  useUploadPriceList,
} from "@/features/suppliers/hooks/use-price-lists"

export function PriceListsTab({ supplierId }: { supplierId: string }) {
  const { data: priceLists, isLoading } = usePriceLists(supplierId)
  const uploadPriceList = useUploadPriceList(supplierId)
  const downloadPriceList = useDownloadPriceList()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setError(null)
    try {
      await uploadPriceList.mutateAsync(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    }
  }

  async function handleDownload(storagePath: string) {
    const url = await downloadPriceList.mutateAsync(storagePath)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Every upload is kept as a new version — previous price lists are never overwritten.
      </p>

      {isLoading && <p className="text-sm text-muted-foreground">Loading price lists…</p>}

      {priceLists && priceLists.length === 0 && (
        <p className="text-sm text-muted-foreground">No price lists uploaded yet.</p>
      )}

      {priceLists && priceLists.length > 0 && (
        <ul className="flex flex-col gap-2">
          {priceLists.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  Version {doc.version} · {formatDate(doc.created_at)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDownload(doc.storage_path)}
                disabled={downloadPriceList.isPending}
              >
                <Download />
                Download
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="border-t border-border pt-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadPriceList.isPending}
        >
          <Upload />
          {uploadPriceList.isPending ? "Uploading…" : "Upload price list"}
        </Button>
      </div>
    </div>
  )
}
