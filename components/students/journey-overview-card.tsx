import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type TreeTone = "roots" | "branches" | "fruit" | "harvest"

const TONE_STYLES: Record<TreeTone, { bg: string; iconBg: string; text: string; bar: string }> = {
  roots: { bg: "bg-tree-roots/10", iconBg: "bg-white", text: "text-tree-roots", bar: "bg-tree-roots" },
  branches: {
    bg: "bg-tree-branches/10",
    iconBg: "bg-white",
    text: "text-tree-branches",
    bar: "bg-tree-branches",
  },
  fruit: { bg: "bg-tree-fruit/10", iconBg: "bg-white", text: "text-tree-fruit", bar: "bg-tree-fruit" },
  harvest: {
    bg: "bg-tree-harvest/10",
    iconBg: "bg-white",
    text: "text-tree-harvest",
    bar: "bg-tree-harvest",
  },
}

export type JourneyStage = {
  tone: TreeTone
  icon: LucideIcon
  step: string
  title: string
  description: string
  badges: string[]
  href: string
}

export function JourneyOverviewCard({ stages }: { stages: JourneyStage[] }) {
  return (
    <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {stages.map((stage) => {
          const Icon = stage.icon
          const tone = TONE_STYLES[stage.tone]
          return (
            <Link
              key={stage.title}
              href={stage.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md",
                tone.bg
              )}
            >
              <span className={cn("absolute inset-x-0 top-0 h-1", tone.bar)} />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
                      tone.iconBg,
                      tone.text
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className={cn("text-xs font-semibold tracking-wide uppercase", tone.text)}>
                    {stage.step}
                  </p>
                </div>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border transition-transform group-hover:translate-x-0.5">
                  <ChevronRight className="size-4 text-muted-foreground" />
                </span>
              </div>
              <p className="mt-4 font-heading text-lg font-medium">{stage.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stage.description}</p>
              {stage.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.badges.map((badge) => (
                    <span
                      key={badge}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium shadow-sm",
                        tone.iconBg,
                        tone.text
                      )}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
