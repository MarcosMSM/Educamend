import { LayoutDashboard, Settings, Store, Users } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Alunos", icon: Users },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/settings/family", label: "Família", icon: Settings },
] as const
