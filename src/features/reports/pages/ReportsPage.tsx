import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart3, DollarSign, Percent, Trophy } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatTile } from "@/components/common/stat-tile"
import { NAV_MODULES } from "@/config/navigation"
import { TenderStatusBadge } from "@/features/tenders/components/tender-status-badge"
import { useTenders } from "@/features/tenders/hooks/use-tenders"
import { useBoqItemsWithTenders } from "@/features/reports/hooks/use-reports"
import type { Database } from "@/types/database"

type TenderStatus = Database["public"]["Enums"]["tender_status"]

const entry = NAV_MODULES.find((m) => m.id === "reports")!

const ACTIVE_STATUSES = new Set(["discovered", "in_progress", "submitted"])

function currency(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function percent(value: number | null) {
  return value === null ? "—" : `${Math.round(value * 100)}%`
}

export function ReportsPage() {
  const navigate = useNavigate()
  const { data: tenders, isLoading: tendersLoading, error: tendersError } = useTenders()
  const { data: boqItems, isLoading: boqLoading } = useBoqItemsWithTenders()

  const stats = useMemo(() => {
    const tenderList = tenders ?? []
    const items = boqItems ?? []

    const won = tenderList.filter((t) => t.status === "won").length
    const lost = tenderList.filter((t) => t.status === "lost").length
    const winRate = won + lost > 0 ? won / (won + lost) : null

    const wonIds = new Set(tenderList.filter((t) => t.status === "won").map((t) => t.id))
    const activeIds = new Set(
      tenderList.filter((t) => ACTIVE_STATUSES.has(t.status)).map((t) => t.id)
    )

    const wonValue = items
      .filter((i) => wonIds.has(i.tender_id))
      .reduce((sum, i) => sum + i.selling_price, 0)
    const pipelineValue = items
      .filter((i) => activeIds.has(i.tender_id))
      .reduce((sum, i) => sum + i.selling_price, 0)

    const totalSellingPrice = items.reduce((sum, i) => sum + i.selling_price, 0)
    const totalGrossProfit = items.reduce((sum, i) => sum + i.gross_profit, 0)
    const avgMargin = totalSellingPrice > 0 ? totalGrossProfit / totalSellingPrice : null

    const byTender = new Map<
      string,
      { title: string; client: string | null; status: TenderStatus; sellingPrice: number; grossProfit: number }
    >()
    for (const item of items) {
      if (!item.tenders) continue
      const existing = byTender.get(item.tender_id)
      if (existing) {
        existing.sellingPrice += item.selling_price
        existing.grossProfit += item.gross_profit
      } else {
        byTender.set(item.tender_id, {
          title: item.tenders.title,
          client: item.tenders.client,
          status: item.tenders.status,
          sellingPrice: item.selling_price,
          grossProfit: item.gross_profit,
        })
      }
    }
    const tenderPricing = Array.from(byTender.entries())
      .map(([id, v]) => ({
        id,
        ...v,
        margin: v.sellingPrice > 0 ? v.grossProfit / v.sellingPrice : null,
      }))
      .sort((a, b) => b.sellingPrice - a.sellingPrice)

    const byClient = new Map<string, { total: number; won: number; lost: number }>()
    for (const t of tenderList) {
      const client = t.client?.trim()
      if (!client) continue
      const existing = byClient.get(client) ?? { total: 0, won: 0, lost: 0 }
      existing.total += 1
      if (t.status === "won") existing.won += 1
      if (t.status === "lost") existing.lost += 1
      byClient.set(client, existing)
    }
    const clientBreakdown = Array.from(byClient.entries())
      .map(([client, v]) => ({
        client,
        ...v,
        winRate: v.won + v.lost > 0 ? v.won / (v.won + v.lost) : null,
      }))
      .sort((a, b) => b.total - a.total)

    return { won, lost, winRate, wonValue, pipelineValue, avgMargin, tenderPricing, clientBreakdown }
  }, [tenders, boqItems])

  const isLoading = tendersLoading || boqLoading
  const maxWonLost = Math.max(1, stats.won, stats.lost)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      {tendersError && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load tenders: {tendersError.message}
        </p>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile icon={Trophy} label="Win Rate" value={percent(stats.winRate)} color="emerald" />
          <StatTile icon={DollarSign} label="Won Value" value={currency(stats.wonValue)} color="blue" />
          <StatTile
            icon={BarChart3}
            label="Pipeline Value"
            value={currency(stats.pipelineValue)}
            color="violet"
          />
          <StatTile
            icon={Percent}
            label="Average Margin"
            value={percent(stats.avgMargin)}
            color="amber"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Won vs Lost</CardTitle>
            <CardDescription>Decided tenders in your pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm text-foreground">Won</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(stats.won / maxWonLost) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-sm text-muted-foreground">
                {stats.won}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm text-foreground">Lost</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-destructive"
                  style={{ width: `${(stats.lost / maxWonLost) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-sm text-muted-foreground">
                {stats.lost}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenders by Client</CardTitle>
            <CardDescription>Win rate by client across your pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.clientBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tenders with a client on record yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium text-muted-foreground">
                      <th className="py-1.5 pr-2">Client</th>
                      <th className="py-1.5 pr-2 text-right">Total</th>
                      <th className="py-1.5 pr-2 text-right">Won</th>
                      <th className="py-1.5 pr-2 text-right">Lost</th>
                      <th className="py-1.5 text-right">Win %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.clientBreakdown.map((c) => (
                      <tr key={c.client} className="border-t border-border">
                        <td className="py-1.5 pr-2 font-medium text-foreground">{c.client}</td>
                        <td className="py-1.5 pr-2 text-right text-muted-foreground">{c.total}</td>
                        <td className="py-1.5 pr-2 text-right text-muted-foreground">{c.won}</td>
                        <td className="py-1.5 pr-2 text-right text-muted-foreground">{c.lost}</td>
                        <td className="py-1.5 text-right text-muted-foreground">
                          {percent(c.winRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tender Pricing</CardTitle>
          <CardDescription>BOQ totals and margin for every priced tender.</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.tenderPricing.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tenders have priced BOQ lines yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Client</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">BOQ Total</th>
                    <th className="px-4 py-2.5 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tenderPricing.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => navigate(`/tenders/${t.id}`)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">{t.title}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{t.client || "—"}</td>
                      <td className="px-4 py-2.5">
                        <TenderStatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">
                        {currency(t.sellingPrice)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">
                        {percent(t.margin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
