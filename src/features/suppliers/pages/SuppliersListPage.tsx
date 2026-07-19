import { useNavigate } from "react-router-dom"
import { Building2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateSupplierDialog } from "@/features/suppliers/components/create-supplier-dialog"
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers"

export function SuppliersListPage() {
  const navigate = useNavigate()
  const { data: suppliers, isLoading, error } = useSuppliers()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Supplier Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Supplier profiles, price lists, and performance history.
          </p>
        </div>
        <CreateSupplierDialog />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading suppliers…</p>}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load suppliers: {error.message}
        </p>
      )}

      {suppliers && suppliers.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Building2 className="size-6" />
            </div>
            <CardTitle>No suppliers yet</CardTitle>
            <CardDescription className="max-w-sm">
              Add your first supplier to start tracking contacts, price lists,
              and products.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}

      {suppliers && suppliers.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Registration #</th>
                <th className="px-4 py-2.5">Credit terms</th>
                <th className="px-4 py-2.5">Lead time</th>
                <th className="px-4 py-2.5">Performance</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  onClick={() => navigate(`/suppliers/${supplier.id}`)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {supplier.name}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {supplier.registration_number || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {supplier.credit_terms || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {supplier.lead_time_days != null ? `${supplier.lead_time_days} days` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {supplier.performance_rating != null ? `${supplier.performance_rating} / 5` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
