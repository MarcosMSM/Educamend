import "server-only"

import { createClient } from "@/lib/supabase/server"
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

/** Categories treated as "project-like" for the Projetos tab and the projects stat. */
export const PROJECT_LIKE_CATEGORIES: JourneyCategory[] = [
  "projeto_pessoal",
  "hackathon",
  "robotica",
  "startup",
  "feira_ciencias",
  "empreendedorismo",
]

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
  const supabase = await createClient()

  let query = supabase.from("journey_experiences").select("*").eq("student_id", studentId)

  if (filters.category) {
    query = query.eq("category", filters.category)
  }
  if (filters.status) {
    query = query.eq("status", filters.status)
  }
  if (filters.skill) {
    query = query.contains("skills", [filters.skill])
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to load experiences: ${error.message}`)
  }

  let results = data as JourneyExperience[]

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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .select("start_date, end_date, created_at")
    .eq("student_id", studentId)

  if (error) {
    throw new Error(`Failed to load experience years: ${error.message}`)
  }

  const years = new Set(
    data.map((experience) =>
      (experience.start_date ?? experience.end_date ?? experience.created_at).slice(0, 4)
    )
  )

  return [...years].sort((a, b) => b.localeCompare(a))
}

export async function getJourneyExperienceById(
  experienceId: string
): Promise<JourneyExperience | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .select("*")
    .eq("id", experienceId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load experience: ${error.message}`)
  }

  return data as JourneyExperience | null
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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .select("category, hours, attachments, status, skills")
    .eq("student_id", studentId)
    .neq("status", "arquivada")

  if (error) {
    throw new Error(`Failed to load experience stats: ${error.message}`)
  }

  const experiences = data as Pick<
    JourneyExperience,
    "category" | "hours" | "attachments" | "status" | "skills"
  >[]

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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .select("category, skills, status")
    .eq("student_id", studentId)

  if (error) {
    throw new Error(`Failed to load experience insights: ${error.message}`)
  }

  const experiences = data as Pick<JourneyExperience, "category" | "skills" | "status">[]

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
// Only actions/journey.ts should import these.

export type NewJourneyExperienceInput = {
  student_id: string
  title: string
  category: JourneyCategory
}

export async function _insertExperience(
  input: NewJourneyExperienceInput
): Promise<JourneyExperience> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .insert({
      student_id: input.student_id,
      title: input.title,
      category: input.category,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`)
  }

  return data as JourneyExperience
}

export async function _updateExperience(
  experienceId: string,
  patch: Partial<Omit<JourneyExperience, "id" | "student_id" | "created_at">>
): Promise<JourneyExperience | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journey_experiences")
    .update(patch)
    .eq("id", experienceId)
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`)
  }

  return data as JourneyExperience | null
}

export async function _deleteExperience(experienceId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error, count } = await supabase
    .from("journey_experiences")
    .delete({ count: "exact" })
    .eq("id", experienceId)

  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`)
  }

  return (count ?? 0) > 0
}

/**
 * Future seam: a real implementation would copy a validated experience into
 * the public `portfolio_highlights` table (see lib/data/portfolio.ts). Not
 * built for this task — the "Gerar Portfólio" button links here for now.
 */
export async function promoteExperienceToPortfolio(_experienceId: string): Promise<never> {
  throw new Error("promoteExperienceToPortfolio is not implemented yet")
}
