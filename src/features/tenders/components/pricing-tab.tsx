import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBoqItems } from "@/features/tenders/hooks/use-boq"

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function PricingTab({ tenderId }: { tenderId: string }) {
  const { data: items, isLoading } = useBoqItems(tenderId)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading pricing…</p>
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add lines in the BOQ tab to see the pricing breakdown here.
      </p>
    )
  }

  const totalCost = items.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.supplier_cost +
          item.freight +
          item.insurance +
          item.import_costs +
          item.labour +
          item.travel +
          item.accommodation +
          item.support +
          item.warranty +
          item.overheads +
          item.risk +
          item.contingency),
    0
  )
  const totalGrossProfit = items.reduce((sum, item) => sum + item.gross_profit, 0)
  const tenderTotal = items.reduce((sum, item) => sum + item.selling_price, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {currency(totalCost)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Gross profit</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {currency(totalGrossProfit)}
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-accent/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Tender total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">
            {currency(tenderTotal)}
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2 text-right">Markup %</th>
              <th className="px-3 py-2 text-right">VAT %</th>
              <th className="px-3 py-2 text-right">Gross profit</th>
              <th className="px-3 py-2 text-right">Selling price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground">{item.description}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{item.markup_percent}%</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{item.vat_percent}%</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{currency(item.gross_profit)}</td>
                <td className="px-3 py-2 text-right font-medium text-foreground">
                  {currency(item.selling_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
