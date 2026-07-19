import { useState, type FormEvent } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useAddChecklistItem,
  useChecklistItems,
  useDeleteChecklistItem,
  useToggleChecklistItem,
} from "@/features/tenders/hooks/use-checklist"

export function ChecklistTab({ tenderId }: { tenderId: string }) {
  const { data: items, isLoading } = useChecklistItems(tenderId)
  const addItem = useAddChecklistItem(tenderId)
  const toggleItem = useToggleChecklistItem(tenderId)
  const deleteItem = useDeleteChecklistItem(tenderId)

  const [label, setLabel] = useState("")
  const [isMandatory, setIsMandatory] = useState(true)

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!label.trim()) return
    await addItem.mutateAsync({ label, isMandatory })
    setLabel("")
    setIsMandatory(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading checklist…</p>}

      {items && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No checklist items yet — add the mandatory documents and requirements below.
        </p>
      )}

      {items && items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <Checkbox
                checked={item.is_complete}
                onCheckedChange={(checked) =>
                  toggleItem.mutate({ id: item.id, isComplete: checked === true })
                }
              />
              <span
                className={
                  item.is_complete
                    ? "flex-1 text-sm text-muted-foreground line-through"
                    : "flex-1 text-sm text-foreground"
                }
              >
                {item.label}
              </span>
              {item.is_mandatory && (
                <span className="text-xs font-medium text-muted-foreground">Mandatory</span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Delete item"
                onClick={() => deleteItem.mutate(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex items-end gap-3 border-t border-border pt-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="checklist-new-item">Add item</Label>
          <Input
            id="checklist-new-item"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Tax clearance certificate"
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <Checkbox
            id="checklist-mandatory"
            checked={isMandatory}
            onCheckedChange={(checked) => setIsMandatory(checked === true)}
          />
          <Label htmlFor="checklist-mandatory" className="font-normal">
            Mandatory
          </Label>
        </div>
        <Button type="submit" disabled={addItem.isPending || !label.trim()}>
          Add
        </Button>
      </form>
    </div>
  )
}
