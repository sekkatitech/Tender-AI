import { createNote, createTender, type Tender } from "@/features/tenders/api/tenders"
import { supabase } from "@/lib/supabase/client"

// ── AI tender import ─────────────────────────────────────────────────────
// Mirrors EXTRACTION_SCHEMA in netlify/functions/tender-import.mts.

export interface TenderExtraction {
  title: string
  tender_number: string | null
  client: string | null
  department: string | null
  closing_date: string | null
  briefing_date: string | null
  is_briefing_compulsory: boolean
  submission_method: string | null
  evaluation_method: string | null
  preference_points: string | null
  warranty_requirements: string | null
  summary: string
  returnable_documents: { label: string; is_mandatory: boolean; page: number | null }[]
  risks: { risk: string; severity: "low" | "medium" | "high"; page: number | null }[]
  sources: { field: string; page: number | null; quote: string }[]
}

export type ImportSource = { kind: "file"; storagePath: string; fileName: string } | { kind: "link"; link: string }

export async function uploadImportFile(companyId: string, file: File): Promise<string> {
  // Storage keys with accents, spaces or symbols like & # [ ] can upload but then fail to
  // sign (404 in tender-import), so the key keeps only safe characters. The real name is
  // still shown and saved from file.name.
  const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_")
  const storagePath = `${companyId}/imports/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from("documents").upload(storagePath, file)
  if (error) throw error
  return storagePath
}

export async function extractTender(source: ImportSource): Promise<TenderExtraction> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sign in to import tenders.")

  const res = await fetch("/api/tender-import", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(
      source.kind === "file" ? { storagePath: source.storagePath } : { link: source.link }
    ),
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `Import failed (${res.status}).`)
  return body.extraction
}

function pageRef(page: number | null) {
  return page ? ` (p. ${page})` : ""
}

/**
 * Creates the tender from a reviewed extraction, plus its checklist, an AI
 * summary note with page references, and (for uploads) the source PDF in
 * the tender's Documents tab.
 */
export async function saveImportedTender(params: {
  companyId: string
  userId: string | null
  extraction: TenderExtraction
  source: ImportSource
}): Promise<Tender> {
  const { companyId, userId, extraction: x, source } = params

  const tender = await createTender({
    company_id: companyId,
    created_by: userId,
    title: x.title,
    tender_number: x.tender_number,
    client: x.client,
    department: x.department,
    closing_date: x.closing_date,
    briefing_date: x.briefing_date,
    is_briefing_compulsory: x.is_briefing_compulsory,
    submission_method: x.submission_method,
    evaluation_method: x.evaluation_method,
    preference_points: x.preference_points,
    warranty_requirements: x.warranty_requirements,
    risks: x.risks.map((r) => `[${r.severity}] ${r.risk}${pageRef(r.page)}`).join("\n") || null,
  })

  if (x.returnable_documents.length) {
    const { error } = await supabase.from("tender_checklist_items").insert(
      x.returnable_documents.map((doc) => ({
        company_id: companyId,
        tender_id: tender.id,
        label: `${doc.label}${pageRef(doc.page)}`,
        is_mandatory: doc.is_mandatory,
      }))
    )
    if (error) throw error
  }

  const origin = source.kind === "file" ? source.fileName : source.link
  const sources = x.sources.map((s) => `• ${s.field}${pageRef(s.page)}: “${s.quote}”`).join("\n")
  await createNote({
    company_id: companyId,
    tender_id: tender.id,
    author_id: userId,
    body: `AI import from ${origin}\n\n${x.summary}${sources ? `\n\nSources:\n${sources}` : ""}`,
  })

  if (source.kind === "file") {
    const { error } = await supabase.from("documents").insert({
      company_id: companyId,
      tender_id: tender.id,
      category: "tender_other",
      name: source.fileName,
      storage_path: source.storagePath,
      mime_type: "application/pdf",
      uploaded_by: userId,
    })
    if (error) throw error
  }

  return tender
}
