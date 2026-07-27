"use client"

import { useMemo, useState } from "react"
import { Printer } from "lucide-react"

import type { getPlanningOverview } from "@/lib/data/planning"
import { GRADE_LABELS, SPECIAL_COURSE_LABELS } from "@/lib/validation/courses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type Years = Awaited<ReturnType<typeof getPlanningOverview>>

export function ReportView({
  studentName,
  years,
}: {
  studentName: string
  years: Years
}) {
  const [selectedYearIds, setSelectedYearIds] = useState(
    () => new Set(years.map((year) => year.id))
  )

  const visibleYears = useMemo(
    () => years.filter((year) => selectedYearIds.has(year.id)),
    [years, selectedYearIds]
  )

  function toggleYear(yearId: string) {
    setSelectedYearIds((current) => {
      const next = new Set(current)
      if (next.has(yearId)) {
        next.delete(yearId)
      } else {
        next.add(yearId)
      }
      return next
    })
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Relatório de planejamento</h2>
          <p className="text-sm text-muted-foreground">
            {studentName} · Gerado em{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 print:hidden">
          {years.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {years.map((year) => (
                <label
                  key={year.id}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedYearIds.has(year.id)}
                    onChange={() => toggleYear(year.id)}
                  />
                  {year.name}
                </label>
              ))}
            </div>
          )}
          <Button size="sm" onClick={() => window.print()}>
            <Printer />
            Exportar PDF
          </Button>
        </div>
      </div>

      {years.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum ano letivo cadastrado ainda.
        </p>
      ) : visibleYears.length === 0 ? (
        <p className="text-sm text-muted-foreground print:hidden">
          Nenhum ano letivo selecionado no filtro acima.
        </p>
      ) : (
        visibleYears.map((year) => (
          <div
            key={year.id}
            className="overflow-hidden rounded-xl border print:break-inside-avoid"
          >
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
            </div>

            <div className="p-4">
              {year.courses.length === 0 ? (
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {year.courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="whitespace-normal">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {relation(course.disciplines)?.name}
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
                          {course.credits
                            ? Number(course.credits).toFixed(2)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
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
