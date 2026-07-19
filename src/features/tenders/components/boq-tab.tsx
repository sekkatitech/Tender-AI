import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BoqLineDialog } from "@/features/tenders/components/boq-line-dialog"
import { useBoqItems, useDeleteBoqItem } from "@/features/tenders/hooks/use-boq"
import type { BoqItem } from "@/features/tenders/api/boq"

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function BoqTab({ tenderId }: { tenderId: string }) {
  const { data: items, isLoading } = useBoqItems(tenderId)
  const deleteItem = useDeleteBoqItem(tenderId)

  const [dialogState, setDialogState] = useState<{ open: boolean; item: BoqItem | null }>({
    open: false,
    item: null,
  })

  const total = (items ?? []).reduce((sum, item) => sum + item.selling_price, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setDialogState({ open: true, item: null })}>
          <Plus />
          Add line
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading BOQ…</p>}

      {items && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No line items yet — add the products and services this tender needs.
        </p>
      )}

      {items && items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2 text-right">Selling price</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setDialogState({ open: true, item })}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-3 py-2 font-medium text-foreground">{item.description}</td>
                  <td className="px-3 py-2 text-muted-foreground">{item.quantity}</td>
                  <td className="px-3 py-2 text-muted-foreground">{item.unit || "—"}</td>
                  <td className="px-3 py-2 text-right font-medium text-foreground">
                    {currency(item.selling_price)}
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete line"
                      onClick={(event) => {
                        event.stopPropagation()
                        deleteItem.mutate(item.id)
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/40">
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-foreground">
                  Total
                </td>
                <td className="px-3 py-2 text-right text-sm font-semibold text-foreground">
                  {currency(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <BoqLineDialog
        tenderId={tenderId}
        item={dialogState.item}
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      />
    </div>
  )
}
