"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { STUDENT_NAV_ITEMS } from "@/components/layout/student-nav-items"
import { StudentSwitcherMenu } from "@/components/layout/student-switcher-menu"

type StudentOption = { id: string; full_name: string }

export function StudentSidebarNav({
  studentId,
  students,
}: {
  studentId: string
  students: StudentOption[]
}) {
  const pathname = usePathname()
  const base = `/students/${studentId}`

  return (
    <div className="flex flex-col gap-3 p-3">
      <StudentSwitcherMenu students={students} activeStudentId={studentId} />

      <div className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
        Jornada
      </div>

      <nav className="flex flex-col gap-1">
        {STUDENT_NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const href = `${base}${path}`
          const isActive = path === "" ? pathname === base : pathname.startsWith(href)
          return (
            <Link
              key={path}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
