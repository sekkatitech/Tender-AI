import { useState, type FormEvent } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddProduct, useDeleteProduct, useProducts } from "@/features/suppliers/hooks/use-products"

export function ProductsTab({ supplierId }: { supplierId: string }) {
  const { data: products, isLoading } = useProducts(supplierId)
  const addProduct = useAddProduct(supplierId)
  const deleteProduct = useDeleteProduct(supplierId)

  const [sku, setSku] = useState("")
  const [description, setDescription] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [category, setCategory] = useState("")
  const [cost, setCost] = useState("")

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!description.trim()) return
    await addProduct.mutateAsync({
      sku,
      description,
      manufacturer,
      category,
      cost: cost ? Number(cost) : undefined,
    })
    setSku("")
    setDescription("")
    setManufacturer("")
    setCategory("")
    setCost("")
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <p className="text-sm text-muted-foreground">Loading products…</p>}

      {products && products.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No products yet — this is the Product Knowledge Base for this supplier.
        </p>
      )}

      {products && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Manufacturer</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Cost</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-muted-foreground">{product.sku || "—"}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{product.description}</td>
                  <td className="px-3 py-2 text-muted-foreground">{product.manufacturer || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{product.category || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {product.cost != null ? `${product.currency} ${product.cost}` : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete product"
                      onClick={() => deleteProduct.mutate(product.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-col gap-4 border-t border-border pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="product-new-description">Description</Label>
            <Input id="product-new-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A4 copy paper, 80gsm, 500 sheets" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-new-sku">SKU</Label>
            <Input id="product-new-sku" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-new-manufacturer">Manufacturer</Label>
            <Input id="product-new-manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-new-category">Category</Label>
            <Input id="product-new-category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-new-cost">Cost</Label>
            <Input id="product-new-cost" type="number" min={0} step={0.01} value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={addProduct.isPending || !description.trim()}>
            Add product
          </Button>
        </div>
      </form>
    </div>
  )
}
