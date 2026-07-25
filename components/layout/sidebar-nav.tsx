"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/components/layout/nav-items"
import { StudentSidebarNav } from "@/components/layout/student-sidebar-nav"
import { getActiveStudentId } from "@/components/layout/student-route"

type StudentOption = { id: string; full_name: string; avatar_url: string | null }

export function SidebarNav({ students }: { students: StudentOption[] }) {
  const pathname = usePathname()
  const activeStudentId = getActiveStudentId(pathname)

  if (activeStudentId) {
    return <StudentSidebarNav studentId={activeStudentId} students={students} />
  }

  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
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
  )
}
