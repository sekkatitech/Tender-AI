import { supabase } from "@/lib/supabase/client"
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/database"

type UserRole = Database["public"]["Enums"]["user_role"]

// ── Team members ────────────────────────────────────────────────────────

export type Profile = Tables<"profiles">

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function listMemberEmails(): Promise<{ id: string; email: string }[]> {
  const { data, error } = await supabase.rpc("list_company_member_emails")
  if (error) throw error
  return data
}

export async function updateMemberRole(id: string, role: UserRole): Promise<void> {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id)
  if (error) throw error
}

// ── Invites ──────────────────────────────────────────────────────────────

export type CompanyInvite = Tables<"company_invites">
export type CompanyInviteInsert = TablesInsert<"company_invites">

export async function listInvites(): Promise<CompanyInvite[]> {
  const { data, error } = await supabase
    .from("company_invites")
    .select("*")
    .is("accepted_at", null)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createInvite(input: CompanyInviteInsert): Promise<CompanyInvite> {
  const { data, error } = await supabase
    .from("company_invites")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function revokeInvite(id: string): Promise<void> {
  const { error } = await supabase.from("company_invites").delete().eq("id", id)
  if (error) throw error
}

// ── Company ──────────────────────────────────────────────────────────────

export type Company = Tables<"companies">

export async function getCompany(id: string): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function updateCompany(id: string, patch: TablesUpdate<"companies">): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single()
  if (error) throw error
  return data
}
