import { useMemo, useState } from "react"
import { Plus, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NAV_MODULES } from "@/config/navigation"
import type { CrmContact } from "@/features/crm/api/crm"
import { CrmContactDialog } from "@/features/crm/components/crm-contact-dialog"
import { useCrmContacts, useDeleteCrmContact } from "@/features/crm/hooks/use-crm"
import { useTenders } from "@/features/tenders/hooks/use-tenders"

const entry = NAV_MODULES.find((m) => m.id === "crm")!

export function CrmPage() {
  const { data: contacts, isLoading, error } = useCrmContacts()
  const { data: tenders } = useTenders()
  const deleteContact = useDeleteCrmContact()

  const [search, setSearch] = useState("")
  const [dialogState, setDialogState] = useState<{ open: boolean; item: CrmContact | null }>({
    open: false,
    item: null,
  })

  const tenderCountByOrg = useMemo(() => {
    const counts = new Map<string, number>()
    for (const t of tenders ?? []) {
      const client = t.client?.trim().toLowerCase()
      if (!client) continue
      counts.set(client, (counts.get(client) ?? 0) + 1)
    }
    return counts
  }, [tenders])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (contacts ?? []).filter((c) => {
      if (!term) return true
      return (
        c.name.toLowerCase().includes(term) ||
        (c.organization ?? "").toLowerCase().includes(term)
      )
    })
  }, [contacts, search])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
        </div>
        <Button onClick={() => setDialogState({ open: true, item: null })}>
          <Plus />
          New Contact
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading contacts…</p>}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load contacts: {error.message}
        </p>
      )}

      {contacts && contacts.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Users className="size-6" />
            </div>
            <CardTitle>No contacts yet</CardTitle>
            <CardDescription className="max-w-sm">
              Add your first client contact to start tracking relationships alongside your
              tender pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}

      {contacts && contacts.length > 0 && (
        <>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or organization…"
            className="max-w-xs"
          />

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Organization</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Phone</th>
                  <th className="px-4 py-2.5">Related Tenders</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => {
                  const orgKey = contact.organization?.trim().toLowerCase()
                  const tenderCount = orgKey ? (tenderCountByOrg.get(orgKey) ?? 0) : null
                  return (
                    <tr
                      key={contact.id}
                      onClick={() => setDialogState({ open: true, item: contact })}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">{contact.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {contact.organization || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{contact.role || "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{contact.email || "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{contact.phone || "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {tenderCount === null ? "—" : tenderCount}
                      </td>
                      <td className="px-4 py-2.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete contact"
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteContact.mutate(contact.id)
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <CrmContactDialog
        item={dialogState.item}
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      />
    </div>
  )
}
