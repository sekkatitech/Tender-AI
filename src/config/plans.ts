import type { Database } from "@/types/database"

export type PlanId = Database["public"]["Enums"]["subscription_tier"]

export interface Plan {
  id: PlanId
  name: string
  blurb: string
  price: string
  period: string
  /** Monthly price in rand; null = custom. Yearly = 10 × monthly. */
  monthlyRand: number | null
  /** null = custom / negotiated. */
  seats: number | null
  /** One analysis = one tender, however many documents it has. */
  aiAnalysesPerMonth: number | null
  storageGb: number | null
  features: string[]
  cta: string
  featured: boolean
}

/**
 * Single source of truth for the subscription tiers — the public pricing
 * section and the Administration page both read from here.
 *
 * Pricing model: features + seats, with AI tender analyses as the only
 * metered unit. Uploads, links and phone scans are never charged for.
 */
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For the solo or small contractor getting into public tenders.",
    price: "R199",
    monthlyRand: 199,
    period: "/mo",
    seats: 1,
    aiAnalysesPerMonth: 3,
    storageGb: 5,
    features: [
      "3 AI tender analyses / month",
      "1 user · up to 10 active tenders",
      "Unlimited uploads, e-tender links & phone scans",
      "NOVA mobile: deadlines, checklists, alerts",
      "Compliance checklist & briefing reminders",
      "Basic BOQ & supplier catalogue",
      "5 GB document vault",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    blurb: "For growing bid teams submitting every month.",
    price: "R1,005",
    monthlyRand: 1005,
    period: "/mo",
    seats: 5,
    aiAnalysesPerMonth: 25,
    storageGb: 25,
    features: [
      "25 AI tender analyses / month",
      "Up to 5 users · unlimited tenders",
      "Ask NOVA chat (fair use)",
      "Win-readiness forecasts per tender",
      "Full pricing engine & margin breakdown",
      "Team tasks, notes & timeline",
      "25 GB document vault",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    blurb: "For established firms bidding at volume.",
    price: "R3,999",
    monthlyRand: 3999,
    period: "/mo",
    seats: 15,
    aiAnalysesPerMonth: 80,
    storageGb: 100,
    features: [
      "80 AI tender analyses / month",
      "Up to 15 users · roles & permissions",
      "AI search across past winning bids",
      "AI-drafted responses & reports",
      "CRM & post-award project tracking",
      "Bring-your-own AI key (add-on)",
      "100 GB document vault",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For groups with many branches or entities.",
    price: "Custom",
    monthlyRand: null,
    period: "",
    seats: null,
    aiAnalysesPerMonth: null,
    storageGb: null,
    features: [
      "Custom AI analysis volume",
      "Bring your own Claude or Gemini key",
      "Multiple company entities",
      "Single sign-on & API access",
      "SA data residency option (POPIA)",
      "Dedicated onboarding & SLA support",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export const PLAN_FINE_PRINT = [
  "All documents for one tender count as one analysis — addenda and re-runs within 30 days are free.",
  "Top-up packs of 10 analyses available on every paid plan.",
]

/** Annual billing charges 10 months for 12 — two months free. */
export const ANNUAL_MONTHS_CHARGED = 10
export const ANNUAL_SAVING_PERCENT = Math.round((1 - ANNUAL_MONTHS_CHARGED / 12) * 100)

export function formatRand(value: number): string {
  return `R${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export function getPlan(id: PlanId | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}
