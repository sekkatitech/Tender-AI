import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NAV_MODULES } from "@/config/navigation"
import { getPlan } from "@/config/plans"
import { InviteMemberDialog } from "@/features/administration/components/invite-member-dialog"
import {
  useCompany,
  useInvites,
  useMembers,
  useMyProfile,
  useRevokeInvite,
  useUpdateCompany,
  useUpdateMemberRole,
} from "@/features/administration/hooks/use-administration"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/types/database"

type UserRole = Database["public"]["Enums"]["user_role"]

const entry = NAV_MODULES.find((m) => m.id === "administration")!

const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
]

function PlanAllowance({
  label,
  value,
  suffix = "",
}: {
  label: string
  value: number | null
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">
        {value == null ? "Custom" : `${value}${suffix}`}
      </p>
    </div>
  )
}

export function AdministrationPage() {
  const myProfile = useMyProfile()
  const isAdmin = myProfile?.role === "owner" || myProfile?.role === "admin"

  const { data: company } = useCompany()
  const updateCompany = useUpdateCompany()
  const { data: members, isLoading: membersLoading } = useMembers()
  const updateRole = useUpdateMemberRole()
  const { data: invites, isLoading: invitesLoading } = useInvites()
  const revokeInvite = useRevokeInvite()

  const [companyName, setCompanyName] = useState("")

  useEffect(() => {
    if (company) setCompanyName(company.name)
  }, [company])

  const nameIsDirty = company != null && companyName.trim() !== company.name
  const plan = getPlan(company?.subscription_tier)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{entry.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>Your workspace name and subscription tier.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company-name">Company name</Label>
            <div className="flex gap-2">
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={!isAdmin}
              />
              {isAdmin && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!nameIsDirty || updateCompany.isPending}
                  onClick={() => updateCompany.mutate(companyName)}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Subscription tier</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {plan?.name ?? company?.subscription_tier ?? "—"}
              </Badge>
              {plan && (
                <span className="text-sm text-muted-foreground">
                  {plan.price}
                  {plan.period}
                </span>
              )}
              <Link to="/upgrade" className="ml-auto text-sm font-medium text-primary hover:underline">
                Change plan
              </Link>
            </div>
          </div>
          {plan && (
            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <PlanAllowance label="AI tender analyses / month" value={plan.aiAnalysesPerMonth} />
              <PlanAllowance label="Users" value={plan.seats} />
              <PlanAllowance label="Document vault" value={plan.storageGb} suffix=" GB" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Everyone with access to this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading && <p className="text-sm text-muted-foreground">Loading team…</p>}
          {members && members.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const isSelf = member.id === myProfile?.id
                    return (
                      <tr key={member.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {member.full_name || "Unnamed"}
                          {isSelf && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {member.email || "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {isAdmin && !isSelf ? (
                            <Select
                              value={member.role}
                              onValueChange={(value) =>
                                updateRole.mutate({ id: member.id, role: value as UserRole })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary">{ROLE_LABELS[member.role]}</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatDate(member.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Pending Invites</CardTitle>
              <CardDescription>Invitations that haven&apos;t been accepted yet.</CardDescription>
            </div>
            <InviteMemberDialog />
          </CardHeader>
          <CardContent>
            {invitesLoading && <p className="text-sm text-muted-foreground">Loading invites…</p>}
            {invites && invites.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending invites.</p>
            )}
            {invites && invites.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Role</th>
                      <th className="px-4 py-2.5">Invited</th>
                      <th className="px-4 py-2.5">Expires</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((invite) => (
                      <tr key={invite.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-medium text-foreground">{invite.email}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="secondary">{ROLE_LABELS[invite.role]}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatDate(invite.created_at)}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatDate(invite.expires_at)}
                        </td>
                        <td className="px-4 py-2.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => revokeInvite.mutate(invite.id)}
                            disabled={revokeInvite.isPending}
                          >
                            Revoke
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
