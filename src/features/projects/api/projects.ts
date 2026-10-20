import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database"

export interface Project extends Tables<"projects"> {
  tenders: { id: string; title: string; client: string | null } | null
}

export type ProjectInsert = TablesInsert<"projects">
export type ProjectUpdate = TablesUpdate<"projects">

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, tenders(id, title, client)")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createProject(input: ProjectInsert): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select("*, tenders(id, title, client)")
    .single()
  if (error) throw error
  return data
}

export async function updateProject(id: string, patch: ProjectUpdate): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select("*, tenders(id, title, client)")
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}
