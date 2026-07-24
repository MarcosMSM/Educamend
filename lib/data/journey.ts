import "server-only"

import { buildSeedExperiences } from "@/lib/mock/journey-experiences"
import {
  JOURNEY_CATEGORY_GROUPS,
  JOURNEY_GROUP_LABELS,
  JOURNEY_SKILL_LABELS,
  type JourneyAttachmentKind,
  type JourneyCategory,
  type JourneyGroup,
  type JourneySkill,
  type JourneyStatus,
  type JourneyVisibility,
} from "@/lib/validation/journey"

/**
 * Mock, in-memory data-access layer for "Minha Jornada".
 *
 * Every read function here is `async` and takes the same shape it would
 * take against a real `journey_experiences` Supabase table, so swapping
 * this module for real queries later shouldn't require touching any
 * caller. The trade-off: `store` lives on `globalThis` (see below) rather
 * than a plain module-level variable, because Next.js dev (Turbopack) can
 * instantiate this module separately per route bundle — a plain `let`
 * would silently desync between e.g. `/journey` and
 * `/journey/[experienceId]/edit`. `globalThis` is the standard workaround
 * (same trick used for singleton DB clients in Next.js apps) and keeps
 * one shared store per Node.js process. It still resets on server
 * restart and is not shared across serverless/multi-instance deploys —
 * acceptable for a mock demo layer.
 */

export type JourneyAttachment = {
  id: string
  kind: JourneyAttachmentKind
  label: string
  url: string
}

export type JourneyExperience = {
  id: string
  student_id: string
  title: string
  category: JourneyCategory
  organization: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
  hours: number | null
  reflection: string | null
  skills: JourneySkill[]
  attachments: JourneyAttachment[]
  status: JourneyStatus
  visibility: JourneyVisibility
  validated_by: string | null
  validated_at: string | null
  created_at: string
  updated_at: string
}

declare global {
  var __journeyExperienceStore: JourneyExperience[] | undefined
}

const store: JourneyExperience[] = (globalThis.__journeyExperienceStore ??= [])

/** Categories treated as "project-like" for the Projetos tab and the projects stat. */
export const PROJECT_LIKE_CATEGORIES: JourneyCategory[] = [
  "projeto_pessoal",
  "hackathon",
  "robotica",
  "startup",
  "feira_ciencias",
  "empreendedorismo",
]

function ensureSeed(studentId: string) {
  if (!store.some((experience) => experience.student_id === studentId)) {
    store.push(...buildSeedExperiences(studentId))
  }
}

function sortByDateDesc(experiences: JourneyExperience[]) {
  return [...experiences].sort((a, b) => {
    const aDate = a.start_date ?? a.created_at
    const bDate = b.start_date ?? b.created_at
    return bDate.localeCompare(aDate)
  })
}

export type JourneyFilters = {
  search?: string
  category?: JourneyCategory
  status?: JourneyStatus
  skill?: JourneySkill
  /** 4-digit year, e.g. "2025" */
  period?: string
}

export async function getJourneyExperiences(
  studentId: string,
  filters: JourneyFilters = {}
): Promise<JourneyExperience[]> {
  ensureSeed(studentId)

  let results = store.filter((experience) => experience.student_id === studentId)

  if (filters.category) {
    results = results.filter((experience) => experience.category === filters.category)
  }

  if (filters.status) {
    results = results.filter((experience) => experience.status === filters.status)
  }

  if (filters.skill) {
    results = results.filter((experience) => experience.skills.includes(filters.skill!))
  }

  if (filters.period) {
    results = results.filter((experience) =>
      (experience.start_date ?? experience.end_date ?? "").startsWith(filters.period!)
    )
  }

  if (filters.search) {
    const query = filters.search.trim().toLowerCase()
    if (query) {
      results = results.filter((experience) =>
        [experience.title, experience.organization, experience.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query))
      )
    }
  }

  return sortByDateDesc(results)
}

export async function getJourneyYears(studentId: string): Promise<string[]> {
  ensureSeed(studentId)

  const years = new Set(
    store
      .filter((experience) => experience.student_id === studentId)
      .map((experience) => (experience.start_date ?? experience.end_date ?? experience.created_at).slice(0, 4))
  )

  return [...years].sort((a, b) => b.localeCompare(a))
}

export async function getJourneyExperienceById(
  experienceId: string
): Promise<JourneyExperience | null> {
  return store.find((experience) => experience.id === experienceId) ?? null
}

export type JourneyStats = {
  experiences: number
  projects: number
  hours: number
  certificates: number
  achievements: number
  skills: number
}

export async function getJourneyStats(studentId: string): Promise<JourneyStats> {
  ensureSeed(studentId)

  const experiences = store.filter(
    (experience) => experience.student_id === studentId && experience.status !== "arquivada"
  )

  const hours = experiences.reduce((sum, experience) => sum + (experience.hours ?? 0), 0)
  const projects = experiences.filter((experience) =>
    PROJECT_LIKE_CATEGORIES.includes(experience.category)
  ).length
  const certificates = experiences.filter(
    (experience) =>
      experience.category === "certificacao" ||
      experience.attachments.some((attachment) => attachment.kind === "certificado")
  ).length
  const achievements = experiences.filter((experience) => experience.status === "validada").length
  const skills = new Set(experiences.flatMap((experience) => experience.skills)).size

  return { experiences: experiences.length, projects, hours, certificates, achievements, skills }
}

export type JourneyInsight = {
  id: string
  title: string
  message: string
  suggestions: string[]
}

