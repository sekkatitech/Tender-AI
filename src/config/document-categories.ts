import type { Database } from "@/types/database"

export type DocumentCategory = Database["public"]["Enums"]["document_category"]

/**
 * Label for every document_category value, including the ones Document
 * Management doesn't use yet (they belong to the future Knowledge Base
 * module) — keeping them here means that module won't need to touch this
 * file when it's built.
 */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  tender_mandatory: "Mandatory",
  tender_technical: "Technical",
  tender_submission: "Submission",
  tender_other: "Other",
  company_profile: "Company Profile",
  supplier_agreement: "Supplier Agreement",
  pricing_policy: "Pricing Policy",
  proposal_template: "Proposal Template",
  reference_letter: "Reference Letter",
  technical_document: "Technical Document",
  past_winning_tender: "Past Winning Tender",
  certificate: "Certificate",
  supplier_price_list: "Supplier Price List",
  other: "Other",
}

/** The categories a tender's Documents tab can upload under. */
export const TENDER_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "tender_mandatory",
  "tender_technical",
  "tender_submission",
  "tender_other",
]
