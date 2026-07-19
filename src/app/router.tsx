import type { ComponentType } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { NAV_MODULES } from "@/config/navigation"
import {
  ForgotPasswordPage,
  LoginPage,
  ProtectedRoute,
  SignupPage,
} from "@/features/auth"
import { AdministrationPage } from "@/features/administration"
import { AiAssistantPage } from "@/features/ai-assistant"
import { BoqPage } from "@/features/boq"
import { CompliancePage } from "@/features/compliance"
import { CrmPage } from "@/features/crm"
import { DashboardPage } from "@/features/dashboard"
import { DocumentsPage } from "@/features/documents"
import { KnowledgeBasePage } from "@/features/knowledge-base"
import { NotificationsPage } from "@/features/notifications"
import { PricingPage } from "@/features/pricing"
import { ProjectsPage } from "@/features/projects"
import { ReportsPage } from "@/features/reports"
import { SettingsPage } from "@/features/settings"
import { SuppliersListPage, SupplierWorkspacePage } from "@/features/suppliers"
import { TendersListPage, TenderWorkspacePage } from "@/features/tenders"

const MODULE_PAGES: Record<string, ComponentType> = {
  dashboard: DashboardPage,
  tenders: TendersListPage,
  suppliers: SuppliersListPage,
  pricing: PricingPage,
  boq: BoqPage,
  compliance: CompliancePage,
  documents: DocumentsPage,
  "knowledge-base": KnowledgeBasePage,
  reports: ReportsPage,
  notifications: NotificationsPage,
  crm: CrmPage,
  projects: ProjectsPage,
  administration: AdministrationPage,
  settings: SettingsPage,
  "ai-assistant": AiAssistantPage,
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {NAV_MODULES.map((mod) => {
          const Page = MODULE_PAGES[mod.id]!
          return <Route key={mod.id} path={mod.path} element={<Page />} />
        })}
        <Route path="/tenders/:tenderId" element={<TenderWorkspacePage />} />
        <Route path="/suppliers/:supplierId" element={<SupplierWorkspacePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
