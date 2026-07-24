import { JourneyWizard } from "@/components/journey/wizard/journey-wizard"

export default async function NewJourneyExperiencePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params

  return <JourneyWizard studentId={studentId} experience={null} step={1} />
}
