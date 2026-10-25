export interface HelpArticle {
  id: string
  title: string
  /** Links back to a NAV_MODULES entry so the widget can reuse its icon. */
  moduleId?: string
  keywords: string[]
  /** Paragraphs separated by a blank line. */
  body: string
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting started",
    keywords: ["start", "setup", "onboarding", "new", "company", "workspace", "sign up"],
    body: `When you sign up, TenderPilot AI creates a new company workspace and makes you its Owner. Everything you create — tenders, suppliers, documents — belongs to that company and is only visible to people on your team.

To bring teammates in, go to Administration and click "Invite teammate." That generates a shareable link (valid for 7 days) — send it to them however works for you. When they sign up through that link, they join your company directly instead of creating a new one.

The company switcher in the top-left of the top bar shows your current workspace name. The sidebar on the left lists every module — click any of them any time.`,
  },
  {
    id: "dashboard",
    title: "Understanding your Dashboard",
    moduleId: "dashboard",
    keywords: ["dashboard", "overview", "pipeline", "stats", "home"],
    body: `The Dashboard is your tender pipeline at a glance. The stat tiles across the top show Active Tenders, tenders Closing in 7 Days, your Win Rate, total Suppliers, and Open Tasks.

"Pipeline by Status" shows how many tenders are in each stage (Discovered, In Progress, Submitted, Won, Lost, Archived). "Closing Soon" lists upcoming closing dates — click any row to jump straight into that tender.

"Open Tasks" lists outstanding tasks across every tender, with a link back to the tender each one belongs to.`,
  },
  {
    id: "tenders",
    title: "Managing tenders",
    moduleId: "tenders",
    keywords: ["tender", "new tender", "workspace", "status", "checklist", "submission"],
    body: `Click "New Tender" on the Tender Management page to create one — you only need a title to start; tender number, client, and closing date can be filled in any time from the Overview tab.

Every tender has its own workspace with tabs: Overview (key details, status, dates), Checklist (mandatory requirements), Documents, BOQ, Pricing, Suppliers, Tasks, Notes, and Submission. AI Analysis, Timeline, and History are placeholders for a future release.

Change a tender's status from the Overview tab as it moves through Discovered → In Progress → Submitted → Won/Lost/Archived. That status drives what shows up on your Dashboard, Reports, and Compliance pages.`,
  },
  {
    id: "suppliers",
    title: "Managing suppliers",
    moduleId: "suppliers",
    keywords: ["supplier", "vendor", "price list", "contacts", "products"],
    body: `Click "New Supplier" on the Supplier Intelligence page. Each supplier gets its own workspace with Overview, Contacts, Products, and Price Lists tabs.

Price list uploads are versioned — every upload creates a new version and the previous one is kept, never overwritten, so you always have a history of what a supplier has quoted over time.

Products you add here become available to pick from when pricing a BOQ line, and their cost pre-fills automatically.`,
  },
  {
    id: "boq",
    title: "Building a Bill of Quantities",
    moduleId: "boq",
    keywords: ["boq", "bill of quantities", "line item", "add line"],
    body: `BOQ lines are added inside a specific tender — open a tender, go to its BOQ tab, and click "Add line." You can't add a line directly from the BOQ Builder page, because a line only makes sense inside a tender's pricing context.

The BOQ Builder page you're looking at is a company-wide library: every line item you've built, across every tender, in one searchable place. Use it to find a line item by description or filter by tender — click any row to jump into that tender's workspace.

Each line has a description, an optional linked product, quantity, unit, and a full cost breakdown (supplier cost, freight, insurance, import costs, labour, travel, accommodation, support, warranty, overheads, risk, contingency) plus markup % and VAT % — see the Pricing Engine article for how those roll up.`,
  },
  {
    id: "pricing",
    title: "Understanding the Pricing Engine",
    moduleId: "pricing",
    keywords: ["pricing", "margin", "markup", "cost", "vat"],
    body: `The Pricing Engine page shows Total Cost, Total Selling Price, your Largest Cost Category, and Average Markup across every BOQ line company-wide, plus a full breakdown of where the money goes across all 12 cost categories.

The actual pricing math for a single BOQ line happens in a tender's Pricing tab: cost-per-unit × quantity gives total cost, markup % is applied on top, then VAT % is applied to get the final selling price. Gross profit is just the markup amount — VAT is a pass-through, not real revenue.

For win/loss outcomes and margin by client, see the Reports page instead — Pricing Engine is about cost composition, Reports is about results.`,
  },
  {
    id: "compliance",
    title: "Staying compliant",
    moduleId: "compliance",
    keywords: ["compliance", "mandatory", "at risk", "checklist"],
    body: `Compliance rolls up two things for every active tender: mandatory checklist items (from the tender's Checklist tab) and mandatory documents (uploads tagged "Mandatory" in the tender's Documents tab).

A tender shows as Compliant once every mandatory checklist item is checked off. It shows At Risk if any are still outstanding, or "No Checklist" if you haven't added any mandatory items yet. The table sorts At Risk tenders first so nothing urgent gets missed.`,
  },
  {
    id: "documents",
    title: "Managing documents",
    moduleId: "documents",
    keywords: ["documents", "upload", "files", "download"],
    body: `Document Management is a company-wide library of every file uploaded anywhere in TenderPilot — tender documents, supplier price lists, and Knowledge Base files all show up here, searchable and filterable by category.

You can browse and download from this page, but uploads happen from the source: a tender's Documents tab, a supplier's Price Lists tab, or the Knowledge Base page for company-wide reference documents.`,
  },
  {
    id: "knowledge-base",
    title: "Company Knowledge Base",
    moduleId: "knowledge-base",
    keywords: ["knowledge base", "company profile", "templates", "certificates"],
    body: `The Knowledge Base module stores your company's own reference documents — company profile, supplier agreements, pricing policies, proposal templates, reference letters, technical documents, past winning tenders, and certificates.

Upload a file, tag it with the right category, and it's instantly searchable here and cross-referenced on the Document Management page. This is different from this Help Center — this module is your company's documents, Help Center is TenderPilot's own how-to guide.`,
  },
  {
    id: "reports",
    title: "Reading your Reports",
    moduleId: "reports",
    keywords: ["reports", "win rate", "margin", "client"],
    body: `Reports is the analytical counterpart to the Dashboard — it shows how things actually turned out rather than what's currently in flight. Win Rate, Won Value, Pipeline Value, and Average Margin summarize your whole pipeline.

"Won vs Lost" compares decided tenders. "Tenders by Client" shows win rate per client. "Tender Pricing" lists every priced tender with its BOQ total and margin, sorted by value — click a row to jump to that tender.`,
  },
  {
    id: "notifications",
    title: "Notifications & reminders",
    moduleId: "notifications",
    keywords: ["notifications", "reminders", "bell", "unread"],
    body: `The bell icon in the top bar shows your unread count. Reminders generate automatically: closing-date alerts for tenders closing within 7 days, briefing reminders within 3 days, and task-due alerts for anything due within 2 days or overdue.

Click a reminder to mark it read and jump to the tender it's about, or use "Mark all as read" to clear the badge. Reminders never duplicate — once one exists for a tender, it won't be created again even if you revisit the app.`,
  },
  {
    id: "crm",
    title: "Managing contacts (CRM)",
    moduleId: "crm",
    keywords: ["crm", "contacts", "clients", "organization"],
    body: `CRM is your address book of client contacts — name, organization, role, email, phone, and notes. Click "New Contact" to add one, or click any row to edit it.

The "Related Tenders" column automatically counts tenders whose client name matches the contact's organization, so you can see at a glance who you've dealt with before without manually linking anything.`,
  },
  {
    id: "projects",
    title: "Tracking projects",
    moduleId: "projects",
    keywords: ["projects", "delivery", "post-award"],
    body: `Projects track delivery after you've won a tender. Click "New Project," and if you link it to a tender, the project name auto-fills from the tender's title.

Set a status (Active, On Hold, Completed, Cancelled) and optional start/end dates. Filter and search the list the same way as everywhere else in TenderPilot.`,
  },
  {
    id: "administration",
    title: "Team & company administration",
    moduleId: "administration",
    keywords: ["administration", "team", "invite", "role", "owner", "admin"],
    body: `Administration is where Owners and Admins manage the company. Update the company name from the Company card, and see every team member with their role in the Team Members table.

To bring someone new in, click "Invite teammate," pick a role, and share the generated link — it's valid for 7 days and can only be used once. Only Owners and Admins can invite people or change someone else's role — and nobody can change their own role, even Owners, to avoid accidentally locking themselves out.`,
  },
  {
    id: "settings",
    title: "Your account settings",
    moduleId: "settings",
    keywords: ["settings", "profile", "password", "avatar", "account"],
    body: `Settings is about you personally, not your company. Under "My Profile," set your full name and an avatar URL — both show up in the top bar and in Administration's team list.

"Password & Security" lets you change your sign-in password. Company name and subscription tier are managed from Administration instead — there's a link straight there if you need it.`,
  },
  {
    id: "ai-features",
    title: "AI tender import and win forecast",
    moduleId: "tenders",
    keywords: ["ai", "import", "pdf", "forecast", "readiness", "win"],
    body: `In Tender Management, click "Import with AI" and upload the tender PDF or paste its link. The AI fills in the New Tender form, lists the returnable documents and risks, and shows the page each detail came from. Click a page number to open the PDF on that page and check it before you save.

Inside a tender, the AI Analysis tab shows a readiness score and an AI win forecast, based on your checklist, deadlines and your company's past wins and losses.`,
  },
  {
    id: "faq",
    title: "Frequently asked questions",
    keywords: ["faq", "help", "question", "problem", "stuck"],
    body: `Q: How do I create my first tender?
A: Go to Tender Management and click "New Tender." A title is all you need to start.

Q: Why does a teammate show as "Unnamed" in Administration?
A: They haven't set a name yet — ask them to visit Settings and fill in "My Profile."

Q: How do I add a BOQ line item?
A: Open the specific tender, go to its BOQ tab, and click "Add line" — BOQ Builder's own page is a read-only library across all tenders.

Q: Can I change my own role in Administration?
A: No — role changes must come from a different Owner or Admin, by design, so nobody can accidentally lock themselves out.

Q: Where do I see how a tender is actually priced?
A: The tender's own Pricing tab has the full breakdown; Pricing Engine and Reports give you the company-wide view.`,
  },
]
