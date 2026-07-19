export interface BoqCostInputs {
  quantity: number
  supplier_cost: number
  freight: number
  insurance: number
  import_costs: number
  labour: number
  travel: number
  accommodation: number
  support: number
  warranty: number
  overheads: number
  risk: number
  contingency: number
  markup_percent: number
  vat_percent: number
}

export interface BoqCalculation {
  totalCost: number
  markupAmount: number
  priceExclVat: number
  vatAmount: number
  sellingPrice: number
  grossProfit: number
  netProfit: number
}

/**
 * The single source of truth for BOQ line pricing — every cost field is a
 * per-unit rate (blueprint §14), multiplied by quantity for the line total.
 * VAT is a pass-through (not real revenue) and every other cost is already
 * itemized above, so Net Profit = Gross Profit = the markup amount.
 */
export function calculateBoqLine(input: BoqCostInputs): BoqCalculation {
  const costPerUnit =
    input.supplier_cost +
    input.freight +
    input.insurance +
    input.import_costs +
    input.labour +
    input.travel +
    input.accommodation +
    input.support +
    input.warranty +
    input.overheads +
    input.risk +
    input.contingency

  const totalCost = costPerUnit * input.quantity
  const markupAmount = totalCost * (input.markup_percent / 100)
  const priceExclVat = totalCost + markupAmount
  const vatAmount = priceExclVat * (input.vat_percent / 100)
  const sellingPrice = priceExclVat + vatAmount

  return {
    totalCost,
    markupAmount,
    priceExclVat,
    vatAmount,
    sellingPrice,
    grossProfit: markupAmount,
    netProfit: markupAmount,
  }
}
