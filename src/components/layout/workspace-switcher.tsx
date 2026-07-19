import { ChevronsUpDown } from "lucide-react"

import { useCompanyWorkspace } from "@/app/providers/company-workspace-context"

export function WorkspaceSwitcher() {
  const { workspace, workspaces, setWorkspaceId } = useCompanyWorkspace()

  return (
    <div className="relative flex items-center">
      <select
        aria-label="Company workspace"
        value={workspace.id}
        onChange={(event) => setWorkspaceId(event.target.value)}
        className="peer appearance-none rounded-md border border-transparent bg-transparent py-1.5 pr-7 pl-2 text-sm font-medium text-foreground outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {workspaces.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground" />
    </div>
  )
}
