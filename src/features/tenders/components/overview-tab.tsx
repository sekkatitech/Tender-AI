import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Tender, TenderUpdate } from "@/features/tenders/api/tenders"
import { TENDER_STATUS_OPTIONS } from "@/features/tenders/components/tender-status-badge"
import { useUpdateTender } from "@/features/tenders/hooks/use-tenders"
import type { Database } from "@/types/database"

type TenderStatus = Database["public"]["Enums"]["tender_status"]

interface FormState {
  title: string
  tender_number: string
  client: string
  department: string
  status: TenderStatus
  closing_date: string
  briefing_date: string
  is_briefing_compulsory: boolean
  submission_method: string
  evaluation_method: string
  preference_points: string
  warranty_requirements: string
  risks: string
  questions: string
  recommendations: string
}

function toFormState(tender: Tender): FormState {
  return {
    title: tender.title,
    tender_number: tender.tender_number ?? "",
    client: tender.client ?? "",
    department: tender.department ?? "",
    status: tender.status,
    closing_date: tender.closing_date ? tender.closing_date.slice(0, 10) : "",
    briefing_date: tender.briefing_date ? tender.briefing_date.slice(0, 10) : "",
    is_briefing_compulsory: tender.is_briefing_compulsory,
    submission_method: tender.submission_method ?? "",
    evaluation_method: tender.evaluation_method ?? "",
    preference_points: tender.preference_points ?? "",
    warranty_requirements: tender.warranty_requirements ?? "",
    risks: tender.risks ?? "",
    questions: tender.questions ?? "",
    recommendations: tender.recommendations ?? "",
  }
}

export function OverviewTab({ tender }: { tender: Tender }) {
  const updateTender = useUpdateTender(tender.id)
  const [form, setForm] = useState<FormState>(() => toFormState(tender))
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setForm(toFormState(tender))
    setIsDirty(false)
  }, [tender])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  async function handleSave() {
    const patch: TenderUpdate = {
      title: form.title,
      tender_number: form.tender_number || null,
      client: form.client || null,
      department: form.department || null,
      status: form.status,
      closing_date: form.closing_date ? new Date(form.closing_date).toISOString() : null,
      briefing_date: form.briefing_date ? new Date(form.briefing_date).toISOString() : null,
      is_briefing_compulsory: form.is_briefing_compulsory,
      submission_method: form.submission_method || null,
      evaluation_method: form.evaluation_method || null,
      preference_points: form.preference_points || null,
      warranty_requirements: form.warranty_requirements || null,
      risks: form.risks || null,
      questions: form.questions || null,
      recommendations: form.recommendations || null,
    }
    await updateTender.mutateAsync(patch)
    setIsDirty(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Key info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="ov-title">Title</Label>
            <Input id="ov-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-number">Tender number</Label>
            <Input id="ov-number" value={form.tender_number} onChange={(e) => set("tender_number", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => set("status", value as TenderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TENDER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-client">Client</Label>
            <Input id="ov-client" value={form.client} onChange={(e) => set("client", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-department">Department</Label>
            <Input id="ov-department" value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates & submission</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-closing">Closing date</Label>
            <Input id="ov-closing" type="date" value={form.closing_date} onChange={(e) => set("closing_date", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-briefing">Briefing date</Label>
            <Input id="ov-briefing" type="date" value={form.briefing_date} onChange={(e) => set("briefing_date", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              id="ov-compulsory"
              checked={form.is_briefing_compulsory}
              onCheckedChange={(checked) => set("is_briefing_compulsory", checked === true)}
            />
            <Label htmlFor="ov-compulsory" className="font-normal">
              Briefing is compulsory
            </Label>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-submission-method">Submission method</Label>
            <Input id="ov-submission-method" value={form.submission_method} onChange={(e) => set("submission_method", e.target.value)} placeholder="Online portal, hand delivery…" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-evaluation-method">Evaluation method</Label>
            <Input id="ov-evaluation-method" value={form.evaluation_method} onChange={(e) => set("evaluation_method", e.target.value)} placeholder="90/10 price-preference…" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="ov-preference-points">Preference points</Label>
            <Input id="ov-preference-points" value={form.preference_points} onChange={(e) => set("preference_points", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance & notes</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-warranty">Warranty requirements</Label>
            <Textarea id="ov-warranty" value={form.warranty_requirements} onChange={(e) => set("warranty_requirements", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-risks">Risks</Label>
            <Textarea id="ov-risks" value={form.risks} onChange={(e) => set("risks", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-questions">Questions</Label>
            <Textarea id="ov-questions" value={form.questions} onChange={(e) => set("questions", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ov-recommendations">Recommendations</Label>
            <Textarea id="ov-recommendations" value={form.recommendations} onChange={(e) => set("recommendations", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty || updateTender.isPending}>
          {updateTender.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
