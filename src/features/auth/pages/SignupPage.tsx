import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { useAuth } from "@/app/providers/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { supabase } from "@/lib/supabase/client"

interface InvitePreview {
  company_name: string
  email: string
  role: string
}

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get("invite")

  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const [invite, setInvite] = useState<InvitePreview | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [isCheckingInvite, setIsCheckingInvite] = useState(!!inviteToken)

  useEffect(() => {
    if (!inviteToken) return
    let cancelled = false

    supabase
      .rpc("get_invite_preview", { invite_token: inviteToken })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return
        const preview = data?.[0]
        if (rpcError || !preview) {
          setInviteError("This invite link is invalid or has expired.")
        } else {
          setInvite(preview)
          setEmail(preview.email)
        }
        setIsCheckingInvite(false)
      })

    return () => {
      cancelled = true
    }
  }, [inviteToken])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signUpError, hasSession } = await signUp(
      email,
      password,
      fullName,
      companyName,
      invite ? (inviteToken ?? undefined) : undefined
    )

    setIsSubmitting(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }
    if (hasSession) {
      navigate("/dashboard")
    } else {
      setNeedsConfirmation(true)
    }
  }

  if (needsConfirmation) {
    return (
      <AuthLayout
        title="Check your email"
        description={`We've sent a confirmation link to ${email}. Click it to activate your workspace.`}
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        {null}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={invite ? `Join ${invite.company_name}` : "Create your company workspace"}
      description={
        invite
          ? `You've been invited as a${invite.role === "admin" ? "n" : ""} ${invite.role}.`
          : "Start discovering and pricing tenders with AI."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {isCheckingInvite && (
          <p className="text-sm text-muted-foreground">Checking invite…</p>
        )}

        {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Your full name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Jane Dlamini"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </div>

        {!invite && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Suppliers Ltd"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!!invite}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting || isCheckingInvite}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  )
}
