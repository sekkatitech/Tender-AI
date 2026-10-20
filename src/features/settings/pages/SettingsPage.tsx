import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "@/app/providers/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NAV_MODULES } from "@/config/navigation"
import { useMyProfile, useUpdateMyProfile } from "@/features/settings/hooks/use-settings"

const entry = NAV_MODULES.find((m) => m.id === "settings")!

function ProfileCard() {
  const { data: profile, isLoading } = useMyProfile()
  const updateProfile = useUpdateMyProfile()

  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "")
      setAvatarUrl(profile.avatar_url ?? "")
    }
  }, [profile])

  const isDirty =
    profile != null &&
    (fullName !== (profile.full_name ?? "") || avatarUrl !== (profile.avatar_url ?? ""))

  async function handleSave() {
    await updateProfile.mutateAsync({ fullName, avatarUrl })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Your name and avatar, visible to your teammates.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading profile…</p>}
        {profile && (
          <>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
                  {(fullName || "U")[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="settings-avatar-url">Avatar URL</Label>
                <Input
                  id="settings-avatar-url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-full-name">Full name</Label>
              <Input
                id="settings-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Thandiwe Nkosi"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving…" : "Save changes"}
              </Button>
              {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function PasswordCard() {
  const { updatePassword } = useAuth()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    setError(null)
    setSuccess(false)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setIsSubmitting(true)
    const { error: updateError } = await updatePassword(password)
    setIsSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }
    setPassword("")
    setConfirmPassword("")
    setSuccess(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password & Security</CardTitle>
        <CardDescription>Update the password you use to sign in.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-new-password">New password</Label>
            <Input
              id="settings-new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-confirm-password">Confirm password</Label>
            <Input
              id="settings-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-muted-foreground">Password updated.</p>}

        <div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !password || !confirmPassword}
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkspaceBillingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace & Billing</CardTitle>
        <CardDescription>
          Company name and subscription tier are managed from{" "}
          <Link to="/administration" className="text-primary hover:underline">
            Administration
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      <ProfileCard />
      <PasswordCard />
      <WorkspaceBillingCard />
    </div>
  )
}
