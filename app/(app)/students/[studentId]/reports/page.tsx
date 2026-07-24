import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { getPlanningOverview } from "@/lib/data/planning"
import { getStudentById } from "@/lib/data/students"
import { ReportView } from "@/components/reports/report-view"

export default async function ReportsPage({
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

  const [student, years] = await Promise.all([
    getStudentById(studentId),
    getPlanningOverview(studentId),
  ])

  return (
    <ReportView studentName={student?.full_name ?? ""} years={years} />
  )
}
