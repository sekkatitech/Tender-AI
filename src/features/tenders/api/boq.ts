import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"
import { calculateBoqLine, type BoqCostInputs } from "@/features/tenders/lib/boq-calculations"

export type BoqItem = Tables<"boq_items">

export interface BoqLineFormInput extends BoqCostInputs {
  description: string
  unit: string
  product_id: string | null
}

/** Shared column payload for both insert and update — never duplicated. */
function toBoqRow(input: BoqLineFormInput) {
  const calc = calculateBoqLine(input)
  return {
    description: input.description,
    unit: input.unit || null,
    product_id: input.product_id,
    quantity: input.quantity,
    supplier_cost: input.supplier_cost,
    freight: input.freight,
    insurance: input.insurance,
    import_costs: input.import_costs,
    labour: input.labour,
    travel: input.travel,
    accommodation: input.accommodation,
    support: input.support,
    warranty: input.warranty,
    overheads: input.overheads,
    risk: input.risk,
    contingency: input.contingency,
    markup_percent: input.markup_percent,
    vat_percent: input.vat_percent,
    gross_profit: calc.grossProfit,
    net_profit: calc.netProfit,
    selling_price: calc.sellingPrice,
  }
}

export async function listBoqItems(tenderId: string): Promise<BoqItem[]> {
  const { data, error } = await supabase
    .from("boq_items")
    .select("*")
    .eq("tender_id", tenderId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function createBoqItem(params: {
  tenderId: string
  companyId: string
  input: BoqLineFormInput
}): Promise<BoqItem> {
  const { data, error } = await supabase
    .from("boq_items")
    .insert({
      tender_id: params.tenderId,
      company_id: params.companyId,
      ...toBoqRow(params.input),
    })
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function updateBoqItem(params: {
  id: string
  input: BoqLineFormInput
}): Promise<BoqItem> {
  const { data, error } = await supabase
    .from("boq_items")
    .update(toBoqRow(params.input))
    .eq("id", params.id)
    .select("*")
    .single()
  if (error) throw error
  return data
}

export async function deleteBoqItem(id: string): Promise<void> {
  const { error } = await supabase.from("boq_items").delete().eq("id", id)
  if (error) throw error
}

export interface CompanyProduct {
  id: string
  sku: string | null
  description: string
  cost: number | null
  currency: string
}

export async function listCompanyProducts(): Promise<CompanyProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, sku, description, cost, currency")
    .order("description", { ascending: true })
  if (error) throw error
  return data
}
