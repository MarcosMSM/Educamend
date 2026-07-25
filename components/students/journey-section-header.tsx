import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type TreeTone = "roots" | "branches" | "fruit" | "harvest"

const TONE_STYLES: Record<TreeTone, string> = {
  roots: "bg-tree-roots/15 text-tree-roots",
  branches: "bg-tree-branches/15 text-tree-branches",
  fruit: "bg-tree-fruit/15 text-tree-fruit",
  harvest: "bg-tree-harvest/15 text-tree-harvest",
}

export function JourneySectionHeader({
  icon: Icon,
  tone,
  title,
  description,
}: {
  icon: LucideIcon
  tone: TreeTone
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          TONE_STYLES[tone]
        )}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-heading text-xl font-semibold">
          Jornada <span className="font-sans text-base font-normal text-muted-foreground">· {title}</span>
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
