import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getAvailableSubjects } from "@/lib/data/curriculum"
import { getPlanningOverview } from "@/lib/data/planning"
import { GRADE_LABELS, SPECIAL_COURSE_LABELS } from "@/lib/validation/courses"
import { CreateAcademicYearForm } from "@/components/planning/create-academic-year-form"
import { CreateTermForm } from "@/components/planning/create-term-form"
import { CourseForm } from "@/components/planning/course-form"
import { DeleteCourseButton } from "@/components/planning/delete-course-button"
import { CopyCourseButton } from "@/components/planning/copy-course-button"
import { UpdateAcademicYearForm } from "@/components/planning/update-academic-year-form"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { relation } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  planning: "Planejamento",
  active: "Em andamento",
  completed: "Concluído",
}

export default async function PlanningPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    redirect("/onboarding/family")
  }

  const [years, availableSubjects] = await Promise.all([
    getPlanningOverview(studentId),
    getAvailableSubjects(family.id),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Planejamento</h2>
          <p className="text-sm text-muted-foreground">
            Ano letivo, cursos, materiais e notas em um só lugar.
          </p>
          <Link
            href={`/students/${studentId}/planning/v2`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Testar layout v2
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <CreateAcademicYearForm studentId={studentId} />
      </div>

      {years.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum ano letivo cadastrado ainda.
        </p>
      ) : (
        years.map((year) => (
          <div key={year.id} className="overflow-hidden rounded-xl border">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold">{year.name}</span>
                <span className="text-sm opacity-90">
                  Créditos concluídos: {year.creditsCompleted.toFixed(2)}
                </span>
                <span className="text-sm opacity-90">
                  Em andamento: {year.creditsInProgress.toFixed(2)}
                </span>
                <Badge variant="secondary">
                  {STATUS_LABELS[year.status] ?? year.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                {year.terms.length > 0 && (
                  <CourseForm
                    studentId={studentId}
                    academicYearId={year.id}
                    terms={year.terms}
                    availableSubjects={availableSubjects}
                  />
                )}
                <UpdateAcademicYearForm
                  studentId={studentId}
                  academicYear={year}
                />
              </div>
            </div>

            <div className="p-4">
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Créditos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {year.courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="whitespace-normal">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {relation(course.subjects)?.name}
                          </div>
                          {course.special_course &&
                            course.special_course !== "nenhum" && (
                              <Badge variant="outline" className="mt-1">
                                {SPECIAL_COURSE_LABELS[
                                  course.special_course as keyof typeof SPECIAL_COURSE_LABELS
                                ] ?? course.special_course}
                              </Badge>
                            )}
                        </TableCell>
                        <TableCell className="whitespace-normal text-sm text-muted-foreground">
                          {course.resource || "—"}
                        </TableCell>
                        <TableCell>{relation(course.terms)?.name}</TableCell>
                        <TableCell>
                          {course.grade ? (
                            <Badge>
                              {GRADE_LABELS[
                                course.grade as keyof typeof GRADE_LABELS
                              ] ?? course.grade}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
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
                              availableSubjects={availableSubjects}
                              course={course}
                            />
                            <CopyCourseButton
                              studentId={studentId}
                              courseId={course.id}
                            />
                            <DeleteCourseButton
                              studentId={studentId}
                              courseId={course.id}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="mt-3">
                <CreateTermForm studentId={studentId} academicYearId={year.id} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
