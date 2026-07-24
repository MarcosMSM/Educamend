import { BookOpen, Compass, LayoutGrid, Trophy } from "lucide-react"

export const STUDENT_NAV_ITEMS = [
  { path: "", label: "Visão Geral", icon: LayoutGrid },
  { path: "/planning", label: "Aprendizagem", icon: BookOpen },
  { path: "/journey", label: "Experiências", icon: Compass },
  { path: "/portfolio", label: "Portfólio", icon: Trophy },
] as const
