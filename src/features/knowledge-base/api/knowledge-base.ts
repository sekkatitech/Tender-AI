import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"
import { KNOWLEDGE_BASE_DOCUMENT_CATEGORIES, type DocumentCategory } from "@/config/document-categories"

export type KnowledgeBaseDocument = Tables<"documents">

export async function listKnowledgeBaseDocuments(): Promise<KnowledgeBaseDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .is("tender_id", null)
    .in("category", KNOWLEDGE_BASE_DOCUMENT_CATEGORIES)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function uploadKnowledgeBaseDocument(params: {
  companyId: string
  uploadedBy: string | null
  category: DocumentCategory
  file: File
}): Promise<KnowledgeBaseDocument> {
  const { companyId, uploadedBy, category, file } = params

  const storagePath = `${companyId}/knowledge-base/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from("documents")
    .insert({
      company_id: companyId,
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

export async function deleteKnowledgeBaseDocument(id: string, storagePath: string): Promise<void> {
  await supabase.storage.from("documents").remove([storagePath])
  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) throw error
}

export async function getKnowledgeBaseDocumentDownloadUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
