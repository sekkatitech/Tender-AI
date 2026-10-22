import Anthropic from "@anthropic-ai/sdk"
import type { Config } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

/**
 * AI tender import: reads a tender document (an uploaded PDF in the
 * `documents` bucket, or a public e-tender link) and returns the fields of
 * the New Tender form, each backed by the page it came from.
 *
 * The caller's Supabase session is required and is used for every storage
 * read, so RLS keeps one company from importing another company's files.
 */

const MODEL = "claude-opus-5-5"
const MAX_LINK_BYTES = 25 * 1024 * 1024

const nullableString = { type: ["string", "null"] }
const page = { type: ["integer", "null"], description: "1-based PDF page number, or null if not paginated" }

const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title", "tender_number", "client", "department", "closing_date",
    "briefing_date", "is_briefing_compulsory", "submission_method",
    "evaluation_method", "preference_points", "warranty_requirements",
    "summary", "returnable_documents", "risks", "sources",
  ],
  properties: {
    title: { type: "string" },
    tender_number: nullableString,
    client: nullableString,
    department: nullableString,
    closing_date: { ...nullableString, description: "ISO 8601 with offset, e.g. 2026-11-14T11:00:00+02:00" },
    briefing_date: { ...nullableString, description: "ISO 8601 with offset" },
    is_briefing_compulsory: { type: "boolean" },
    submission_method: nullableString,
    evaluation_method: nullableString,
    preference_points: nullableString,
    warranty_requirements: nullableString,
    summary: { type: "string", description: "Two or three plain sentences on what is being procured" },
    returnable_documents: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "is_mandatory", "page"],
        properties: { label: { type: "string" }, is_mandatory: { type: "boolean" }, page },
      },
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["risk", "severity", "page"],
        properties: {
          risk: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          page,
        },
      },
    },
    sources: {
      type: "array",
      description: "Where each extracted form field was found",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "page", "quote"],
        properties: {
          field: { type: "string" },
          page,
          quote: { type: "string", description: "Short verbatim snippet, under 25 words" },
        },
      },
    },
  },
} as const

const SYSTEM_PROMPT = `You read South African public-sector tender documents (RFQs, RFPs, bids issued under the PPPFA and MFMA/PFMA) for small businesses deciding whether to bid.

Extract what the document actually says. Use null for anything it does not state; never guess a tender number, date or client. Dates are South African time (UTC+02:00) unless the document says otherwise.

- preference_points: the scoring system, e.g. "80/20 — 20 points for specific goals (B-BBEE level)".
- evaluation_method: functionality thresholds and price/preference stages, briefly.
- returnable_documents: every document or form the bidder must submit (SBD/MBD forms, CSD report, tax compliance PIN, B-BBEE certificate or affidavit, CIDB grading, certified IDs, etc.). is_mandatory is true when non-submission disqualifies.
- risks: things that could disqualify a small bidder or make the work unprofitable — compulsory briefings, short deadlines, CIDB grade, penalties, long payment terms, performance guarantees, local-content thresholds.
- sources: one entry per non-null form field (title, tender_number, client, department, closing_date, briefing_date, is_briefing_compulsory, submission_method, evaluation_method, preference_points, warranty_requirements).`

type DocumentBlock = Anthropic.Beta.BetaRequestDocumentBlock

function json(body: unknown, status = 200) {
  return Response.json(body, { status })
}

async function documentFromLink(link: string): Promise<DocumentBlock> {
  const url = new URL(link)
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only http and https links can be imported.")
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000), redirect: "follow" })
  if (!res.ok) throw new Error(`The link returned ${res.status}.`)

  const bytes = new Uint8Array(await res.arrayBuffer())
  if (bytes.byteLength > MAX_LINK_BYTES) throw new Error("That document is larger than 25 MB.")

  const isPdf =
    (res.headers.get("content-type") ?? "").includes("pdf") ||
    new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-"
  if (isPdf) {
    return {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: Buffer.from(bytes).toString("base64") },
      title: url.pathname.split("/").pop() || url.hostname,
    }
  }

  const text = new TextDecoder()
    .decode(bytes)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return {
    type: "document",
    source: { type: "text", media_type: "text/plain", data: text },
    title: url.hostname,
  }
}

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("VITE_SUPABASE_URL")
  const supabaseKey =
    Netlify.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Netlify.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")
  const anthropicKey = Netlify.env.get("ANTHROPIC_API_KEY")
  if (!supabaseUrl || !supabaseKey || !anthropicKey) {
    return json({ error: "AI import is not configured on the server." }, 500)
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return json({ error: "Sign in to import tenders." }, 401)

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  })
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return json({ error: "Your session has expired." }, 401)

  let body: { storagePath?: string; link?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: "Invalid request body." }, 400)
  }

  let document: DocumentBlock
  try {
    if (body.storagePath) {
      // RLS on storage.objects limits this to the caller's own company folder.
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(body.storagePath, 300)
      if (error) return json({ error: "That file could not be found." }, 404)
      document = { type: "document", source: { type: "url", url: data.signedUrl } }
    } else if (body.link) {
      document = await documentFromLink(body.link)
    } else {
      return json({ error: "Send a PDF or a link." }, 400)
    }
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not read that link." }, 400)
  }

  const client = new Anthropic({ apiKey: anthropicKey, timeout: 55_000, maxRetries: 0 })

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: EXTRACTION_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [document, { type: "text", text: "Extract this tender for our New Tender form." }],
        },
      ],
    })

    if (response.stop_reason === "refusal") {
      return json({ error: "The AI declined to read this document." }, 422)
    }
    if (response.stop_reason === "max_tokens") {
      return json({ error: "The document was too long to summarise in one pass." }, 422)
    }

    const text = response.content.find((block) => block.type === "text")
    if (!text || text.type !== "text") return json({ error: "The AI returned no result." }, 502)

    return json({ extraction: JSON.parse(text.text), model: response.model })
  } catch (error) {
    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      return json({ error: "The document took too long to read. Try a shorter PDF." }, 504)
    }
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "The AI is busy. Try again in a minute." }, 429)
    }
    if (error instanceof Anthropic.BadRequestError) {
      console.error("tender-import bad request", error.message)
      return json({ error: "The AI could not read this document." }, 400)
    }
    if (error instanceof Anthropic.APIError) {
      console.error("tender-import API error", error.status, error.message)
      return json({ error: "The AI service is unavailable." }, 502)
    }
    throw error
  }
}

export const config: Config = {
  path: "/api/tender-import",
  method: "POST",
}
