import Link from "next/link"

import { requireUser } from "@/lib/auth"
import { getStudents } from "@/lib/data/students"
import { createClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { BottomNav } from "@/components/layout/bottom-nav"
import { UserMenu } from "@/components/layout/user-menu"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()
  const supabase = await createClient()
  const [{ data: profile }, students] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    getStudents(),
  ])

  const fullName = profile?.full_name ?? user.email ?? "Você"

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:border-r print:hidden">
        <div className="border-b border-sidebar-border p-4 font-heading text-lg font-semibold">
          Educamend Portal
        </div>
        <SidebarNav students={students} />
      </aside>

      <div className="flex flex-1 flex-col bg-background">
        <header className="flex items-center justify-between border-b bg-card p-3 md:justify-end print:hidden">
          <Link href="/dashboard" className="font-heading text-lg font-semibold md:hidden">
            Educamend Portal
          </Link>
          <UserMenu fullName={fullName} />
        </header>

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>

      <BottomNav />
    </div>
  )
}