const GROUP_SUGGESTIONS: Record<JourneyGroup, string[]> = {
  academico: [
    "Cursos avançados ou olimpíadas na mesma área de interesse",
    "Feiras e mostras científicas regionais",
    "Grupos de pesquisa ou iniciação científica júnior",
  ],
  tecnologia: [
    "Hackathons e maratonas de programação",
    "Comunidades open source para contribuir com projetos reais",
    "Cursos de programação ou dados um nível acima do atual",
  ],
  social: [
    "Novas frentes de voluntariado alinhadas aos interesses já demonstrados",
    "Programas de liderança comunitária",
    "Intercâmbios ou imersões culturais",
  ],
  profissional: [
    "Estágios ou trabalhos de meio período na área de interesse",
    "Mentorias com profissionais da área",
    "Projetos pessoais que simulem um problema real de mercado",
  ],
  pessoal: [
    "Apresentações ou competições que exponham a habilidade já desenvolvida",
    "Grupos ou coletivos que pratiquem o mesmo interesse",
    "Registrar a evolução em um portfólio pessoal",
  ],
}

/**
 * TODO(ai): replace this deterministic tally with a real model call once
 * an AI provider is wired up (e.g. actions/ai.ts). Keep the
 * `(studentId) => Promise<JourneyInsight[]>` signature so callers don't
 * need to change when that happens. No information is invented here —
 * only counts derived from the student's own recorded experiences.
 */
export async function getJourneyInsights(studentId: string): Promise<JourneyInsight[]> {
  ensureSeed(studentId)

  const experiences = store.filter((experience) => experience.student_id === studentId)

  if (experiences.length === 0) {
    return []
  }

  const groupCounts = new Map<JourneyGroup, number>()
  const skillCounts = new Map<JourneySkill, number>()

  for (const experience of experiences) {
    const group = JOURNEY_CATEGORY_GROUPS[experience.category]
    groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1)
    for (const skill of experience.skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1)
    }
  }

  const topGroups = [...groupCounts.entries()].sort((a, b) => b[1] - a[1])
  const topSkills = [...skillCounts.entries()].sort((a, b) => b[1] - a[1])

  const insights: JourneyInsight[] = []

  if (topGroups.length > 0) {
    const [primaryGroup] = topGroups[0]
    const primaryGroupLabel = JOURNEY_GROUP_LABELS[primaryGroup]
    const secondarySkillLabel = topSkills[0]
      ? JOURNEY_SKILL_LABELS[topSkills[0][0]]
      : null

    insights.push({
      id: "top-group",
      title: "Padrão identificado",
      message: secondarySkillLabel
        ? `A IA identificou que você possui muitas experiências relacionadas a ${primaryGroupLabel.toLowerCase()} e ${secondarySkillLabel.toLowerCase()}.`
        : `A IA identificou que você possui muitas experiências relacionadas a ${primaryGroupLabel.toLowerCase()}.`,
      suggestions: GROUP_SUGGESTIONS[primaryGroup],
    })
  }

  if (topGroups.length > 1) {
    const [secondaryGroup] = topGroups[1]
    insights.push({
      id: "secondary-group",
      title: "Área em crescimento",
      message: `Você também vem acumulando experiências em ${JOURNEY_GROUP_LABELS[secondaryGroup].toLowerCase()} — vale continuar explorando essa frente.`,
      suggestions: GROUP_SUGGESTIONS[secondaryGroup],
    })
  }

  const draftCount = experiences.filter((experience) => experience.status === "rascunho").length
  if (draftCount > 0) {
    insights.push({
      id: "drafts-pending",
      title: "Experiências incompletas",
      message: `Você tem ${draftCount} experiência${draftCount > 1 ? "s" : ""} em rascunho. Termine o cadastro para que ela conte na sua jornada.`,
      suggestions: [],
    })
  }

  return insights
}

// --- Internal mutation helpers -------------------------------------------
// Only actions/journey.ts should import these. A real Supabase-backed
// version would replace their bodies with `supabase.from("journey_experiences")`
// calls while keeping these exact signatures.

export type NewJourneyExperienceInput = {
  student_id: string
  title: string
  category: JourneyCategory
}

export function _insertExperience(input: NewJourneyExperienceInput): JourneyExperience {
  const now = new Date().toISOString()
  const experience: JourneyExperience = {
    id: crypto.randomUUID(),
    student_id: input.student_id,
    title: input.title,
    category: input.category,
    organization: null,
    description: null,
    start_date: null,
    end_date: null,
    hours: null,
    reflection: null,
    skills: [],
    attachments: [],
    status: "rascunho",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    created_at: now,
    updated_at: now,
  }
  store.push(experience)
  return experience
}

export function _updateExperience(
  experienceId: string,
  patch: Partial<Omit<JourneyExperience, "id" | "student_id" | "created_at">>
): JourneyExperience | null {
  const index = store.findIndex((experience) => experience.id === experienceId)
  if (index === -1) {
    return null
  }
  const updated: JourneyExperience = {
    ...store[index],
    ...patch,
    updated_at: new Date().toISOString(),
  }
  store[index] = updated
  return updated
}

export function _deleteExperience(experienceId: string): boolean {
  const index = store.findIndex((experience) => experience.id === experienceId)
  if (index === -1) {
    return false
  }
  store.splice(index, 1)
  return true
}

/**
 * Future seam: a real implementation would copy a validated experience into
 * the public `portfolio_highlights` table (see lib/data/portfolio.ts). Not
 * built for this task — the "Gerar Portfólio" button links here for now.
 */
export async function promoteExperienceToPortfolio(_experienceId: string): Promise<never> {
  throw new Error("promoteExperienceToPortfolio is not implemented yet")
}
