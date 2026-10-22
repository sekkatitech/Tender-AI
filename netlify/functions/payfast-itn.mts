import type { Config } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

import { type PlanId } from "../../src/config/plans.ts"
import { paramString, payfastConfig, planAmount, sign } from "../lib/payfast.mts"

/**
 * PayFast Instant Transaction Notification. The only code path that changes
 * a company's plan (the protect_company_billing trigger blocks everyone
 * else), and only after all four of PayFast's checks pass:
 *   1. the signature matches our passphrase,
 *   2. PayFast's server confirms it sent this notification,
 *   3. the amount paid matches the plan's price on our side,
 *   4. the payment is COMPLETE.
 */

export default async (req: Request) => {
  const payfast = payfastConfig()
  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("VITE_SUPABASE_URL")
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!payfast || !supabaseUrl || !serviceKey) {
    console.error("payfast-itn: missing configuration")
    return new Response("Not configured", { status: 500 })
  }

  const fields = [...new URLSearchParams(await req.text()).entries()]
  const data = Object.fromEntries(fields)
  const params = paramString(fields, { skipEmpty: false })

  if (sign(params, payfast.passphrase) !== data.signature) {
    console.warn("payfast-itn: bad signature", data.m_payment_id)
    return new Response("Invalid signature", { status: 400 })
  }

  const confirm = await fetch(`https://${payfast.host}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
    signal: AbortSignal.timeout(10_000),
  })
  if ((await confirm.text()).trim() !== "VALID") {
    console.warn("payfast-itn: not confirmed by PayFast", data.m_payment_id)
    return new Response("Not confirmed", { status: 400 })
  }

  const companyId = data.custom_str1
  const planId = data.custom_str2 as PlanId
  const billing = data.custom_str3
  const expected = planAmount(planId, billing)
  if (!companyId || !expected || Math.abs(Number(data.amount_gross) - Number(expected)) > 0.01) {
    console.warn("payfast-itn: amount mismatch", data.m_payment_id, data.amount_gross, expected)
    return new Response("Amount mismatch", { status: 400 })
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const { data: company, error: readError } = await admin
    .from("companies")
    .select("settings")
    .eq("id", companyId)
    .single()
  if (readError || !company) {
    console.error("payfast-itn: company not found", companyId)
    return new Response("Unknown company", { status: 400 })
  }

  const settings = (company.settings ?? {}) as Record<string, unknown>
  const billingRecord = {
    provider: "payfast",
    status: data.payment_status,
    plan: planId,
    billing,
    token: data.token ?? null,
    pf_payment_id: data.pf_payment_id,
    m_payment_id: data.m_payment_id,
    amount: data.amount_gross,
    updated_at: new Date().toISOString(),
  }

  // A cancelled subscription keeps the plan until the period paid for ends;
  // only a completed payment changes the tier.
  const patch =
    data.payment_status === "COMPLETE"
      ? { subscription_tier: planId, settings: { ...settings, billing: billingRecord } }
      : { settings: { ...settings, billing: billingRecord } }

  const { error: updateError } = await admin.from("companies").update(patch).eq("id", companyId)
  if (updateError) {
    console.error("payfast-itn: update failed", updateError.message)
    return new Response("Update failed", { status: 500 })
  }

  return new Response("OK")
}

export const config: Config = {
  path: "/api/payfast-itn",
  method: "POST",
}
