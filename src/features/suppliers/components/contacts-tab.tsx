import { useState, type FormEvent } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddContact, useContacts, useDeleteContact } from "@/features/suppliers/hooks/use-contacts"

export function ContactsTab({ supplierId }: { supplierId: string }) {
  const { data: contacts, isLoading } = useContacts(supplierId)
  const addContact = useAddContact(supplierId)
  const deleteContact = useDeleteContact(supplierId)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    await addContact.mutateAsync({ name, email, phone, role })
    setName("")
    setEmail("")
    setPhone("")
    setRole("")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading contacts…</p>}

      {contacts && contacts.length === 0 && (
        <p className="text-sm text-muted-foreground">No contacts yet — add one below.</p>
      )}

      {contacts && contacts.length > 0 && (
        <ul className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{contact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[contact.role, contact.email, contact.phone].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Delete contact"
                onClick={() => deleteContact.mutate(contact.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-4 border-t border-border pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-new-name">Name</Label>
            <Input id="contact-new-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-new-role">Role</Label>
            <Input id="contact-new-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Sales rep" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-new-email">Email</Label>
            <Input id="contact-new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-new-phone">Phone</Label>
            <Input id="contact-new-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={addContact.isPending || !name.trim()}>
            Add contact
          </Button>
        </div>
      </form>
    </div>
  )
}
