import { useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { CreateTenderDialog } from "@/features/tenders/components/create-tender-dialog"
import { ImportTenderDialog } from "@/features/tenders/components/import-tender-dialog"
import { TenderStatusBadge } from "@/features/tenders/components/tender-status-badge"
import { useTenders } from "@/features/tenders/hooks/use-tenders"

export function TendersListPage() {
  const navigate = useNavigate()
  const { data: tenders, isLoading, error } = useTenders()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Tender Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover, track, and manage every tender workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportTenderDialog />
          <CreateTenderDialog />
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading tenders…</p>
      )}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load tenders: {error.message}
        </p>
      )}

      {tenders && tenders.length === 0 && (
        <Card className="items-center justify-center py-16 text-center">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FileText className="size-6" />
            </div>
            <CardTitle>No tenders yet</CardTitle>
            <CardDescription className="max-w-sm">
              Create your first tender to start building its workspace —
              checklist, tasks, notes, and submission tracking.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      )}

      {tenders && tenders.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Tender #</th>
                <th className="px-4 py-2.5">Title</th>
                <th className="px-4 py-2.5">Client</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Closing date</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender) => (
                <tr
                  key={tender.id}
                  onClick={() => navigate(`/tenders/${tender.id}`)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {tender.tender_number || "—"}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {tender.title}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {tender.client || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <TenderStatusBadge status={tender.status} />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {formatDate(tender.closing_date)}
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
