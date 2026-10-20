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
import { Textarea } from "@/components/ui/textarea"
import type { CrmContact } from "@/features/crm/api/crm"
import { useCreateCrmContact, useUpdateCrmContact } from "@/features/crm/hooks/use-crm"

interface FormState {
  name: string
  organization: string
  role: string
  email: string
  phone: string
  notes: string
}

const EMPTY_FORM: FormState = {
  name: "",
  organization: "",
  role: "",
  email: "",
  phone: "",
  notes: "",
}

function toFormState(contact: CrmContact): FormState {
  return {
    name: contact.name,
    organization: contact.organization ?? "",
    role: contact.role ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    notes: contact.notes ?? "",
  }
}

interface CrmContactDialogProps {
  item: CrmContact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CrmContactDialog({ item, open, onOpenChange }: CrmContactDialogProps) {
  const createContact = useCreateCrmContact()
  const updateContact = useUpdateCrmContact()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (open) {
      setForm(item ? toFormState(item) : EMPTY_FORM)
    }
  }, [open, item])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (item) {
      await updateContact.mutateAsync({ id: item.id, input: form })
    } else {
      await createContact.mutateAsync(form)
    }
    onOpenChange(false)
  }

  const isPending = createContact.isPending || updateContact.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? "Edit contact" : "New contact"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="crm-name">Name</Label>
              <Input
                id="crm-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Thandiwe Nkosi"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="crm-organization">Organization</Label>
                <Input
                  id="crm-organization"
                  value={form.organization}
                  onChange={(e) => set("organization", e.target.value)}
                  placeholder="City of Cape Town"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="crm-role">Role</Label>
                <Input
                  id="crm-role"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="Procurement Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="crm-email">Email</Label>
                <Input
                  id="crm-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="crm-phone">Phone</Label>
                <Input
                  id="crm-phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="crm-notes">Notes</Label>
              <Textarea
                id="crm-notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.name.trim()}>
              {isPending ? "Saving…" : item ? "Save changes" : "Create contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
