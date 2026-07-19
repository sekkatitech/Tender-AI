import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"

export interface LibraryDocument extends Tables<"documents"> {
  tenders: { id: string; title: string } | null
  suppliers: { id: string; name: string } | null
}

export async function listAllDocuments(): Promise<LibraryDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*, tenders(id, title), suppliers(id, name)")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

/** Price lists live in a separate bucket from every other document category. */
function bucketForCategory(category: LibraryDocument["category"]) {
  return category === "supplier_price_list" ? "price-lists" : "documents"
}

export async function getDocumentDownloadUrl(
  category: LibraryDocument["category"],
  storagePath: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucketForCategory(category))
    .createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
