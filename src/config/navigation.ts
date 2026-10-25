import {
  LayoutDashboard,
  FileText,
  Building2,
  Calculator,
  ListChecks,
  ShieldCheck,
  FolderOpen,
  BookOpen,
  BarChart3,
  Bell,
  Users,
  FolderKanban,
  Settings2,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavModule {
  id: string
  label: string
  path: string
  icon: LucideIcon
  description: string
}

/**
 * Single source of truth for every major module (blueprint §9).
 * Sidebar navigation and the router both read from this list, so a
 * module is added to the app by adding one entry here.
 */
export const NAV_MODULES: NavModule[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Your tender pipeline at a glance.",
  },
  {
    id: "tenders",
    label: "Tender Management",
    path: "/tenders",
    icon: FileText,
    description: "Discover, track, and manage every tender workspace.",
  },
  {
    id: "suppliers",
    label: "Supplier Intelligence",
    path: "/suppliers",
    icon: Building2,
    description: "Supplier profiles, price lists, and performance history.",
  },
  {
    id: "pricing",
    label: "Pricing Engine",
    path: "/pricing",
    icon: Calculator,
    description: "Cost, markup, and margin calculations for every BOQ line.",
  },
  {
    id: "boq",
    label: "BOQ Builder",
    path: "/boq",
    icon: ListChecks,
    description: "Build and manage bills of quantities.",
  },
  {
    id: "compliance",
    label: "Compliance",
    path: "/compliance",
    icon: ShieldCheck,
    description: "Mandatory documents and compliance checklists.",
  },
  {
    id: "documents",
    label: "Document Management",
    path: "/documents",
    icon: FolderOpen,
    description: "Every tender and company document in one place.",
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    path: "/knowledge-base",
    icon: BookOpen,
    description: "Company profile, templates, and past winning tenders.",
  },
  {
    id: "reports",
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    description: "Win rates, pricing accuracy, and pipeline reporting.",
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    description: "Closing dates, briefing reminders, and task alerts.",
  },
  {
    id: "crm",
    label: "CRM",
    path: "/crm",
    icon: Users,
    description: "Clients, contacts, and relationship history.",
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
    description: "Post-award project delivery and tracking.",
  },
  {
    id: "administration",
    label: "Administration",
    path: "/administration",
    icon: Settings2,
    description: "Users, roles, and company-wide administration.",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    description: "Workspace, billing, and account preferences.",
  },
]
