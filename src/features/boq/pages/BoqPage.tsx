import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Boxes, ListChecks, PackageSearch, Layers } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatTile } from "@/components/common/stat-tile"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NAV_MODULES } from "@/config/navigation"
import { useBoqItemsWithTenders } from "@/features/reports/hooks/use-reports"

const entry = NAV_MODULES.find((m) => m.id === "boq")!
const ALL_TENDERS = "all"

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function BoqPage() {
  const navigate = useNavigate()
  const { data: items, isLoading, error } = useBoqItemsWithTenders()

  const [search, setSearch] = useState("")
  const [tenderFilter, setTenderFilter] = useState(ALL_TENDERS)

  const tenderOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of items ?? []) {
      if (item.tenders) map.set(item.tenders.id, item.tenders.title)
    }
    return Array.from(map.entries())
  }, [items])

  const stats = useMemo(() => {
    const list = items ?? []
    const tenderIds = new Set(list.map((i) => i.tender_id))
    const productIds = new Set(list.filter((i) => i.product_id).map((i) => i.product_id))
    const avgLines = tenderIds.size > 0 ? (list.length / tenderIds.size).toFixed(1) : "0"
    return {
      totalLines: list.length,
      tenderCount: tenderIds.size,
      productCount: productIds.size,
      avgLines,
    }
  }, [items])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (items ?? []).filter((item) => {
      const matchesTender = tenderFilter === ALL_TENDERS || item.tender_id === tenderFilter
      const matchesSearch = !term || item.description.toLowerCase().includes(term)
      return matchesTender && matchesSearch
    })
  }, [items, search, tenderFilter])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      {error && (
        <p className="text-sm text-destructive">Couldn&apos;t load BOQ lines: {error.message}</p>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile icon={ListChecks} label="Total BOQ Lines" value={String(stats.totalLines)} color="blue" />
          <StatTile
            icon={Layers}
            label="Tenders with BOQs"
            value={String(stats.tenderCount)}
            color="violet"
          />
          <StatTile
            icon={PackageSearch}
            label="Products Used"
            value={String(stats.productCount)}
            color="amber"
          />
          <StatTile
            icon={Boxes}
            label="Avg Lines per Tender"
            value={stats.avgLines}
            color="emerald"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>BOQ Library</CardTitle>
          <CardDescription>Every line item built across your tender pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading BOQ lines…</p>}

          {!isLoading && items && items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No BOQ lines yet — open a tender&apos;s BOQ tab to add the first line item.
            </p>
          )}

          {items && items.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by description…"
                  className="max-w-xs"
                />
                <Select value={tenderFilter} onValueChange={setTenderFilter}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_TENDERS}>All tenders</SelectItem>
                    {tenderOptions.map(([id, title]) => (
                      <SelectItem key={id} value={id}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Tender</th>
                      <th className="px-4 py-2.5">Client</th>
                      <th className="px-4 py-2.5 text-right">Qty</th>
                      <th className="px-4 py-2.5">Unit</th>
                      <th className="px-4 py-2.5 text-right">Selling Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => item.tenders && navigate(`/tenders/${item.tenders.id}`)}
                        className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {item.tenders?.title ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {item.tenders?.client ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.unit || "—"}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-foreground">
                          {currency(item.selling_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
