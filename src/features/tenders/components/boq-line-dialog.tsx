import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BoqItem } from "@/features/tenders/api/boq"
import { useAddBoqItem, useCompanyProducts, useUpdateBoqItem } from "@/features/tenders/hooks/use-boq"
import { calculateBoqLine } from "@/features/tenders/lib/boq-calculations"

const NO_PRODUCT = "none"

interface FormState {
  description: string
  unit: string
  quantity: string
  product_id: string
  supplier_cost: string
  freight: string
  insurance: string
  import_costs: string
  labour: string
  travel: string
  accommodation: string
  support: string
  warranty: string
  overheads: string
  risk: string
  contingency: string
  markup_percent: string
  vat_percent: string
}

const EMPTY_FORM: FormState = {
  description: "",
  unit: "",
  quantity: "1",
  product_id: NO_PRODUCT,
  supplier_cost: "0",
  freight: "0",
  insurance: "0",
  import_costs: "0",
  labour: "0",
  travel: "0",
  accommodation: "0",
  support: "0",
  warranty: "0",
  overheads: "0",
  risk: "0",
  contingency: "0",
  markup_percent: "0",
  vat_percent: "15",
}

function toFormState(item: BoqItem): FormState {
  return {
    description: item.description,
    unit: item.unit ?? "",
    quantity: String(item.quantity),
    product_id: item.product_id ?? NO_PRODUCT,
    supplier_cost: String(item.supplier_cost),
    freight: String(item.freight),
    insurance: String(item.insurance),
    import_costs: String(item.import_costs),
    labour: String(item.labour),
    travel: String(item.travel),
    accommodation: String(item.accommodation),
    support: String(item.support),
    warranty: String(item.warranty),
    overheads: String(item.overheads),
    risk: String(item.risk),
    contingency: String(item.contingency),
    markup_percent: String(item.markup_percent),
    vat_percent: String(item.vat_percent),
  }
}

const COST_FIELDS: { key: keyof FormState; label: string }[] = [
  { key: "supplier_cost", label: "Supplier cost" },
  { key: "freight", label: "Freight" },
  { key: "insurance", label: "Insurance" },
  { key: "import_costs", label: "Import costs" },
  { key: "labour", label: "Labour" },
  { key: "travel", label: "Travel" },
  { key: "accommodation", label: "Accommodation" },
  { key: "support", label: "Support" },
  { key: "warranty", label: "Warranty" },
  { key: "overheads", label: "Overheads (incl. commission)" },
  { key: "risk", label: "Risk" },
  { key: "contingency", label: "Contingency" },
]

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface BoqLineDialogProps {
  tenderId: string
  item: BoqItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BoqLineDialog({ tenderId, item, open, onOpenChange }: BoqLineDialogProps) {
  const { data: products } = useCompanyProducts()
  const addItem = useAddBoqItem(tenderId)
  const updateItem = useUpdateBoqItem(tenderId)

  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (open) {
      setForm(item ? toFormState(item) : EMPTY_FORM)
    }
  }, [open, item])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleProductChange(productId: string) {
    set("product_id", productId)
    const product = products?.find((p) => p.id === productId)
    if (product?.cost != null) {
      set("supplier_cost", String(product.cost))
    }
  }

  const numericInputs = {
    quantity: Number(form.quantity) || 0,
    supplier_cost: Number(form.supplier_cost) || 0,
    freight: Number(form.freight) || 0,
    insurance: Number(form.insurance) || 0,
    import_costs: Number(form.import_costs) || 0,
    labour: Number(form.labour) || 0,
    travel: Number(form.travel) || 0,
    accommodation: Number(form.accommodation) || 0,
    support: Number(form.support) || 0,
    warranty: Number(form.warranty) || 0,
    overheads: Number(form.overheads) || 0,
    risk: Number(form.risk) || 0,
    contingency: Number(form.contingency) || 0,
    markup_percent: Number(form.markup_percent) || 0,
    vat_percent: Number(form.vat_percent) || 0,
  }
  const preview = calculateBoqLine(numericInputs)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = {
      ...numericInputs,
      description: form.description,
      unit: form.unit,
      product_id: form.product_id === NO_PRODUCT ? null : form.product_id,
    }
    if (item) {
      await updateItem.mutateAsync({ id: item.id, input })
    } else {
      await addItem.mutateAsync(input)
    }
    onOpenChange(false)
  }

  const isPending = addItem.isPending || updateItem.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? "Edit BOQ line" : "Add BOQ line"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Item
              </p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="boq-description">Description</Label>
                <Input
                  id="boq-description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="A4 copy paper, 80gsm, 500 sheets"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Product (optional)</Label>
                  <Select value={form.product_id} onValueChange={handleProductChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_PRODUCT}>None</SelectItem>
                      {(products ?? []).map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.sku ? `${product.sku} — ` : ""}
                          {product.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boq-quantity">Quantity</Label>
                  <Input
                    id="boq-quantity"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.quantity}
                    onChange={(e) => set("quantity", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boq-unit">Unit</Label>
                  <Input
                    id="boq-unit"
                    value={form.unit}
                    onChange={(e) => set("unit", e.target.value)}
                    placeholder="each, box, m²…"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Costs (per unit)
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {COST_FIELDS.map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <Label htmlFor={`boq-${field.key}`}>{field.label}</Label>
                    <Input
                      id={`boq-${field.key}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={form[field.key]}
                      onChange={(e) => set(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Pricing
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boq-markup">Markup %</Label>
                  <Input
                    id="boq-markup"
                    type="number"
                    min={0}
                    step={0.1}
                    value={form.markup_percent}
                    onChange={(e) => set("markup_percent", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="boq-vat">VAT %</Label>
                  <Input
                    id="boq-vat"
                    type="number"
                    min={0}
                    step={0.1}
                    value={form.vat_percent}
                    onChange={(e) => set("vat_percent", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-md bg-muted/50 p-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total cost</p>
                  <p className="font-medium text-foreground">{currency(preview.totalCost)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gross profit</p>
                  <p className="font-medium text-foreground">{currency(preview.grossProfit)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">VAT</p>
                  <p className="font-medium text-foreground">{currency(preview.vatAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Selling price</p>
                  <p className="font-semibold text-foreground">{currency(preview.sellingPrice)}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.description.trim()}>
              {isPending ? "Saving…" : item ? "Save changes" : "Add line"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
