import { useMemo } from "react"
import { Calculator, DollarSign, PieChart, Percent } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatTile } from "@/components/common/stat-tile"
import { NAV_MODULES } from "@/config/navigation"
import { useBoqItemsWithTenders } from "@/features/reports/hooks/use-reports"
import type { BoqItemWithTender } from "@/features/reports/api/reports"

const entry = NAV_MODULES.find((m) => m.id === "pricing")!

const COST_CATEGORIES: { key: keyof BoqItemWithTender; label: string }[] = [
  { key: "supplier_cost", label: "Supplier Cost" },
  { key: "freight", label: "Freight" },
  { key: "insurance", label: "Insurance" },
  { key: "import_costs", label: "Import Costs" },
  { key: "labour", label: "Labour" },
  { key: "travel", label: "Travel" },
  { key: "accommodation", label: "Accommodation" },
  { key: "support", label: "Support" },
  { key: "warranty", label: "Warranty" },
  { key: "overheads", label: "Overheads" },
  { key: "risk", label: "Risk" },
  { key: "contingency", label: "Contingency" },
]

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function PricingPage() {
  const { data: items, isLoading, error } = useBoqItemsWithTenders()

  const stats = useMemo(() => {
    const list = items ?? []

    const categoryTotals = COST_CATEGORIES.map(({ key, label }) => ({
      key,
      label,
      total: list.reduce((sum, item) => sum + (item[key] as number) * item.quantity, 0),
    })).sort((a, b) => b.total - a.total)

    const totalCost = categoryTotals.reduce((sum, c) => sum + c.total, 0)
    const totalSellingPrice = list.reduce((sum, item) => sum + item.selling_price, 0)
    const avgMarkup =
      list.length > 0
        ? list.reduce((sum, item) => sum + item.markup_percent, 0) / list.length
        : null
    const largestCategory = categoryTotals[0] && categoryTotals[0].total > 0 ? categoryTotals[0].label : "—"
    const maxCategoryTotal = Math.max(1, ...categoryTotals.map((c) => c.total))

    return { categoryTotals, totalCost, totalSellingPrice, avgMarkup, largestCategory, maxCategoryTotal }
  }, [items])

  const hasLines = (items?.length ?? 0) > 0

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      {error && (
        <p className="text-sm text-destructive">Couldn&apos;t load pricing data: {error.message}</p>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile
            icon={Calculator}
            label="Total Cost"
            value={currency(stats.totalCost)}
            color="rose"
          />
          <StatTile
            icon={DollarSign}
            label="Total Selling Price"
            value={currency(stats.totalSellingPrice)}
            color="blue"
          />
          <StatTile
            icon={PieChart}
            label="Largest Cost Category"
            value={stats.largestCategory}
            color="amber"
          />
          <StatTile
            icon={Percent}
            label="Average Markup"
            value={stats.avgMarkup === null ? "—" : `${stats.avgMarkup.toFixed(1)}%`}
            color="violet"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown by Category</CardTitle>
          <CardDescription>
            Where the money in every BOQ line comes from, across your whole pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading pricing data…</p>}

          {!isLoading && !hasLines && (
            <p className="text-sm text-muted-foreground">
              No priced BOQ lines yet — costs will break down here once tenders have BOQ items.
            </p>
          )}

          {hasLines && (
            <div className="flex flex-col gap-3">
              {stats.categoryTotals.map((c) => (
                <div key={c.key} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm text-foreground">{c.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(c.total / stats.maxCategoryTotal) * 100}%` }}
                    />
                  </div>
                  <span className="w-28 shrink-0 text-right text-sm text-muted-foreground">
                    {currency(c.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
