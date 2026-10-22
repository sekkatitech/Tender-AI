import type { Config } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

import { getPlan, type PlanId } from "../../src/config/plans.ts"
import { paramString, payfastConfig, planAmount, sign } from "../lib/payfast.mts"

/**
 * Builds a signed PayFast subscription checkout for the caller's company.
 * The price comes from src/config/plans.ts on the server, never from the
 * browser, and only owners and admins can start a checkout.
 */

function json(body: unknown, status = 200) {
  return Response.json(body, { status })
}

export default async (req: Request) => {
  const payfast = payfastConfig()
  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("VITE_SUPABASE_URL")
  const supabaseKey =
    Netlify.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Netlify.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")
  if (!payfast || !supabaseUrl || !supabaseKey) {
    return json({ error: "Online payments are not configured yet." }, 500)
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return json({ error: "Sign in to upgrade." }, 401)

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  })
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return json({ error: "Your session has expired." }, 401)
  const user = userData.user

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role, full_name")
    .eq("id", user.id)
    .single()
  if (!profile) return json({ error: "No workspace found for your account." }, 403)
  if (profile.role !== "owner" && profile.role !== "admin") {
    return json({ error: "Only the workspace owner or an admin can change the plan." }, 403)
  }

  const { plan: planId, billing } = (await req.json().catch(() => ({}))) as {
    plan?: string
    billing?: string
  }
  const amount = planAmount(planId ?? "", billing ?? "")
  const plan = getPlan(planId as PlanId)
  if (!amount || !plan) return json({ error: "That plan can't be bought online." }, 400)

  const origin = new URL(req.url).origin
  const [firstName, ...rest] = (profile.full_name ?? "").trim().split(/\s+/)

  // Field order matters: PayFast signs them in the order its docs list them.
  const fields: [string, string][] = [
    ["merchant_id", payfast.merchantId],
    ["merchant_key", payfast.merchantKey],
    ["return_url", `${origin}/upgrade?payment=success`],
    ["cancel_url", `${origin}/upgrade?payment=cancelled`],
    ["notify_url", `${origin}/api/payfast-itn`],
    ["name_first", firstName ?? ""],
    ["name_last", rest.join(" ")],
    ["email_address", user.email ?? ""],
    ["m_payment_id", crypto.randomUUID()],
    ["amount", amount],
    ["item_name", `TenderPilot ${plan.name} (${billing})`],
    ["custom_str1", profile.company_id],
    ["custom_str2", plan.id],
    ["custom_str3", billing!],
    ["subscription_type", "1"],
    ["recurring_amount", amount],
    ["frequency", billing === "monthly" ? "3" : "6"],
    ["cycles", "0"],
  ]
  const signed = fields.filter(([, value]) => value.trim() !== "")
  signed.push(["signature", sign(paramString(signed, { skipEmpty: true }), payfast.passphrase)])

  return json({
    action: `https://${payfast.host}/eng/process`,
    fields: Object.fromEntries(signed),
  })
}

export const config: Config = {
  path: "/api/payfast-checkout",
  method: "POST",
}
