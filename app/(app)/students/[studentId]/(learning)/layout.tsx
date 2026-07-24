import { LearningTabs } from "@/components/students/learning-tabs"

export default async function LearningLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params

  return (
    <div className="grid gap-4">
      <LearningTabs studentId={studentId} />
      {children}
    </div>
  )
}
