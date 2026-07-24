import { notFound } from "next/navigation"

import { getJourneyExperienceById } from "@/lib/data/journey"
import { JourneyWizard } from "@/components/journey/wizard/journey-wizard"
import { WIZARD_STEP_COUNT } from "@/components/journey/wizard/wizard-steps"

export default async function EditJourneyExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string; experienceId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { studentId, experienceId } = await params
  const experience = await getJourneyExperienceById(experienceId)

  if (!experience || experience.student_id !== studentId) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const stepParam = Number(resolvedSearchParams.step)
  const step =
    Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= WIZARD_STEP_COUNT
      ? stepParam
      : 2

  return <JourneyWizard studentId={studentId} experience={experience} step={step} />
}
