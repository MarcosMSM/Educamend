import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { CreateStudentForm } from "@/components/students/create-student-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function NewStudentPage() {
  const families = await getUserFamilies()

  if (families.length === 0) {
    redirect("/onboarding/family")
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Novo aluno</CardTitle>
          <CardDescription>
            Cadastre um filho para começar a gerenciar os estudos dele.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateStudentForm />
        </CardContent>
      </Card>
    </div>
  )
}
