import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactsTab } from "@/features/suppliers/components/contacts-tab"
import { OverviewTab } from "@/features/suppliers/components/overview-tab"
import { PriceListsTab } from "@/features/suppliers/components/price-lists-tab"
import { ProductsTab } from "@/features/suppliers/components/products-tab"
import { useDeleteSupplier, useSupplier } from "@/features/suppliers/hooks/use-suppliers"

export function SupplierWorkspacePage() {
  const { supplierId } = useParams<{ supplierId: string }>()
  const navigate = useNavigate()
  const { data: supplier, isLoading, error } = useSupplier(supplierId)
  const deleteSupplier = useDeleteSupplier()

  async function handleDelete() {
    if (!supplier) return
    if (!window.confirm(`Delete "${supplier.name}"? This can't be undone.`)) return
    await deleteSupplier.mutateAsync(supplier.id)
    navigate("/suppliers")
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-muted-foreground">Loading supplier…</p>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-destructive">
          Couldn&apos;t load this supplier{error ? `: ${error.message}` : "."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-2" onClick={() => navigate("/suppliers")}>
          <ArrowLeft />
          Back to suppliers
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {supplier.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {supplier.registration_number || "No registration number on file"}
            </p>
          </div>

          <Button variant="outline" onClick={handleDelete} disabled={deleteSupplier.isPending}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="price-lists">Price Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab supplier={supplier} />
        </TabsContent>
        <TabsContent value="contacts">
          <ContactsTab supplierId={supplier.id} />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab supplierId={supplier.id} />
        </TabsContent>
        <TabsContent value="price-lists">
          <PriceListsTab supplierId={supplier.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
