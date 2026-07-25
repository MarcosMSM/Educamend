import { Award, Clock, Compass, FolderGit2, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { JourneyStats } from "@/lib/data/journey"

type Stat = { key: keyof JourneyStats; label: string; icon: LucideIcon }

const STATS: Stat[] = [
  { key: "experiences", label: "Experiências", icon: Compass },
  { key: "projects", label: "Projetos", icon: FolderGit2 },
  { key: "hours", label: "Horas registradas", icon: Clock },
  { key: "certificates", label: "Certificados", icon: Award },
  { key: "skills", label: "Competências", icon: Sparkles },
]

export function ExperienceSummaryBar({ stats }: { stats: JourneyStats }) {
  return (
    <div className="grid grid-cols-2 divide-y divide-border rounded-2xl bg-card ring-1 ring-foreground/10 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
      {STATS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tree-branches/10 text-tree-branches">
            <Icon className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-sans text-xl font-semibold">
              {stats[key].toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
