import { Bell, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/app/providers/auth-context"
import { Button } from "@/components/ui/button"
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher"
import { useGenerateReminders } from "@/features/notifications/hooks/use-notifications"
import { useMyProfile } from "@/features/settings/hooks/use-settings"

export function Topbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { unreadCount } = useGenerateReminders()
  const { data: profile } = useMyProfile()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  const initial = (profile?.full_name || user?.email)?.[0]?.toUpperCase() ?? "U"

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      <WorkspaceSwitcher />

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="size-8 shrink-0 rounded-full object-cover ring-2 ring-accent"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-accent">
            {initial}
          </div>
        )}
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={handleSignOut}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
