/**
 * Submission readiness for one tender: a 0–100 score from the work that
 * decides whether a bid gets in on time and compliant. Deterministic, so it
 * works without the AI and the AI forecast can explain it rather than
 * invent its own number. Shared by the AI Analysis tab and the
 * tender-forecast function.
 */

export interface ReadinessInput {
  now: Date
  closingDate: string | null
  briefingDate: string | null
  isBriefingCompulsory: boolean
  checklist: { is_mandatory: boolean; is_complete: boolean }[]
  tasks: { status: string }[]
  boqLineCount: number
  documentCount: number
}

export type ReadinessBand = "ready" | "on_track" | "at_risk" | "critical"

export interface ReadinessFinding {
  severity: "good" | "warning" | "critical"
  message: string
}

export interface Readiness {
  score: number
  band: ReadinessBand
  daysLeft: number | null
  findings: ReadinessFinding[]
}

const DAY = 24 * 60 * 60 * 1000

/** Weights sum to 100. */
const WEIGHTS = { mandatory: 40, tasks: 15, pricing: 20, documents: 10, time: 15 }

function ratio(done: number, total: number) {
  return total === 0 ? 1 : done / total
}

export function assessReadiness(input: ReadinessInput): Readiness {
  const findings: ReadinessFinding[] = []

  const mandatory = input.checklist.filter((item) => item.is_mandatory)
  const mandatoryDone = mandatory.filter((item) => item.is_complete).length
  const mandatoryRatio = ratio(mandatoryDone, mandatory.length)
  if (mandatory.length === 0) {
    findings.push({ severity: "warning", message: "No mandatory returnables listed yet — import the tender or add them to the checklist." })
  } else if (mandatoryDone < mandatory.length) {
    findings.push({
      severity: mandatoryRatio < 0.5 ? "critical" : "warning",
      message: `${mandatory.length - mandatoryDone} of ${mandatory.length} mandatory documents still outstanding. Any one missing disqualifies the bid.`,
    })
  } else {
    findings.push({ severity: "good", message: `All ${mandatory.length} mandatory documents are complete.` })
  }

  const tasksDone = input.tasks.filter((task) => task.status === "done").length
  const tasksRatio = ratio(tasksDone, input.tasks.length)
  if (input.tasks.length > 0 && tasksDone < input.tasks.length) {
    findings.push({ severity: "warning", message: `${input.tasks.length - tasksDone} team tasks still open.` })
  }

  const pricingRatio = input.boqLineCount > 0 ? 1 : 0
  if (!pricingRatio) {
    findings.push({ severity: "warning", message: "No BOQ lines priced yet — the bid has no price." })
  }

  const documentsRatio = input.documentCount > 0 ? 1 : 0
  if (!documentsRatio) {
    findings.push({ severity: "warning", message: "No documents uploaded to this tender." })
  }

  let daysLeft: number | null = null
  let timeRatio = 0.5
  if (input.closingDate) {
    daysLeft = Math.ceil((new Date(input.closingDate).getTime() - input.now.getTime()) / DAY)
    const openItems = mandatory.length - mandatoryDone + (input.tasks.length - tasksDone)
    if (daysLeft < 0) {
      timeRatio = 0
      findings.push({ severity: "critical", message: "The closing date has passed." })
    } else if (openItems === 0) {
      timeRatio = 1
    } else {
      // Rough capacity for a small team: two outstanding items cleared a day.
      timeRatio = Math.min(1, (daysLeft * 2) / openItems)
      if (timeRatio < 1) {
        findings.push({
          severity: daysLeft <= 3 ? "critical" : "warning",
          message: `${openItems} open items with ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left — at a typical pace this will be tight.`,
        })
      }
    }
  } else {
    findings.push({ severity: "warning", message: "No closing date set." })
  }

  if (input.isBriefingCompulsory && input.briefingDate) {
    const untilBriefing = (new Date(input.briefingDate).getTime() - input.now.getTime()) / DAY
    if (untilBriefing >= 0 && untilBriefing <= 3) {
      findings.push({ severity: "critical", message: "Compulsory briefing within 3 days — non-attendance disqualifies." })
    } else if (untilBriefing < 0) {
      findings.push({ severity: "warning", message: "Compulsory briefing date has passed — confirm you attended and have the register." })
    }
  }

  const raw =
    WEIGHTS.mandatory * mandatoryRatio +
    WEIGHTS.tasks * tasksRatio +
    WEIGHTS.pricing * pricingRatio +
    WEIGHTS.documents * documentsRatio +
    WEIGHTS.time * timeRatio
  // An expired tender can't be submitted, whatever else is done.
  const score = daysLeft !== null && daysLeft < 0 ? 0 : Math.round(raw)

  const hasCritical = findings.some((finding) => finding.severity === "critical")
  const band: ReadinessBand = hasCritical
    ? score >= 60 ? "at_risk" : "critical"
    : score >= 85 ? "ready" : score >= 60 ? "on_track" : score >= 35 ? "at_risk" : "critical"

  return { score, band, daysLeft, findings }
}
