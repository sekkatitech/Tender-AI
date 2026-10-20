import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, CheckCircle2, FileWarning, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatTile } from "@/components/common/stat-tile"
import { NAV_MODULES } from "@/config/navigation"
import { TenderStatusBadge } from "@/features/tenders/components/tender-status-badge"
import { useTenders } from "@/features/tenders/hooks/use-tenders"
import { useAllChecklistItems } from "@/features/compliance/hooks/use-compliance"
import { useAllDocuments } from "@/features/documents/hooks/use-documents-library"

const entry = NAV_MODULES.find((m) => m.id === "compliance")!

const ACTIVE_STATUSES = new Set(["discovered", "in_progress", "submitted"])

type ComplianceStatus = "compliant" | "at-risk" | "no-checklist"

const COMPLIANCE_CONFIG: Record<ComplianceStatus, { label: string; variant: "success" | "destructive" | "secondary" }> = {
  compliant: { label: "Compliant", variant: "success" },
  "at-risk": { label: "At Risk", variant: "destructive" },
  "no-checklist": { label: "No Checklist", variant: "secondary" },
}

export function CompliancePage() {
  const navigate = useNavigate()
  const { data: tenders, isLoading: tendersLoading, error: tendersError } = useTenders()
  const { data: checklistItems, isLoading: checklistLoading } = useAllChecklistItems()
  const { data: documents, isLoading: documentsLoading } = useAllDocuments()

  const isLoading = tendersLoading || checklistLoading || documentsLoading

  const rows = useMemo(() => {
    const activeTenders = (tenders ?? []).filter((t) => ACTIVE_STATUSES.has(t.status))
    const items = checklistItems ?? []
    const docs = documents ?? []

    return activeTenders
      .map((t) => {
        const mandatoryItems = items.filter((i) => i.tender_id === t.id && i.is_mandatory)
        const mandatoryTotal = mandatoryItems.length
        const mandatoryComplete = mandatoryItems.filter((i) => i.is_complete).length
        const mandatoryDocsCount = docs.filter(
          (d) => d.tender_id === t.id && d.category === "tender_mandatory"
        ).length

        const status: ComplianceStatus =
          mandatoryTotal === 0
            ? "no-checklist"
            : mandatoryComplete === mandatoryTotal
              ? "compliant"
              : "at-risk"

        return {
          id: t.id,
          title: t.title,
          client: t.client,
          tenderStatus: t.status,
          mandatoryTotal,
          mandatoryComplete,
          mandatoryDocsCount,
          status,
        }
      })
      .sort((a, b) => {
        const order: Record<ComplianceStatus, number> = { "at-risk": 0, "no-checklist": 1, compliant: 2 }
        return order[a.status] - order[b.status]
      })
  }, [tenders, checklistItems, documents])

  const stats = useMemo(() => {
    const atRisk = rows.filter((r) => r.status === "at-risk").length
    const outstandingItems = rows.reduce(
      (sum, r) => sum + (r.mandatoryTotal - r.mandatoryComplete),
      0
    )
    const missingDocs = rows.filter((r) => r.mandatoryDocsCount === 0).length
    const compliant = rows.filter((r) => r.status === "compliant").length
    return { atRisk, outstandingItems, missingDocs, compliant }
  }, [rows])

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
          <StatTile
            icon={AlertTriangle}
            label="At Risk Tenders"
            value={String(stats.atRisk)}
            color="rose"
          />
          <StatTile
            icon={FileWarning}
            label="Outstanding Items"
            value={String(stats.outstandingItems)}
            color="amber"
          />
          <StatTile
            icon={ShieldCheck}
            label="Missing Mandatory Docs"
            value={String(stats.missingDocs)}
            color="violet"
          />
          <StatTile
            icon={CheckCircle2}
            label="Compliant Tenders"
            value={String(stats.compliant)}
            color="emerald"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>
            Mandatory checklist and document status for every active tender.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active tenders right now.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Client</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Mandatory Items</th>
                    <th className="px-4 py-2.5">Mandatory Docs</th>
                    <th className="px-4 py-2.5">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => navigate(`/tenders/${r.id}`)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">{r.title}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.client || "—"}</td>
                      <td className="px-4 py-2.5">
                        <TenderStatusBadge status={r.tenderStatus} />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {r.mandatoryComplete}/{r.mandatoryTotal}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.mandatoryDocsCount}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant={COMPLIANCE_CONFIG[r.status].variant}>
                          {COMPLIANCE_CONFIG[r.status].label}
                        </Badge>
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
