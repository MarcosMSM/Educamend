"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { getUserFamilies, requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateStudentSchema,
  UpdateStudentGradeLevelSchema,
  type CreateStudentState,
  type UpdateStudentGradeLevelState,
} from "@/lib/validation/families"

export async function createStudent(
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

  redirect(`/students/${student.id}`)
}

export async function updateStudentGradeLevel(
  studentId: string,
  _state: UpdateStudentGradeLevelState,
  formData: FormData
): Promise<UpdateStudentGradeLevelState> {
  const validatedFields = UpdateStudentGradeLevelSchema.safeParse({
    gradeLevel: formData.get("gradeLevel"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from("students")
    .update({ grade_level: validatedFields.data.gradeLevel || null })
    .eq("id", studentId)

  if (error) {
    return { message: "Não foi possível salvar a série/ano." }
  }

  revalidatePath(`/students/${studentId}`)
}

export async function deleteStudent(studentId: string) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase.from("students").delete().eq("id", studentId)

  if (error) {
    throw new Error("Não foi possível remover o aluno.")
  }

  revalidatePath("/students")
  redirect("/students")
}
