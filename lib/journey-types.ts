import type { JourneyCategory } from "@/lib/validation/journey"

/**
 * Coarse "tipo de experiência" grouping used by the v2 Experiências
 * quick-create modal. Distinct from `JOURNEY_CATEGORY_GROUPS` (used for AI
 * insight theming) — narrows the full category list down to the five types
 * called out in the v2 design.
 */
export const EXPERIENCE_TYPES = [
  "trabalho",
  "projeto",
  "voluntariado",
  "intercambio",
  "servico",
] as const

export type ExperienceType = (typeof EXPERIENCE_TYPES)[number]

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
  trabalho: "Trabalho",
  projeto: "Projetos",
  voluntariado: "Voluntariado",
  intercambio: "Intercâmbio",
  servico: "Serviço",
}

/** Representative category saved when an experience is created from the v2 quick form. */
export const EXPERIENCE_TYPE_DEFAULT_CATEGORY: Record<ExperienceType, JourneyCategory> = {
  trabalho: "trabalho",
  projeto: "projeto_pessoal",
  voluntariado: "voluntariado",
  intercambio: "intercambio",
  servico: "outro",
}
