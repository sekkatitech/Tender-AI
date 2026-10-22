import Anthropic from "@anthropic-ai/sdk"
import type { Config } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

import { assessReadiness } from "../../src/features/tenders/lib/readiness.ts"

/**
 * Win-readiness forecast for one tender. Combines the deterministic
 * readiness score with the company's own win/loss history and asks Claude
 * for a bid/no-bid call, the risks and a dated action plan to close.
 *
 * Every read uses the caller's Supabase session, so RLS scopes the tender
 * and the history to the caller's company.
 */

const MODEL = "claude-opus-5-5"

const FORECAST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "win_likelihood", "win_reasoning", "bid_recommendation", "risks", "next_actions", "questions_for_client"],
  properties: {
    headline: { type: "string", description: "One sentence a busy owner can act on" },
    win_likelihood: { type: "string", enum: ["low", "medium", "high"] },
    win_reasoning: { type: "string", description: "Two or three sentences grounded in the data given" },
    bid_recommendation: { type: "string", enum: ["bid", "bid_with_conditions", "no_bid"] },
    risks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["risk", "severity", "mitigation"],
        properties: {
          risk: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          mitigation: { type: "string" },
        },
      },
    },
    next_actions: {
      type: "array",
      description: "Ordered; the first is what to do today",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["action", "due_by", "why"],
        properties: {
          action: { type: "string" },
          due_by: { type: ["string", "null"], description: "YYYY-MM-DD, before the closing date" },
          why: { type: "string" },
        },
      },
    },
    questions_for_client: { type: "array", items: { type: "string" } },
  },
} as const

const SYSTEM_PROMPT = `You advise South African small businesses on public-sector tenders (PPPFA, MFMA/PFMA). Given one tender's details, its readiness score, the bidder's progress and their past results, forecast whether they can submit a compliant bid on time and how likely it is to win.

Ground every statement in the data given. Do not invent requirements, competitors or figures. Where the data is thin, say so and lower your confidence. The readiness score is computed by the app; explain it, don't recompute it.

Win likelihood reflects compliance risk (missing mandatory returnables disqualify outright), time left, price readiness, preference points (B-BBEE / specific goals), and the bidder's record with this client and overall. Recommend no_bid when a compliant submission is not realistic in the time left.

next_actions: at most 6, concrete, each with a due date before closing.`

function json(body: unknown, status = 200) {
  return Response.json(body, { status })
}

function formatForecast(f: Forecast, score: number) {
  const actions = f.next_actions
    .map((a, i) => `${i + 1}. ${a.action}${a.due_by ? ` (by ${a.due_by})` : ""}`)
    .join("\n")
  return `AI forecast — readiness ${score}/100, win likelihood ${f.win_likelihood}, ${f.bid_recommendation.replace(/_/g, " ")}.\n${f.headline}\n\nNext actions:\n${actions}`
}

interface Forecast {
  headline: string
  win_likelihood: "low" | "medium" | "high"
  win_reasoning: string
  bid_recommendation: "bid" | "bid_with_conditions" | "no_bid"
  risks: { risk: string; severity: string; mitigation: string }[]
  next_actions: { action: string; due_by: string | null; why: string }[]
  questions_for_client: string[]
}

export default async (req: Request) => {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("VITE_SUPABASE_URL")
  const supabaseKey =
    Netlify.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Netlify.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")
  const anthropicKey = Netlify.env.get("ANTHROPIC_API_KEY")
  if (!supabaseUrl || !supabaseKey || !anthropicKey) {
    return json({ error: "AI forecasting is not configured on the server." }, 500)
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return json({ error: "Sign in to run a forecast." }, 401)

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  })
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return json({ error: "Your session has expired." }, 401)

  const { tenderId } = (await req.json().catch(() => ({}))) as { tenderId?: string }
  if (!tenderId) return json({ error: "Missing tender." }, 400)

  const [tenderRes, checklistRes, tasksRes, boqRes, docsRes, historyRes] = await Promise.all([
    supabase.from("tenders").select("*").eq("id", tenderId).single(),
    supabase.from("tender_checklist_items").select("label, is_mandatory, is_complete").eq("tender_id", tenderId),
    supabase.from("tender_tasks").select("title, status, due_date").eq("tender_id", tenderId),
    supabase.from("boq_items").select("id", { count: "exact", head: true }).eq("tender_id", tenderId),
    supabase.from("documents").select("name, category").eq("tender_id", tenderId),
    supabase.from("tenders").select("client, status").in("status", ["won", "lost"]),
  ])
  const tender = tenderRes.data
  if (!tender) return json({ error: "Tender not found." }, 404)

  const checklist = checklistRes.data ?? []
  const tasks = tasksRes.data ?? []
  const documents = docsRes.data ?? []
  const history = historyRes.data ?? []
  const boqLineCount = boqRes.count ?? 0

  const readiness = assessReadiness({
    now: new Date(),
    closingDate: tender.closing_date,
    briefingDate: tender.briefing_date,
    isBriefingCompulsory: tender.is_briefing_compulsory,
    checklist,
    tasks,
    boqLineCount,
    documentCount: documents.length,
  })

  const won = history.filter((t) => t.status === "won")
  const sameClient = history.filter((t) => tender.client && t.client === tender.client)
  const context = {
    today: new Date().toISOString().slice(0, 10),
    tender: {
      title: tender.title,
      number: tender.tender_number,
      client: tender.client,
      department: tender.department,
      status: tender.status,
      closing_date: tender.closing_date,
      briefing_date: tender.briefing_date,
      briefing_compulsory: tender.is_briefing_compulsory,
      submission_method: tender.submission_method,
      evaluation_method: tender.evaluation_method,
      preference_points: tender.preference_points,
      warranty_requirements: tender.warranty_requirements,
      known_risks: tender.risks,
    },
    readiness,
    checklist,
    tasks,
    pricing: { boq_lines: boqLineCount },
    documents,
    track_record: {
      decided_tenders: history.length,
      won: won.length,
      with_this_client: {
        decided: sameClient.length,
        won: sameClient.filter((t) => t.status === "won").length,
      },
    },
  }

  const client = new Anthropic({ apiKey: anthropicKey, timeout: 55_000, maxRetries: 0 })

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: FORECAST_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(context) }],
    })

    if (response.stop_reason === "refusal") return json({ error: "The AI declined to forecast this tender." }, 422)
    const text = response.content.find((block) => block.type === "text")
    if (!text || text.type !== "text") return json({ error: "The AI returned no result." }, 502)
    const forecast = JSON.parse(text.text) as Forecast

    // Keep the latest forecast on the tender so it survives a reload and
    // shows in the Overview's Recommendations field.
    await supabase
      .from("tenders")
      .update({ recommendations: formatForecast(forecast, readiness.score) })
      .eq("id", tenderId)

    return json({ forecast, readiness })
  } catch (error) {
    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      return json({ error: "The forecast took too long. Try again." }, 504)
    }
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "The AI is busy. Try again in a minute." }, 429)
    }
    if (error instanceof Anthropic.BadRequestError) {
      console.error("tender-forecast bad request", error.message)
      return json({ error: `The AI could not forecast this tender: ${error.message}` }, 400)
    }
    if (error instanceof Anthropic.APIError) {
      console.error("tender-forecast API error", error.status, error.message)
      return json({ error: "The AI service is unavailable." }, 502)
    }
    throw error
  }
}

export const config: Config = {
  path: "/api/tender-forecast",
  method: "POST",
}
