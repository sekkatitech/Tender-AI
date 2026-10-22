import { createHash } from "node:crypto"

import { ANNUAL_MONTHS_CHARGED, getPlan, type PlanId } from "../../src/config/plans.ts"

/**
 * PayFast helpers shared by the checkout and ITN functions.
 * Docs: https://developers.payfast.co.za/docs#step_2_signature
 */

export type Billing = "monthly" | "yearly"

/** Plans that can be bought online; Enterprise is quoted by sales. */
export const PURCHASABLE: PlanId[] = ["starter", "professional", "business"]

export function payfastConfig() {
  const merchantId = Netlify.env.get("PAYFAST_MERCHANT_ID")
  const merchantKey = Netlify.env.get("PAYFAST_MERCHANT_KEY")
  const passphrase = Netlify.env.get("PAYFAST_PASSPHRASE")
  if (!merchantId || !merchantKey || !passphrase) return null
  const sandbox = Netlify.env.get("PAYFAST_SANDBOX") === "true"
  return {
    merchantId,
    merchantKey,
    passphrase,
    host: sandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za",
  }
}

/** Price in rand for a plan and billing period, or null if not purchasable. */
export function planAmount(planId: string, billing: string): string | null {
  const plan = getPlan(planId as PlanId)
  if (!plan || !PURCHASABLE.includes(plan.id) || plan.monthlyRand == null) return null
  if (billing !== "monthly" && billing !== "yearly") return null
  const rand = billing === "monthly" ? plan.monthlyRand : plan.monthlyRand * ANNUAL_MONTHS_CHARGED
  return rand.toFixed(2)
}

/** PHP urlencode(), which PayFast's signature is defined against. */
function phpUrlEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

/**
 * Signs `fields` in the order given. Checkout signatures skip empty values;
 * ITN signatures include every posted field.
 */
export function paramString(fields: [string, string][], { skipEmpty }: { skipEmpty: boolean }) {
  return fields
    .filter(([key, value]) => key !== "signature" && (!skipEmpty || value.trim() !== ""))
    .map(([key, value]) => `${key}=${phpUrlEncode(value.trim())}`)
    .join("&")
}

export function sign(params: string, passphrase: string) {
  return createHash("md5")
    .update(`${params}&passphrase=${phpUrlEncode(passphrase.trim())}`)
    .digest("hex")
}
