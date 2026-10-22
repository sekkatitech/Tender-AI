import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Clock,
  History as HistoryIcon,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiAnalysisTab } from "@/features/tenders/components/ai-analysis-tab"
import { BoqTab } from "@/features/tenders/components/boq-tab"
import { ChecklistTab } from "@/features/tenders/components/checklist-tab"
import { DocumentsTab } from "@/features/tenders/components/documents-tab"
import { NotesTab } from "@/features/tenders/components/notes-tab"
import { OverviewTab } from "@/features/tenders/components/overview-tab"
import { PlaceholderTab } from "@/features/tenders/components/placeholder-tab"
import { PricingTab } from "@/features/tenders/components/pricing-tab"
import { SubmissionTab } from "@/features/tenders/components/submission-tab"
import { SuppliersTab } from "@/features/tenders/components/suppliers-tab"
import { TasksTab } from "@/features/tenders/components/tasks-tab"
import { TenderStatusBadge } from "@/features/tenders/components/tender-status-badge"
import { useDeleteTender, useTender } from "@/features/tenders/hooks/use-tenders"

export function TenderWorkspacePage() {
  const { tenderId } = useParams<{ tenderId: string }>()
  const navigate = useNavigate()
  const { data: tender, isLoading, error } = useTender(tenderId)
  const deleteTender = useDeleteTender()

  async function handleDelete() {
    if (!tender) return
    if (!window.confirm(`Delete "${tender.title}"? This can't be undone.`)) return
    await deleteTender.mutateAsync(tender.id)
    navigate("/tenders")
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-muted-foreground">Loading tender…</p>
      </div>
    )
  }

  if (error || !tender) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-destructive">
          Couldn&apos;t load this tender{error ? `: ${error.message}` : "."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-2" onClick={() => navigate("/tenders")}>
          <ArrowLeft />
          Back to tenders
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {tender.title}
              </h1>
              <TenderStatusBadge status={tender.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {[tender.tender_number, tender.client].filter(Boolean).join(" · ") || "No details yet"}
            </p>
          </div>

          <Button variant="outline" onClick={handleDelete} disabled={deleteTender.isPending}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="boq">BOQ</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab tender={tender} />
        </TabsContent>
        <TabsContent value="ai-analysis">
          <AiAnalysisTab tender={tender} />
        </TabsContent>
        <TabsContent value="checklist">
          <ChecklistTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="boq">
          <BoqTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="suppliers">
          <SuppliersTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="timeline">
          <PlaceholderTab
            icon={Clock}
            title="Timeline"
            description="An automatic activity timeline for this tender is coming in a later pass."
          />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="submission">
          <SubmissionTab tenderId={tender.id} />
        </TabsContent>
        <TabsContent value="history">
          <PlaceholderTab
            icon={HistoryIcon}
            title="History"
            description="A full audit history for this tender is coming in a later pass."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
