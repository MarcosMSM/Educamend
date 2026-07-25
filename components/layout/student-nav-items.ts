import { Citrus, GitBranch, LayoutGrid, Sprout, Trophy } from "lucide-react"

export const STUDENT_NAV_ITEMS = [
  { path: "", label: "Visão Geral", icon: LayoutGrid },
  { path: "/planning", label: "Aprendizagem", icon: Sprout },
  { path: "/journey", label: "Experiências", icon: GitBranch, excludeQuery: { tab: "skills" } },
  { path: "/journey/old", label: "Competências", icon: Citrus, matchQuery: { tab: "skills" } },
  { path: "/portfolio", label: "Portfólio", icon: Trophy },
] as const
