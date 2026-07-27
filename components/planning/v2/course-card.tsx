import { CourseForm } from "@/components/planning/course-form"
import { CourseActionsMenu } from "@/components/planning/v2/course-actions-menu"
import { Badge } from "@/components/ui/badge"
import type { getCoursesByAcademicYear } from "@/lib/data/courses"
import { GRADE_LABELS, SPECIAL_COURSE_LABELS } from "@/lib/validation/courses"
import { relation } from "@/lib/utils"

type Option = { id: string; name: string }
type DisciplineOption = Option & { area_id: string }
type Course = Awaited<ReturnType<typeof getCoursesByAcademicYear>>[number]

export function CourseCard({
  studentId,
  academicYearId,
  terms,
  availableAreas,
  availableDisciplines,
  course,
}: {
  studentId: string
  academicYearId: string
  terms: Option[]
  availableAreas: Option[]
  availableDisciplines: DisciplineOption[]
  course: Course
}) {
  return (
    <div className="grid gap-2 rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium">{course.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {relation(course.disciplines)?.name}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <CourseForm
            studentId={studentId}
            academicYearId={academicYearId}
            terms={terms}
            availableAreas={availableAreas}
            availableDisciplines={availableDisciplines}
            course={course}
          />
          <CourseActionsMenu studentId={studentId} courseId={course.id} />
        </div>
      </div>

      {course.resource && (
        <p className="text-sm text-muted-foreground">{course.resource}</p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{relation(course.terms)?.name}</Badge>
        {course.grade ? (
          <Badge>
            {GRADE_LABELS[course.grade as keyof typeof GRADE_LABELS] ??
              course.grade}
          </Badge>
        ) : (
          <Badge variant="outline">Sem nota</Badge>
        )}
        {course.special_course && course.special_course !== "nenhum" && (
          <Badge variant="outline">
            {SPECIAL_COURSE_LABELS[
              course.special_course as keyof typeof SPECIAL_COURSE_LABELS
            ] ?? course.special_course}
          </Badge>
        )}
        {course.credits ? (
          <span className="ml-auto text-sm font-medium">
            {Number(course.credits).toFixed(2)} créditos
          </span>
        ) : null}
      </div>
    </div>
  )
}
