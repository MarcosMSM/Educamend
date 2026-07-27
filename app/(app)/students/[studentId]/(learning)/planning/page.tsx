import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Church,
  Cpu,
  Diamond,
  Download,
  Dumbbell,
  FlaskConical,
  HelpCircle,
  Landmark,
  Languages,
  Palette,
  RotateCw,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getAreas } from "@/lib/data/areas"
import { getDisciplines } from "@/lib/data/disciplines"
import { getPlanningOverview } from "@/lib/data/planning"
import { GRADE_LABELS, SPECIAL_COURSE_LABELS } from "@/lib/validation/courses"
import { CURRICULUM_BASE_LABELS } from "@/lib/validation/planning"
import { CreateAcademicYearForm } from "@/components/planning/create-academic-year-form"
import { CourseForm } from "@/components/planning/course-form"
import { DeleteAcademicYearButton } from "@/components/planning/delete-academic-year-button"
import { CourseActionsMenu } from "@/components/planning/v2/course-actions-menu"
import { UpdateAcademicYearForm } from "@/components/planning/update-academic-year-form"
import { CourseStatusPill } from "@/components/planning/course-status-pill"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, relation } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  planning: "Planejamento",
  active: "Em andamento",
  completed: "Concluído",
}

const AREA_ICONS: Record<string, LucideIcon> = {
  "Arte": Palette,
  "Ciências da Natureza": FlaskConical,
  "Ciências Humanas": Landmark,
  "Educação Física": Dumbbell,
  "Ensino Religioso": Church,
  "Finanças Pessoais": Wallet,
  "Língua Estrangeira": Languages,
  "Língua Portuguesa": BookOpen,
  "Matemática": Calculator,
  "Tecnologia": Cpu,
  "Outro": HelpCircle,
}

function getAreaIcon(areaName: string | undefined) {
  return (areaName && AREA_ICONS[areaName]) || BookOpen
}

function curriculumLabel(year: {
  curriculum_base: string | null
  curriculum_base_other: string | null
  cc_level: string | null
}) {
  if (year.curriculum_base === "cc") {
    return year.cc_level ? `CC · ${year.cc_level}` : "CC"
  }
  if (year.curriculum_base === "outro") {
    return year.curriculum_base_other || "Outro"
  }
  if (year.curriculum_base === "regular") {
    return CURRICULUM_BASE_LABELS.regular
  }
  return null
}

export default async function PlanningPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { studentId } = await params
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    redirect("/onboarding/family")
  }

  const [allYears, availableAreas, availableDisciplines] = await Promise.all([
    getPlanningOverview(studentId),
    getAreas(),
    getDisciplines(),
  ])

  const sp = await searchParams
  const yearFilter = typeof sp.year === "string" ? sp.year : "all"
  const years = yearFilter === "all" ? allYears : allYears.filter((year) => year.name === yearFilter)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">
            Acompanhe disciplinas, materiais, períodos, créditos e o progresso do ano letivo.
          </p>
          <Link
            href={`/students/${studentId}/planning/v2`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Testar layout v2
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            <Link
              href="?year=all"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                yearFilter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Todos
            </Link>
            {[...allYears]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((year) => (
              <Link
                key={year.id}
                href={`?year=${encodeURIComponent(year.name)}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  yearFilter === year.name
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {year.name}
              </Link>
            ))}
          </div>
          <Link
            href={`/students/${studentId}/reports`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-sidebar px-4 text-sm font-medium text-white transition-colors hover:bg-sidebar/90"
          >
            <Download className="size-4" />
            Exportar PDF
          </Link>
          <CreateAcademicYearForm studentId={studentId} />
        </div>
      </div>

      {years.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum ano letivo cadastrado ainda.</p>
      ) : (
        years.map((year) => (
          <div key={year.id} className="overflow-hidden rounded-3xl ring-1 ring-foreground/10">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-tree-branches px-4 py-2.5 text-white">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <BookOpen className="size-4" />
                </div>
                <span className="text-sm font-semibold">{year.name}</span>
                {year.grade_level && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/90">
                    Ano Escolar: {year.grade_level}
                  </span>
                )}
                {curriculumLabel(year) && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/90">
                    Currículo: {curriculumLabel(year)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-white/80">
                  <Diamond className="size-3.5 text-tree-fruit" />
                  Créditos concluídos{" "}
                  <span className="font-semibold text-white">
                    {year.creditsCompleted.toFixed(2)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <RotateCw className="size-3.5 text-tree-fruit" />
                  Em andamento{" "}
                  <span className="font-semibold text-white">
                    {year.creditsInProgress.toFixed(2)}
                  </span>
                </span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-[var(--sidebar)]">
                  {STATUS_LABELS[year.status] ?? year.status}
                </span>
              </div>
              <div className="flex gap-1.5">
                {year.terms.length > 0 && (
                  <CourseForm
                    studentId={studentId}
                    academicYearId={year.id}
                    terms={year.terms}
                    availableAreas={availableAreas}
                    availableDisciplines={availableDisciplines}
                    triggerClassName="bg-white text-[var(--sidebar)] hover:bg-white/90"
                    triggerSize="sm"
                  />
                )}
                <UpdateAcademicYearForm studentId={studentId} academicYear={year} />
                <DeleteAcademicYearButton
                  studentId={studentId}
                  academicYearId={year.id}
                  academicYearName={year.name}
                  triggerClassName="text-white hover:bg-white/10 hover:text-white"
                />
              </div>
            </div>

            <div className="bg-card p-4">
              {year.terms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Não foi possível criar os períodos automaticamente para este ano letivo.
                </p>
              ) : year.courses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum curso cadastrado neste ano ainda.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Créditos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {year.courses.map((course) => {
                      const AreaIcon = getAreaIcon(relation(course.areas)?.name)
                      return (
                      <TableRow key={course.id}>
                        <TableCell className="whitespace-normal">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-tree-branches/15 text-tree-branches">
                              <AreaIcon className="size-4" />
                            </div>
                            <div>
                              <div className="font-medium">{course.title}</div>
                              {course.special_course &&
                                course.special_course !== "nenhum" && (
                                  <Badge variant="outline" className="mt-1">
                                    {SPECIAL_COURSE_LABELS[
                                      course.special_course as keyof typeof SPECIAL_COURSE_LABELS
                                    ] ?? course.special_course}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-normal text-sm text-muted-foreground">
                          {relation(course.areas)?.name}
                        </TableCell>
                        <TableCell className="whitespace-normal text-sm text-muted-foreground">
                          {relation(course.disciplines)?.name}
                        </TableCell>
                        <TableCell className="whitespace-normal text-sm text-muted-foreground">
                          {course.resource || "—"}
                        </TableCell>
                        <TableCell>{relation(course.terms)?.name}</TableCell>
                        <TableCell>
                          <CourseStatusPill grade={course.grade} />
                        </TableCell>
                        <TableCell>
                          {course.grade
                            ? (GRADE_LABELS[course.grade as keyof typeof GRADE_LABELS] ?? course.grade)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {course.credits ? Number(course.credits).toFixed(2) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <CourseForm
                              studentId={studentId}
                              academicYearId={year.id}
                              terms={year.terms}
                              availableAreas={availableAreas}
                              availableDisciplines={availableDisciplines}
                              course={course}
                            />
                            <CourseActionsMenu studentId={studentId} courseId={course.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
