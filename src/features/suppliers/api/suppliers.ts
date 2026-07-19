import { supabase } from "@/lib/supabase/client"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database"

// ── Suppliers ────────────────────────────────────────────────────────────

export type Supplier = Tables<"suppliers">
export type SupplierInsert = TablesInsert<"suppliers">
export type SupplierUpdate = TablesUpdate<"suppliers">

export async function listSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getSupplier(id: string): Promise<Supplier> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function createSupplier(input: SupplierInsert): Promise<Supplier> {
  const { data, error } = await supabase
    .from("suppliers")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function updateSupplier(id: string, patch: SupplierUpdate): Promise<Supplier> {
  const { data, error } = await supabase
    .from("suppliers")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteSupplier(id: string): Promise<void> {
  const { error } = await supabase.from("suppliers").delete().eq("id", id)
  if (error) throw error
}

// ── Contacts ─────────────────────────────────────────────────────────────

export type SupplierContact = Tables<"supplier_contacts">
export type SupplierContactInsert = TablesInsert<"supplier_contacts">

export async function listContacts(supplierId: string): Promise<SupplierContact[]> {
  const { data, error } = await supabase
    .from("supplier_contacts")
    .select("*")
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function createContact(input: SupplierContactInsert): Promise<SupplierContact> {
  const { data, error } = await supabase
    .from("supplier_contacts")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from("supplier_contacts").delete().eq("id", id)
  if (error) throw error
}

// ── Products ─────────────────────────────────────────────────────────────

export type Product = Tables<"products">
export type ProductInsert = TablesInsert<"products">

export async function listProducts(supplierId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createProduct(input: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

// ── Price lists (documents, category = 'supplier_price_list') ──────────────

export type PriceListDocument = Tables<"documents">

export async function listPriceLists(supplierId: string): Promise<PriceListDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("supplier_id", supplierId)
    .eq("category", "supplier_price_list")
    .order("version", { ascending: false })
  if (error) throw error
  return data
}

/**
 * Uploads to the private `price-lists` bucket under {company_id}/{supplier_id}/...
 * (the RLS-enforced tenant path from Phase 2) and records a new `documents`
 * row — every upload is a new row/version, the previous one is never
 * touched, per blueprint §12.
 */
export async function uploadPriceList(params: {
  companyId: string
  supplierId: string
  uploadedBy: string | null
  file: File
}): Promise<PriceListDocument> {
  const { companyId, supplierId, uploadedBy, file } = params

  const existing = await listPriceLists(supplierId)
  const nextVersion = existing.length > 0 ? Math.max(...existing.map((d) => d.version)) + 1 : 1

  const storagePath = `${companyId}/${supplierId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from("price-lists")
    .upload(storagePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from("documents")
    .insert({
      company_id: companyId,
      supplier_id: supplierId,
      category: "supplier_price_list",
      name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type || null,
      version: nextVersion,
      uploaded_by: uploadedBy,
    })
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function getPriceListDownloadUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("price-lists")
    .createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
