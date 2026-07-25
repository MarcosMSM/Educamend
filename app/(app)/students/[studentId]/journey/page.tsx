import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { getStudentById } from "@/lib/data/students"
import { getAcademicYears } from "@/lib/data/planning"
import {
  getJourneyExperienceById,
  getJourneyExperiences,
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
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/journey/empty-state"
import { ExperienceDetailSheet } from "@/components/journey/detail/experience-detail-sheet"
import { SearchFilterBar } from "@/components/journey/filters/search-filter-bar"
import { ShareJourneyButton } from "@/components/journey/share-journey-button"
import { StudentHeroBanner } from "@/components/students/student-hero-banner"
import { CreateExperienceDialog } from "@/components/journey/v2/create-experience-dialog"
import { ExperienceSummaryBar } from "@/components/journey/v2/experience-summary-bar"
import { ExperienceTimelineV2 } from "@/components/journey/v2/experience-timeline-v2"

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

  const student = await getStudentById(studentId)
  if (!student) {
    notFound()
  }

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

  const [years, experiences, stats, availableYears] = await Promise.all([
    getAcademicYears(studentId),
    getJourneyExperiences(studentId, filters),
    getJourneyStats(studentId),
    getJourneyYears(studentId),
  ])

  const experienceIdParam = readString(sp.experience)
  const selectedExperience = experienceIdParam
    ? (experiences.find((experience) => experience.id === experienceIdParam) ??
      (await getJourneyExperienceById(experienceIdParam)))
    : null

  const baseQuery = new URLSearchParams({
    ...(search ? { q: search } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    ...(skill ? { skill } : {}),
    ...(period ? { period } : {}),
  }).toString()

  const basePath = `/students/${studentId}/journey`
  const viewHrefFor = (experienceId: string) =>
    `${basePath}?${baseQuery}${baseQuery ? "&" : ""}experience=${experienceId}`

  return (
    <div className="grid gap-6">
      <StudentHeroBanner
        studentId={studentId}
        studentName={student.full_name}
        gradeLevel={student.grade_level}
        avatarUrl={student.avatar_url}
        years={years.map((year) => ({ id: year.id, name: year.name, status: year.status }))}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-xs font-semibold tracking-wide text-tree-branches uppercase">
            Jornada · Experiências
          </p>
          <p className="text-sm text-muted-foreground">
            Registre trabalhos, intercâmbios, voluntariado, serviço, projetos e vivências que
            contribuíram para o desenvolvimento do estudante.
          </p>
          <Link
            href={`/students/${studentId}/journey/old`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Ver versão anterior
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            render={<Link href={`/students/${studentId}/portfolio/generate`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            Gerar portfólio
          </Button>
          <ShareJourneyButton studentId={studentId} />
        </div>
      </div>

      <ExperienceSummaryBar stats={stats} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CreateExperienceDialog studentId={studentId} />
        <div className="sm:flex-1">
          <SearchFilterBar availableYears={availableYears} />
        </div>
      </div>

      {experiences.length === 0 ? (
        <EmptyState
          title="Nenhuma experiência encontrada"
          description="Ajuste os filtros ou registre uma nova experiência para vê-la na sua linha do tempo."
          actionHref={basePath}
          actionLabel="Limpar filtros"
        />
      ) : (
        <ExperienceTimelineV2 experiences={experiences} viewHrefFor={viewHrefFor} />
      )}

      <ExperienceDetailSheet experience={selectedExperience} studentId={studentId} />
    </div>
  )
}
