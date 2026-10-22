import type { PlanId } from "@/config/plans"
import { supabase } from "@/lib/supabase/client"

/**
 * Asks the server for a signed PayFast checkout and sends the browser to
 * it. PayFast posts the result to /api/payfast-itn, which updates the plan.
 */
export async function startCheckout(plan: PlanId, billing: "monthly" | "yearly"): Promise<void> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sign in to upgrade.")

  const res = await fetch("/api/payfast-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ plan, billing }),
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `Checkout failed (${res.status}).`)

  const form = document.createElement("form")
  form.method = "POST"
  form.action = body.action
  for (const [name, value] of Object.entries(body.fields as Record<string, string>)) {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}
