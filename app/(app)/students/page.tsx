import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getStudents } from "@/lib/data/students"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function StudentsPage() {
  const families = await getUserFamilies()

  if (families.length === 0) {
    redirect("/onboarding/family")
  }

  const students = await getStudents()

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
        <Button render={<Link href="/students/new" />} nativeButton={false} size="sm">
          <Plus />
          Novo aluno
        </Button>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum aluno cadastrado ainda.
            </p>
            <Button render={<Link href="/students/new" />} nativeButton={false} size="sm">
              Cadastrar primeiro aluno
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Link key={student.id} href={`/students/${student.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    {student.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {student.birth_date
                      ? new Date(student.birth_date).toLocaleDateString("pt-BR")
                      : "Data de nascimento não informada"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
