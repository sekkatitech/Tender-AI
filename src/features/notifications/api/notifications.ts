import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesInsert } from "@/types/database"

export type Notification = Tables<"notifications">
export type NotificationInsert = TablesInsert<"notifications">

export async function listNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createNotifications(rows: NotificationInsert[]): Promise<void> {
  if (rows.length === 0) return
  const { error } = await supabase.from("notifications").insert(rows)
  if (error) throw error
}

export async function markNotificationRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: isRead })
    .eq("id", id)
  if (error) throw error
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false)
  if (error) throw error
}
