import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpen, Compass, Trophy } from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getStudentById } from "@/lib/data/students"
import { getDailyStudentQuote } from "@/lib/student-quotes"
import { initials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteStudentButton } from "@/components/students/delete-student-button"
import { EditGradeLevelForm } from "@/components/students/edit-grade-level-form"

const ACTIONS = [
  {
    icon: BookOpen,
    title: "Aprendizagem",
    description: "Continuar estudos",
    href: (id: string) => `/students/${id}/planning`,
  },
  {
    icon: Compass,
    title: "Experiências",
    description: "Registrar nova experiência",
    href: (id: string) => `/students/${id}/journey/new`,
  },
  {
    icon: Trophy,
    title: "Portfólio",
    description: "Gerar portfólio",
    href: (id: string) => `/students/${id}/portfolio/generate`,
  },
] as const

export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const [student, families] = await Promise.all([getStudentById(studentId), getUserFamilies()])

  if (!student) {
    notFound()
  }

  const city = families[0]?.city ?? null
  const quote = getDailyStudentQuote()

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <Avatar size="lg">
          <AvatarFallback className="text-lg">{initials(student.full_name)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{student.full_name}</h1>
          <p className="max-w-md text-sm text-muted-foreground italic">&quot;{quote}&quot;</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{student.grade_level || "Série não informada"}</span>
          <EditGradeLevelForm studentId={studentId} gradeLevel={student.grade_level} />
          {city && (
            <>
              <span>·</span>
              <span>{city}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          O que você deseja fazer hoje?
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {ACTIONS.map(({ icon: Icon, title, description, href }) => (
            <Link key={title} href={href(studentId)}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="grid gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-heading font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {student.notes || "Nenhuma observação cadastrada."}
          </p>
        </CardContent>
      </Card>

      <div>
        <DeleteStudentButton studentId={student.id} studentName={student.full_name} />
      </div>
    </div>
  )
}
