import { ChevronRight } from "lucide-react"

import { CourseForm } from "@/components/planning/course-form"
import { CreateTermForm } from "@/components/planning/create-term-form"
import { UpdateAcademicYearForm } from "@/components/planning/update-academic-year-form"
import { CourseCard } from "@/components/planning/v2/course-card"
import { Badge } from "@/components/ui/badge"
import type { getPlanningOverview } from "@/lib/data/planning"

const STATUS_LABELS: Record<string, string> = {
  planning: "Planejamento",
  active: "Em andamento",
  completed: "Concluído",
}

type Option = { id: string; name: string }
type Year = Awaited<ReturnType<typeof getPlanningOverview>>[number]

export function YearAccordion({
  studentId,
  year,
  availableSubjects,
  defaultOpen,
}: {
  studentId: string
  year: Year
  availableSubjects: Option[]
  defaultOpen?: boolean
}) {
  const totalCredits = year.creditsCompleted + year.creditsInProgress
  const progressPct =
    totalCredits > 0 ? (year.creditsCompleted / totalCredits) * 100 : 0

  return (
    <details
      className="group overflow-hidden rounded-xl border"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground select-none">
        <div className="flex flex-wrap items-center gap-3">
          <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
          <span className="font-semibold">{year.name}</span>
          <Badge variant="secondary">
            {STATUS_LABELS[year.status] ?? year.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-90">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-primary-foreground/25">
            <div
              className="h-full rounded-full bg-primary-foreground"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span>
            {year.creditsCompleted.toFixed(2)} / {totalCredits.toFixed(2)}{" "}
            créditos
          </span>
        </div>
      </summary>

      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <UpdateAcademicYearForm studentId={studentId} academicYear={year} />
          {year.terms.length > 0 && (
            <CourseForm
              studentId={studentId}
              academicYearId={year.id}
              terms={year.terms}
              availableSubjects={availableSubjects}
            />
          )}
        </div>

        {year.terms.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível criar os períodos automaticamente. Crie um
            período manualmente para começar a adicionar cursos.
          </p>
        ) : year.courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum curso cadastrado neste ano ainda.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {year.courses.map((course) => (
              <CourseCard
                key={course.id}
                studentId={studentId}
                academicYearId={year.id}
                terms={year.terms}
                availableSubjects={availableSubjects}
                course={course}
              />
            ))}
          </div>
        )}

        <div>
          <CreateTermForm studentId={studentId} academicYearId={year.id} />
        </div>
      </div>
    </details>
  )
}
