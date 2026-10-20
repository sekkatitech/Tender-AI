import { useEffect } from "react"

import { DashboardPreviewSection } from "@/features/landing/components/dashboard-preview-section"
import { FaqSection } from "@/features/landing/components/faq-section"
import { FeaturesSection } from "@/features/landing/components/features-section"
import { FinalCtaSection } from "@/features/landing/components/final-cta-section"
import { HeroSection } from "@/features/landing/components/hero-section"
import { LandingFooter } from "@/features/landing/components/landing-footer"
import { LandingNav } from "@/features/landing/components/landing-nav"
import { MeetTenderSection } from "@/features/landing/components/meet-tender-section"
import { PricingSection } from "@/features/landing/components/pricing-section"
import { ProblemSection } from "@/features/landing/components/problem-section"
import { TrustedBySection } from "@/features/landing/components/trusted-by-section"
import { WorkflowSection } from "@/features/landing/components/workflow-section"
import "@/features/landing/landing.css"

const TITLE = "TenderPilot AI | Win More Tenders with AI Intelligence"
const DESCRIPTION =
  "TenderPilot AI is Africa's AI-powered tender and procurement intelligence platform — analyse tenders, automate compliance, compare supplier pricing, and prepare winning submissions faster."

export function LandingPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = TITLE

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = DESCRIPTION

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [])

  return (
    <div className="landing min-h-svh bg-landing-bg selection:bg-landing-accent/30 selection:text-landing-fg">
      <LandingNav />
      <HeroSection />
      <TrustedBySection />
      <ProblemSection />
      <MeetTenderSection />
      <WorkflowSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  )
}
