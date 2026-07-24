import {
  getJourneyExperienceById,
  getJourneyExperiences,
  getJourneyInsights,
  getJourneyStats,
  getJourneyYears,
  type JourneyFilters,
} from "@/lib/data/journey"
import {
  JOURNEY_CATEGORIES,
  JOURNEY_SKILLS,
  JOURNEY_STATUSES,
  type JourneyCategory,
  type JourneySkill,
  type JourneyStatus,
} from "@/lib/validation/journey"

import { AiInsightsCard } from "@/components/journey/overview/ai-insights-card"
import { DocumentsTab } from "@/components/journey/documents-tab"
import { EmptyState } from "@/components/journey/empty-state"
import { ExperienceDetailSheet } from "@/components/journey/detail/experience-detail-sheet"
import { SearchFilterBar } from "@/components/journey/filters/search-filter-bar"
import { JourneyHeader } from "@/components/journey/journey-header"
import { JOURNEY_TABS, JourneyTabs, type JourneyTabValue } from "@/components/journey/journey-tabs"
import { ProjectsTab } from "@/components/journey/projects-tab"
import { SkillsTab } from "@/components/journey/skills-tab"
import { StatCards } from "@/components/journey/stat-cards"
import { JourneyTimeline } from "@/components/journey/timeline/journey-timeline"

function readString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined
}

export default async function JourneyPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { studentId } = await params
  const sp = await searchParams

  const tabParam = readString(sp.tab)
  const tab: JourneyTabValue = JOURNEY_TABS.some((item) => item.value === tabParam)
    ? (tabParam as JourneyTabValue)
    : "overview"

  const search = readString(sp.q)
  const categoryParam = readString(sp.category)
  const category = JOURNEY_CATEGORIES.includes(categoryParam as JourneyCategory)
    ? (categoryParam as JourneyCategory)
    : undefined
  const statusParam = readString(sp.status)
  const status = JOURNEY_STATUSES.includes(statusParam as JourneyStatus)
    ? (statusParam as JourneyStatus)
    : undefined
  const skillParam = readString(sp.skill)
  const skill = JOURNEY_SKILLS.includes(skillParam as JourneySkill)
    ? (skillParam as JourneySkill)
    : undefined
  const period = readString(sp.period)

  const filters: JourneyFilters = { search, category, status, skill, period }

  const [experiences, stats, insights, availableYears] = await Promise.all([
    getJourneyExperiences(studentId, filters),
    getJourneyStats(studentId),
    getJourneyInsights(studentId),
    getJourneyYears(studentId),
  ])

  const experienceIdParam = readString(sp.experience)
  const selectedExperience = experienceIdParam
    ? (experiences.find((experience) => experience.id === experienceIdParam) ??
      (await getJourneyExperienceById(experienceIdParam)))
    : null

  const baseQuery = new URLSearchParams({
    tab,
    ...(search ? { q: search } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    ...(skill ? { skill } : {}),
    ...(period ? { period } : {}),
  }).toString()

  const basePath = `/students/${studentId}/journey`
  const viewHrefFor = (experienceId: string) =>
    `${basePath}?${baseQuery}&experience=${experienceId}`

  return (
    <div className="grid gap-6">
      <JourneyHeader studentId={studentId} />

      <StatCards stats={stats} />

      <JourneyTabs activeTab={tab} studentId={studentId} />

      {tab === "overview" && (
        <div className="grid gap-6">
          <AiInsightsCard insights={insights} />
          {experiences.length === 0 ? (
            <EmptyState
              title="Sua jornada está esperando a primeira experiência"
              description="Registre hackathons, projetos, voluntariado, cursos e outras experiências marcantes para começar a construir sua linha do tempo."
              actionHref={`${basePath}/new`}
              actionLabel="Registrar experiência"
            />
          ) : (
            <div className="grid gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Experiências recentes
              </h2>
              <JourneyTimeline experiences={experiences.slice(0, 4)} viewHrefFor={viewHrefFor} />
            </div>
          )}
        </div>
      )}

      {tab === "timeline" && (
        <div className="grid gap-4">
          <SearchFilterBar availableYears={availableYears} />
          {experiences.length === 0 ? (
            <EmptyState
              title="Nenhuma experiência encontrada"
              description="Ajuste os filtros ou registre uma nova experiência para vê-la na sua linha do tempo."
              actionHref={`${basePath}/new`}
              actionLabel="Registrar experiência"
            />
          ) : (
            <JourneyTimeline experiences={experiences} viewHrefFor={viewHrefFor} />
          )}
        </div>
      )}

      {tab === "projects" && (
        <ProjectsTab experiences={experiences} viewHrefFor={viewHrefFor} />
      )}

      {tab === "skills" && <SkillsTab experiences={experiences} />}

      {tab === "documents" && (
        <DocumentsTab experiences={experiences} viewHrefFor={viewHrefFor} />
      )}

      <ExperienceDetailSheet experience={selectedExperience} studentId={studentId} />
    </div>
  )
}
