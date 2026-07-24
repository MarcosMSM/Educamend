import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { CreateFirstStudentForm } from "@/components/onboarding/create-first-student-form"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function OnboardingStudentPage() {
  const families = await getUserFamilies()

  if (families.length === 0) {
    redirect("/onboarding/family")
  }

  return (
    <div>
      <StepIndicator current={3} total={3} label="Primeiro filho" />
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            Quase lá! Vamos cadastrar seu primeiro filho
          </CardTitle>
          <CardDescription className="text-base">
            Depois disso você já pode começar a organizar currículo, notas e
            projetos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <CreateFirstStudentForm />
        </CardContent>
      </Card>
    </div>
  )
}
