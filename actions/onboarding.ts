"use server"

import { redirect } from "next/navigation"

import { getUserFamilies, requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateStudentSchema,
  type CreateStudentState,
} from "@/lib/validation/families"

export async function createFirstStudent(
  _state: CreateStudentState,
  formData: FormData
): Promise<CreateStudentState> {
  const validatedFields = CreateStudentSchema.safeParse({
    fullName: formData.get("fullName"),
    birthDate: formData.get("birthDate"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const user = await requireUser()
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    redirect("/onboarding/family")
  }

  const { fullName, birthDate, notes } = validatedFields.data
  const supabase = await createClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      full_name: fullName,
      birth_date: birthDate || null,
      notes: notes || null,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (studentError || !student) {
    return { message: "Não foi possível cadastrar o aluno. Tente novamente." }
  }

  const { error: linkError } = await supabase.from("family_students").insert({
    family_id: family.id,
    student_id: student.id,
    relationship: "student",
  })

  if (linkError) {
    return { message: "Aluno criado, mas não foi possível vinculá-lo à família." }
  }

  redirect("/dashboard?bem-vindo=1")
}
