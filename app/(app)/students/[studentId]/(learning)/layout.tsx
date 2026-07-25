import { notFound } from "next/navigation"

import { getStudentById } from "@/lib/data/students"
import { getAcademicYears } from "@/lib/data/planning"
import { StudentHeroBanner } from "@/components/students/student-hero-banner"
import { LearningTabs } from "@/components/students/learning-tabs"

export default async function LearningLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const [student, years] = await Promise.all([
    getStudentById(studentId),
    getAcademicYears(studentId),
  ])

  if (!student) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <StudentHeroBanner
        studentId={studentId}
        studentName={student.full_name}
        gradeLevel={student.grade_level}
        avatarUrl={student.avatar_url}
        years={years.map((year) => ({ id: year.id, name: year.name, status: year.status }))}
      />
      <LearningTabs studentId={studentId} />
      {children}
    </div>
  )
}
