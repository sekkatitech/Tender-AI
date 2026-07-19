import { useState } from "react"
import { Link as LinkIcon, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers"
import {
  useLinkSupplier,
  useTenderSuppliers,
  useUnlinkSupplier,
} from "@/features/tenders/hooks/use-tender-suppliers"

export function SuppliersTab({ tenderId }: { tenderId: string }) {
  const navigate = useNavigate()
  const { data: links, isLoading } = useTenderSuppliers(tenderId)
  const { data: allSuppliers } = useSuppliers()
  const linkSupplier = useLinkSupplier(tenderId)
  const unlinkSupplier = useUnlinkSupplier(tenderId)

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("")

  const linkedIds = new Set((links ?? []).map((link) => link.supplier_id))
  const availableSuppliers = (allSuppliers ?? []).filter((s) => !linkedIds.has(s.id))

  async function handleLink() {
    if (!selectedSupplierId) return
    await linkSupplier.mutateAsync(selectedSupplierId)
    setSelectedSupplierId("")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading suppliers…</p>}

      {links && links.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No suppliers linked yet — link one below.
        </p>
      )}

      {links && links.length > 0 && (
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <button
                type="button"
                onClick={() => navigate(`/suppliers/${link.supplier_id}`)}
                className="flex-1 text-left text-sm font-medium text-foreground hover:underline"
              >
                {link.suppliers.name}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Unlink supplier"
                onClick={() => unlinkSupplier.mutate(link.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {availableSuppliers.length > 0 ? (
        <div className="flex items-end gap-3 border-t border-border pt-4">
          <div className="flex-1">
            <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier to link" />
              </SelectTrigger>
              <SelectContent>
                {availableSuppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleLink}
            disabled={!selectedSupplierId || linkSupplier.isPending}
          >
            <LinkIcon />
            Link
          </Button>
        </div>
      ) : (
        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          {allSuppliers && allSuppliers.length === 0
            ? "No suppliers exist yet — add one in Supplier Intelligence first."
            : "All your suppliers are already linked to this tender."}
        </p>
      )}
    </div>
  )
}
