"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { getUserFamilies, requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateStudentSchema,
  UpdateStudentProfileSchema,
  type CreateStudentState,
  type UpdateStudentProfileState,
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

export async function updateStudentProfile(
  studentId: string,
  _state: UpdateStudentProfileState,
  formData: FormData
): Promise<UpdateStudentProfileState> {
  const validatedFields = UpdateStudentProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    gradeLevel: formData.get("gradeLevel"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { fullName, gradeLevel } = validatedFields.data

  const updates: { full_name: string; grade_level: string | null; avatar_path?: string | null } = {
    full_name: fullName,
    grade_level: gradeLevel || null,
  }

  const removeAvatar = formData.get("removeAvatar") === "true"
  const file = formData.get("avatar")

  if (file instanceof File && file.size > 0) {
    const { data: current } = await supabase
      .from("students")
      .select("avatar_path")
      .eq("id", studentId)
      .maybeSingle()

    const extension = file.name.includes(".") ? `.${file.name.split(".").pop()}` : ""
    const path = `${studentId}/${crypto.randomUUID()}${extension}`
    const { error: uploadError } = await supabase.storage
      .from("student-avatars")
      .upload(path, file)

    if (uploadError) {
      return { message: "Não foi possível enviar a foto." }
    }

    if (current?.avatar_path) {
      await supabase.storage.from("student-avatars").remove([current.avatar_path])
    }

    updates.avatar_path = path
  } else if (removeAvatar) {
    const { data: current } = await supabase
      .from("students")
      .select("avatar_path")
      .eq("id", studentId)
      .maybeSingle()

    if (current?.avatar_path) {
      await supabase.storage.from("student-avatars").remove([current.avatar_path])
    }

    updates.avatar_path = null
  }

  const { error } = await supabase.from("students").update(updates).eq("id", studentId)

  if (error) {
    return { message: "Não foi possível salvar o perfil." }
  }

  revalidatePath(`/students/${studentId}`)
  revalidatePath("/dashboard")
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
