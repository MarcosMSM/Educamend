import { notFound } from "next/navigation"

import { getStudentById } from "@/lib/data/students"

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const student = await getStudentById(studentId)

  if (!student) {
    notFound()
  }

  return <div className="grid gap-6">{children}</div>
}
