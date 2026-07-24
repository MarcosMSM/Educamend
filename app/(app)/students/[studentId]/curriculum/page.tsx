import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import {
  getAvailableSubjects,
  getCurricula,
  getCurriculumSubjects,
} from "@/lib/data/curriculum"
import { CreateCurriculumForm } from "@/components/curriculum/create-curriculum-form"
import { AddSubjectForm } from "@/components/curriculum/add-subject-form"
import { RemoveSubjectButton } from "@/components/curriculum/remove-subject-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { relation } from "@/lib/utils"

export default async function CurriculumPage({
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

  const [curricula, availableSubjects] = await Promise.all([
    getCurricula(family.id),
    getAvailableSubjects(family.id),
  ])

  const curriculaWithSubjects = await Promise.all(
    curricula.map(async (curriculum) => ({
      ...curriculum,
      subjects: await getCurriculumSubjects(curriculum.id),
    }))
  )

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo currículo</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCurriculumForm studentId={studentId} />
        </CardContent>
      </Card>

      {curriculaWithSubjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum currículo cadastrado ainda para a família.
        </p>
      ) : (
        curriculaWithSubjects.map((curriculum) => (
          <Card key={curriculum.id}>
            <CardHeader>
              <CardTitle className="text-base">{curriculum.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {curriculum.subjects.length > 0 && (
                <ul className="grid gap-2">
                  {curriculum.subjects.map((entry) => (
                    <li
                      key={entry.subject_id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      {relation(entry.subjects)?.name ?? "Disciplina"}
                      <RemoveSubjectButton
                        studentId={studentId}
                        curriculumId={curriculum.id}
                        subjectId={entry.subject_id}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <AddSubjectForm
                studentId={studentId}
                curriculumId={curriculum.id}
                availableSubjects={availableSubjects}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
