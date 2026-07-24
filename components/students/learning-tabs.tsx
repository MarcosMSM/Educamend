"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function LearningTabs({ studentId }: { studentId: string }) {
  const pathname = usePathname()
  const base = `/students/${studentId}`

  const tabs = [
    { href: `${base}/planning`, label: "Planejamento" },
    { href: `${base}/materials`, label: "Materiais" },
    { href: `${base}/evaluations`, label: "Avaliações" },
  ]

  return (
    <div className="flex gap-1 overflow-x-auto border-b pb-px print:hidden">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
