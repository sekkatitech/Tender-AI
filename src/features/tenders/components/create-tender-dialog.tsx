import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateTender } from "@/features/tenders/hooks/use-tenders"
import { Plus } from "lucide-react"

export function CreateTenderDialog() {
  const navigate = useNavigate()
  const createTender = useCreateTender()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [tenderNumber, setTenderNumber] = useState("")
  const [client, setClient] = useState("")
  const [department, setDepartment] = useState("")
  const [closingDate, setClosingDate] = useState("")

  function reset() {
    setTitle("")
    setTenderNumber("")
    setClient("")
    setDepartment("")
    setClosingDate("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const tender = await createTender.mutateAsync({
      title,
      tenderNumber,
      client,
      department,
      closingDate: closingDate ? new Date(closingDate).toISOString() : undefined,
    })
    reset()
    setOpen(false)
    navigate(`/tenders/${tender.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Tender
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New tender</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-tender-title">Title</Label>
              <Input
                id="new-tender-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Supply of office furniture"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-tender-number">Tender number</Label>
                <Input
                  id="new-tender-number"
                  value={tenderNumber}
                  onChange={(event) => setTenderNumber(event.target.value)}
                  placeholder="RFQ-2026-014"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-tender-closing">Closing date</Label>
                <Input
                  id="new-tender-closing"
                  type="date"
                  value={closingDate}
                  onChange={(event) => setClosingDate(event.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-tender-client">Client</Label>
                <Input
                  id="new-tender-client"
                  value={client}
                  onChange={(event) => setClient(event.target.value)}
                  placeholder="City of Cape Town"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-tender-department">Department</Label>
                <Input
                  id="new-tender-department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  placeholder="Supply Chain Management"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTender.isPending}>
              {createTender.isPending ? "Creating…" : "Create tender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
