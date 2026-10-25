import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { runForecast } from "@/features/tenders/api/forecast"
import type { Tender } from "@/features/tenders/api/tenders"
import { useBoqItems } from "@/features/tenders/hooks/use-boq"
import { useChecklistItems } from "@/features/tenders/hooks/use-checklist"
import { useTenderDocuments } from "@/features/tenders/hooks/use-documents"
import { useTasks } from "@/features/tenders/hooks/use-tasks"
import { READINESS_BAND } from "@/features/tenders/components/readiness-badge"
import { assessReadiness } from "@/features/tenders/lib/readiness"
import { cn, formatDate } from "@/lib/utils"

const LIKELIHOOD = { low: "destructive", medium: "outline", high: "success" } as const
const RISK_SEVERITY = { low: "secondary", medium: "outline", high: "destructive" } as const
const RECOMMENDATION = {
  bid: "Bid",
  bid_with_conditions: "Bid, with conditions",
  no_bid: "Don't bid",
}

const FINDING_ICON = {
  good: <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />,
  warning: <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />,
  critical: <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />,
}

export function AiAnalysisTab({ tender }: { tender: Tender }) {
  const queryClient = useQueryClient()
  const { data: checklist = [] } = useChecklistItems(tender.id)
  const { data: tasks = [] } = useTasks(tender.id)
  const { data: boq = [] } = useBoqItems(tender.id)
  const { data: documents = [] } = useTenderDocuments(tender.id)

  const forecast = useMutation({
    mutationFn: () => runForecast(tender.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenders", tender.id] }),
  })

  const readiness = assessReadiness({
    now: new Date(),
    closingDate: tender.closing_date,
    briefingDate: tender.briefing_date,
    isBriefingCompulsory: tender.is_briefing_compulsory,
    checklist,
    tasks,
    boqLineCount: boq.length,
    documentCount: documents.length,
  })
  const band = READINESS_BAND[readiness.band]
  const result = forecast.data?.forecast

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Submission readiness</CardTitle>
          <CardDescription>
            Updates live from the checklist, tasks, BOQ, documents and deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex shrink-0 flex-col items-center gap-1 md:w-40">
            <span className={cn("text-5xl font-bold tabular-nums", band.className)}>
              {readiness.score}
            </span>
            <span className="text-xs text-muted-foreground">out of 100</span>
            <span className={cn("mt-1 text-sm font-semibold", band.className)}>{band.label}</span>
            {readiness.daysLeft !== null && readiness.daysLeft >= 0 && (
              <span className="text-xs text-muted-foreground">
                {readiness.daysLeft} {readiness.daysLeft === 1 ? "day" : "days"} to close
              </span>
            )}
          </div>
          <ul className="flex flex-1 flex-col gap-2">
            {readiness.findings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {FINDING_ICON[finding.severity]}
                {finding.message}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>AI win forecast</CardTitle>
            <CardDescription>
              Claude weighs this tender against your readiness and your track record, then
              recommends whether to bid and what to do next.
            </CardDescription>
          </div>
          <Button onClick={() => forecast.mutate()} disabled={forecast.isPending}>
            {forecast.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {forecast.isPending ? "Forecasting…" : result ? "Re-run" : "Run forecast"}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {forecast.isError && <p className="text-sm text-destructive">{forecast.error.message}</p>}

          {!result && !forecast.isPending && tender.recommendations && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Last forecast</p>
              <p className="mt-1 text-sm whitespace-pre-line">{tender.recommendations}</p>
            </div>
          )}

          {result && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={LIKELIHOOD[result.win_likelihood]} className="capitalize">
                  {result.win_likelihood} win likelihood
                </Badge>
                <Badge variant={result.bid_recommendation === "no_bid" ? "destructive" : "secondary"}>
                  {RECOMMENDATION[result.bid_recommendation]}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">{result.headline}</p>
                <p className="mt-1 text-sm text-muted-foreground">{result.win_reasoning}</p>
              </div>

              {result.next_actions.length > 0 && (
                <section>
                  <h3 className="text-sm font-medium">Action plan</h3>
                  <ol className="mt-2 flex flex-col gap-2">
                    {result.next_actions.map((action, index) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <span className="w-5 shrink-0 font-semibold text-primary">{index + 1}.</span>
                        <div className="flex-1">
                          <p>
                            {action.action}
                            {action.due_by && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                by {formatDate(action.due_by)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{action.why}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {result.risks.length > 0 && (
                <section>
                  <h3 className="text-sm font-medium">Risks</h3>
                  <ul className="mt-2 flex flex-col gap-2">
                    {result.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant={RISK_SEVERITY[risk.severity]} className="capitalize">
                          {risk.severity}
                        </Badge>
                        <div className="flex-1">
                          <p>{risk.risk}</p>
                          <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {result.questions_for_client.length > 0 && (
                <section>
                  <h3 className="text-sm font-medium">Questions to ask the client</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {result.questions_for_client.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
