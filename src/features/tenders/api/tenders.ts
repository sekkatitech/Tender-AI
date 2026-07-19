import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database"

// ── Tenders ──────────────────────────────────────────────────────────────

export type Tender = Tables<"tenders">
export type TenderInsert = TablesInsert<"tenders">
export type TenderUpdate = TablesUpdate<"tenders">

export async function listTenders(): Promise<Tender[]> {
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getTender(id: string): Promise<Tender> {
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function createTender(input: TenderInsert): Promise<Tender> {
  const { data, error } = await supabase
    .from("tenders")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function updateTender(id: string, patch: TenderUpdate): Promise<Tender> {
  const { data, error } = await supabase
    .from("tenders")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteTender(id: string): Promise<void> {
  const { error } = await supabase.from("tenders").delete().eq("id", id)
  if (error) throw error
}

// ── Checklist ────────────────────────────────────────────────────────────

export type ChecklistItem = Tables<"tender_checklist_items">
export type ChecklistItemInsert = TablesInsert<"tender_checklist_items">

export async function listChecklistItems(tenderId: string): Promise<ChecklistItem[]> {
  const { data, error } = await supabase
    .from("tender_checklist_items")
    .select("*")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function createChecklistItem(
  input: ChecklistItemInsert
): Promise<ChecklistItem> {
  const { data, error } = await supabase
    .from("tender_checklist_items")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function setChecklistItemComplete(
  id: string,
  isComplete: boolean
): Promise<void> {
  const { error } = await supabase
    .from("tender_checklist_items")
    .update({ is_complete: isComplete })
    .eq("id", id)
  if (error) throw error
}

export async function deleteChecklistItem(id: string): Promise<void> {
  const { error } = await supabase.from("tender_checklist_items").delete().eq("id", id)
  if (error) throw error
}

// ── Tasks ────────────────────────────────────────────────────────────────

export type TenderTask = Tables<"tender_tasks">
export type TenderTaskInsert = TablesInsert<"tender_tasks">

export async function listTasks(tenderId: string): Promise<TenderTask[]> {
  const { data, error } = await supabase
    .from("tender_tasks")
    .select("*")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function createTask(input: TenderTaskInsert): Promise<TenderTask> {
  const { data, error } = await supabase
    .from("tender_tasks")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function setTaskStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("tender_tasks")
    .update({ status })
    .eq("id", id)
  if (error) throw error
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tender_tasks").delete().eq("id", id)
  if (error) throw error
}

// ── Notes ────────────────────────────────────────────────────────────────

export type TenderNote = Tables<"tender_notes">
export type TenderNoteInsert = TablesInsert<"tender_notes">

export async function listNotes(tenderId: string): Promise<TenderNote[]> {
  const { data, error } = await supabase
    .from("tender_notes")
    .select("*")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createNote(input: TenderNoteInsert): Promise<TenderNote> {
  const { data, error } = await supabase
    .from("tender_notes")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

// ── Submissions ──────────────────────────────────────────────────────────

export type TenderSubmission = Tables<"tender_submissions">
export type TenderSubmissionInsert = TablesInsert<"tender_submissions">

export async function listSubmissions(tenderId: string): Promise<TenderSubmission[]> {
  const { data, error } = await supabase
    .from("tender_submissions")
    .select("*")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createSubmission(
  input: TenderSubmissionInsert
): Promise<TenderSubmission> {
  const { data, error } = await supabase
    .from("tender_submissions")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

// ── Linked suppliers ─────────────────────────────────────────────────────

export interface TenderSupplierLink {
  id: string
  status: string | null
  notes: string | null
  supplier_id: string
  suppliers: { id: string; name: string }
}

export async function listTenderSuppliers(tenderId: string): Promise<TenderSupplierLink[]> {
  const { data, error } = await supabase
    .from("tender_suppliers")
    .select("id, status, notes, supplier_id, suppliers(id, name)")
    .eq("tender_id", tenderId)
  if (error) throw error
  return data
}

export async function linkSupplier(input: {
  tenderId: string
  companyId: string
  supplierId: string
}): Promise<void> {
  const { error } = await supabase.from("tender_suppliers").insert({
    tender_id: input.tenderId,
    company_id: input.companyId,
    supplier_id: input.supplierId,
  })
  if (error) throw error
}

export async function unlinkSupplier(id: string): Promise<void> {
  const { error } = await supabase.from("tender_suppliers").delete().eq("id", id)
  if (error) throw error
}
