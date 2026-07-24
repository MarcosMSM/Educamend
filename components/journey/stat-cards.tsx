import { Award, Clock, Compass, FolderGit2, Sparkles, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { JourneyStats } from "@/lib/data/journey"

type Stat = {
  key: keyof JourneyStats
  label: string
  icon: LucideIcon
  format?: (value: number) => string
}

const STATS: Stat[] = [
  { key: "experiences", label: "Experiências", icon: Compass },
  { key: "projects", label: "Projetos", icon: FolderGit2 },
  { key: "hours", label: "Horas", icon: Clock },
  { key: "certificates", label: "Certificados", icon: Award },
  { key: "achievements", label: "Conquistas", icon: Trophy },
  { key: "skills", label: "Competências", icon: Sparkles },
]

export function StatCards({ stats }: { stats: JourneyStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STATS.map(({ key, label, icon: Icon, format }) => {
        const value = stats[key]
        return (
          <Card key={key} className="transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">
                  {format ? format(value) : value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
