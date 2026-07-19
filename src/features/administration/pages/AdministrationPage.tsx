import { PlaceholderPage } from "@/components/common/placeholder-page"
import { NAV_MODULES } from "@/config/navigation"

const entry = NAV_MODULES.find((m) => m.id === "administration")!

export function AdministrationPage() {
  return (
    <PlaceholderPage
      title={entry.label}
      description={entry.description}
      icon={entry.icon}
    />
  )
}
