import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"

export interface ChecklistItemWithTender extends Tables<"tender_checklist_items"> {
  tenders: {
    id: string
    title: string
    status: Tables<"tenders">["status"]
    client: string | null
  } | null
}

export async function listAllChecklistItems(): Promise<ChecklistItemWithTender[]> {
  const { data, error } = await supabase
    .from("tender_checklist_items")
    .select("*, tenders(id, title, status, client)")
  if (error) throw error
  return data
}
