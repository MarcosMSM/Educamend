import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { getStudents } from "@/lib/data/students"
import { CreateFamilyForm } from "@/components/families/create-family-form"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function OnboardingFamilyPage() {
  const families = await getUserFamilies()

  if (families.length > 0) {
    const students = await getStudents()
    redirect(students.length > 0 ? "/dashboard" : "/onboarding/student")
  }

  return (
    <div>
      <StepIndicator current={2} total={3} label="Sua família" />
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Como se chama sua família?</CardTitle>
          <CardDescription className="text-base">
            É só um nome para organizar tudo. Você poderá cadastrar seus
            filhos logo em seguida.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <CreateFamilyForm />
        </CardContent>
      </Card>
    </div>
  )
}
