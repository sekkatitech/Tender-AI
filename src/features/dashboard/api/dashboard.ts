import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"

export interface OpenTask extends Tables<"tender_tasks"> {
  tenders: { id: string; title: string } | null
}

export async function listOpenTasks(): Promise<OpenTask[]> {
  const { data, error } = await supabase
    .from("tender_tasks")
    .select("*, tenders(id, title)")
    .neq("status", "done")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(8)
  if (error) throw error
  return data
}
