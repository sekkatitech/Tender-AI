import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"

export interface BoqItemWithTender extends Tables<"boq_items"> {
  tenders: {
    id: string
    title: string
    status: Tables<"tenders">["status"]
    client: string | null
  } | null
}

export async function listBoqItemsWithTenders(): Promise<BoqItemWithTender[]> {
  const { data, error } = await supabase
    .from("boq_items")
    .select("*, tenders(id, title, status, client)")
  if (error) throw error
  return data
}
