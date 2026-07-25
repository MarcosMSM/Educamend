import Link from "next/link"

import { cn } from "@/lib/utils"

export const JOURNEY_TABS = [
  { value: "overview", label: "Visão geral" },
  { value: "timeline", label: "Linha do tempo" },
  { value: "projects", label: "Projetos" },
  { value: "skills", label: "Competências" },
  { value: "documents", label: "Documentos" },
] as const

export type JourneyTabValue = (typeof JOURNEY_TABS)[number]["value"]

export function JourneyTabs({
  activeTab,
  studentId,
}: {
  activeTab: JourneyTabValue
  studentId: string
}) {
  return (
    <nav className="flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 sm:w-fit">
      {JOURNEY_TABS.map((tab) => {
        const isActive = tab.value === activeTab
        return (
          <Link
            key={tab.value}
            href={`/students/${studentId}/journey/old?tab=${tab.value}`}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
