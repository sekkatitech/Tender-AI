import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesUpdate } from "@/types/database"

export type Profile = Tables<"profiles">

export async function getMyProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  if (error) throw error
  return data
}

export async function updateMyProfile(
  userId: string,
  patch: TablesUpdate<"profiles">
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single()
  if (error) throw error
  return data
}
