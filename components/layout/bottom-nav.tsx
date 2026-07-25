"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/components/layout/nav-items"
import { STUDENT_NAV_ITEMS } from "@/components/layout/student-nav-items"
import { getActiveStudentId } from "@/components/layout/student-route"

export function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeStudentId = getActiveStudentId(pathname)

  if (!activeStudentId) {
    return (
      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full bg-sidebar px-2 py-2 text-sidebar-foreground shadow-lg md:hidden print:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[0.7rem] font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80"
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    )
  }

  const base = `/students/${activeStudentId}`

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full bg-sidebar px-1 py-2 text-sidebar-foreground shadow-lg md:hidden print:hidden">
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
              "flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[0.65rem] font-medium transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
