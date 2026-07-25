"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { STUDENT_NAV_ITEMS } from "@/components/layout/student-nav-items"
import { StudentSwitcherMenu } from "@/components/layout/student-switcher-menu"

type StudentOption = { id: string; full_name: string; avatar_url: string | null }

export function StudentSidebarNav({
  studentId,
  students,
}: {
  studentId: string
  students: StudentOption[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const base = `/students/${studentId}`

  return (
    <div className="flex flex-col gap-3 p-3">
      <StudentSwitcherMenu students={students} activeStudentId={studentId} />

      <div className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
        Jornada
      </div>

      <nav className="flex flex-col gap-1">
        {STUDENT_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const target = `${base}${item.path}`
          const query = "matchQuery" in item ? new URLSearchParams(item.matchQuery).toString() : ""
          const href = query ? `${target}?${query}` : target

          const onSamePath = item.path === "" ? pathname === base : pathname.startsWith(target)
          const matchesQuery =
            "matchQuery" in item
              ? Object.entries(item.matchQuery).every(([key, value]) => searchParams.get(key) === value)
              : true
          const matchesExclusion =
            "excludeQuery" in item
              ? Object.entries(item.excludeQuery).some(([key, value]) => searchParams.get(key) === value)
              : false

          const isActive = onSamePath && matchesQuery && !matchesExclusion

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
