import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"
import type { DocumentCategory } from "@/config/document-categories"

export type TenderDocument = Tables<"documents">

export async function listTenderDocuments(tenderId: string): Promise<TenderDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function uploadTenderDocument(params: {
  tenderId: string
  companyId: string
  uploadedBy: string | null
  category: DocumentCategory
  file: File
}): Promise<TenderDocument> {
  const { tenderId, companyId, uploadedBy, category, file } = params

  const storagePath = `${companyId}/${tenderId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from("documents")
    .insert({
      company_id: companyId,
      tender_id: tenderId,
      category,
      name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type || null,
      uploaded_by: uploadedBy,
    })
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteTenderDocument(id: string, storagePath: string): Promise<void> {
  await supabase.storage.from("documents").remove([storagePath])
  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) throw error
}

export async function getTenderDocumentDownloadUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
