import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getAvailableSubjects } from "@/lib/data/curriculum"
import { getPlanningOverview } from "@/lib/data/planning"
import { CreateAcademicYearForm } from "@/components/planning/create-academic-year-form"
import { YearAccordion } from "@/components/planning/v2/year-accordion"

export default async function PlanningV2Page({
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
      <div>
        <Link
          href={`/students/${studentId}/planning`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Versão clássica
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Planejamento (v2)</h2>
          <p className="text-sm text-muted-foreground">
            Layout em cards, um ano letivo por vez.
          </p>
        </div>
        <CreateAcademicYearForm studentId={studentId} />
      </div>

      {years.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum ano letivo cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4">
          {years.map((year, index) => (
            <YearAccordion
              key={year.id}
              studentId={studentId}
              year={year}
              availableSubjects={availableSubjects}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
