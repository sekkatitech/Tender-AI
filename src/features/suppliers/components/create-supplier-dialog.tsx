import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

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
import { useCreateSupplier } from "@/features/suppliers/hooks/use-suppliers"

export function CreateSupplierDialog() {
  const navigate = useNavigate()
  const createSupplier = useCreateSupplier()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [creditTerms, setCreditTerms] = useState("")
  const [leadTimeDays, setLeadTimeDays] = useState("")

  function reset() {
    setName("")
    setRegistrationNumber("")
    setCreditTerms("")
    setLeadTimeDays("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const supplier = await createSupplier.mutateAsync({
      name,
      registrationNumber,
      creditTerms,
      leadTimeDays: leadTimeDays ? Number(leadTimeDays) : undefined,
    })
    reset()
    setOpen(false)
    navigate(`/suppliers/${supplier.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Supplier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New supplier</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-supplier-name">Company name</Label>
              <Input
                id="new-supplier-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Suppliers Ltd"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-supplier-reg">Registration number</Label>
                <Input
                  id="new-supplier-reg"
                  value={registrationNumber}
                  onChange={(event) => setRegistrationNumber(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-supplier-lead-time">Lead time (days)</Label>
                <Input
                  id="new-supplier-lead-time"
                  type="number"
                  min={0}
                  value={leadTimeDays}
                  onChange={(event) => setLeadTimeDays(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-supplier-credit">Credit terms</Label>
              <Input
                id="new-supplier-credit"
                value={creditTerms}
                onChange={(event) => setCreditTerms(event.target.value)}
                placeholder="30 days from invoice"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSupplier.isPending}>
              {createSupplier.isPending ? "Creating…" : "Create supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
