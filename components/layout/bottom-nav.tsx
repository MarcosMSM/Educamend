"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/components/layout/nav-items"
import { STUDENT_NAV_ITEMS } from "@/components/layout/student-nav-items"
import { getActiveStudentId } from "@/components/layout/student-route"

export function BottomNav() {
  const pathname = usePathname()
  const activeStudentId = getActiveStudentId(pathname)

  const items = activeStudentId
    ? STUDENT_NAV_ITEMS.map(({ path, label, icon }) => ({
        href: `/students/${activeStudentId}${path}`,
        label,
        icon,
      }))
    : NAV_ITEMS

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full bg-sidebar px-2 py-2 text-sidebar-foreground shadow-lg md:hidden print:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === `/students/${activeStudentId}`
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)
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
