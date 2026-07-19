import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Supplier, SupplierUpdate } from "@/features/suppliers/api/suppliers"
import { useUpdateSupplier } from "@/features/suppliers/hooks/use-suppliers"

interface FormState {
  name: string
  registration_number: string
  credit_terms: string
  lead_time_days: string
  performance_rating: string
  notes: string
}

function toFormState(supplier: Supplier): FormState {
  return {
    name: supplier.name,
    registration_number: supplier.registration_number ?? "",
    credit_terms: supplier.credit_terms ?? "",
    lead_time_days: supplier.lead_time_days != null ? String(supplier.lead_time_days) : "",
    performance_rating: supplier.performance_rating != null ? String(supplier.performance_rating) : "",
    notes: supplier.notes ?? "",
  }
}

export function OverviewTab({ supplier }: { supplier: Supplier }) {
  const updateSupplier = useUpdateSupplier(supplier.id)
  const [form, setForm] = useState<FormState>(() => toFormState(supplier))
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setForm(toFormState(supplier))
    setIsDirty(false)
  }, [supplier])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  async function handleSave() {
    const patch: SupplierUpdate = {
      name: form.name,
      registration_number: form.registration_number || null,
      credit_terms: form.credit_terms || null,
      lead_time_days: form.lead_time_days ? Number(form.lead_time_days) : null,
      performance_rating: form.performance_rating ? Number(form.performance_rating) : null,
      notes: form.notes || null,
    }
    await updateSupplier.mutateAsync(patch)
    setIsDirty(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Company information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="sup-name">Company name</Label>
            <Input id="sup-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-reg">Registration number</Label>
            <Input id="sup-reg" value={form.registration_number} onChange={(e) => set("registration_number", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-lead-time">Lead time (days)</Label>
            <Input id="sup-lead-time" type="number" min={0} value={form.lead_time_days} onChange={(e) => set("lead_time_days", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-credit">Credit terms</Label>
            <Input id="sup-credit" value={form.credit_terms} onChange={(e) => set("credit_terms", e.target.value)} placeholder="30 days from invoice" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-rating">Performance rating (0–5)</Label>
            <Input id="sup-rating" type="number" min={0} max={5} step={0.1} value={form.performance_rating} onChange={(e) => set("performance_rating", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="sup-notes">Notes</Label>
            <Textarea id="sup-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty || updateSupplier.isPending}>
          {updateSupplier.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
