import { supabase } from "@/lib/supabase/client"
import type { Readiness } from "@/features/tenders/lib/readiness"

// Mirrors FORECAST_SCHEMA in netlify/functions/tender-forecast.mts.
export interface TenderForecast {
  headline: string
  win_likelihood: "low" | "medium" | "high"
  win_reasoning: string
  bid_recommendation: "bid" | "bid_with_conditions" | "no_bid"
  risks: { risk: string; severity: "low" | "medium" | "high"; mitigation: string }[]
  next_actions: { action: string; due_by: string | null; why: string }[]
  questions_for_client: string[]
}

export async function runForecast(
  tenderId: string
): Promise<{ forecast: TenderForecast; readiness: Readiness }> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sign in to run a forecast.")

  const res = await fetch("/api/tender-forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tenderId }),
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `Forecast failed (${res.status}).`)
  return body
}
