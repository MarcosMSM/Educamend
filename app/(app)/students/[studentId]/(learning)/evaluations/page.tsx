import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { getAvailableSubjects } from "@/lib/data/curriculum"
import { getEvaluationsByStudent } from "@/lib/data/evaluations"
import { getTermsForStudent } from "@/lib/data/planning"
import { CreateEvaluationForm } from "@/components/evaluations/create-evaluation-form"
import { EvaluationRow } from "@/components/evaluations/evaluation-row"

export default async function EvaluationsPage({
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

  const [evaluations, availableSubjects, terms] = await Promise.all([
    getEvaluationsByStudent(studentId),
    getAvailableSubjects(family.id),
    getTermsForStudent(studentId),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Avaliações</h2>
        <CreateEvaluationForm
          studentId={studentId}
          availableSubjects={availableSubjects}
          terms={terms}
        />
      </div>

      {evaluations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma avaliação lançada ainda.
        </p>
      ) : (
        <div className="grid gap-3">
          {evaluations.map((evaluation) => (
            <EvaluationRow
              key={evaluation.id}
              studentId={studentId}
              evaluation={evaluation}
            />
          ))}
        </div>
      )}
    </div>
  )
}
