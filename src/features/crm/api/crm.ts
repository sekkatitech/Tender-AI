import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database"

export type CrmContact = Tables<"crm_contacts">
export type CrmContactInsert = TablesInsert<"crm_contacts">
export type CrmContactUpdate = TablesUpdate<"crm_contacts">

export async function listContacts(): Promise<CrmContact[]> {
  const { data, error } = await supabase
    .from("crm_contacts")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createContact(input: CrmContactInsert): Promise<CrmContact> {
  const { data, error } = await supabase
    .from("crm_contacts")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function updateContact(id: string, patch: CrmContactUpdate): Promise<CrmContact> {
  const { data, error } = await supabase
    .from("crm_contacts")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id)
  if (error) throw error
}
