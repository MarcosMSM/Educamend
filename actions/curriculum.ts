"use server"

import { revalidatePath } from "next/cache"

import { getUserFamilies, requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  AddSubjectToCurriculumSchema,
  CreateCurriculumSchema,
  type AddSubjectState,
  type CreateCurriculumState,
} from "@/lib/validation/curriculum"

export async function createCurriculum(
  studentId: string,
  _state: CreateCurriculumState,
  formData: FormData
): Promise<CreateCurriculumState> {
  const validatedFields = CreateCurriculumSchema.safeParse({
    name: formData.get("name"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const user = await requireUser()
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    return { message: "Você precisa fazer parte de uma família primeiro." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("curricula").insert({
    family_id: family.id,
    name: validatedFields.data.name,
    created_by: user.id,
  })

  if (error) {
    return { message: "Não foi possível criar o currículo." }
  }

  revalidatePath(`/students/${studentId}/curriculum`)
}

export async function addSubjectToCurriculum(
  studentId: string,
  _state: AddSubjectState,
  formData: FormData
): Promise<AddSubjectState> {
  const validatedFields = AddSubjectToCurriculumSchema.safeParse({
    curriculumId: formData.get("curriculumId"),
    existingSubjectId: formData.get("existingSubjectId"),
    newSubjectName: formData.get("newSubjectName"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  const { curriculumId, existingSubjectId, newSubjectName } =
    validatedFields.data

  if (!existingSubjectId && !newSubjectName) {
    return {
      errors: { newSubjectName: ["Selecione ou crie uma disciplina."] },
    }
  }

  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    return { message: "Você precisa fazer parte de uma família primeiro." }
  }

  const supabase = await createClient()
  let subjectId = existingSubjectId

  if (!subjectId && newSubjectName) {
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .insert({ family_id: family.id, name: newSubjectName })
      .select("id")
      .single()

    if (subjectError || !subject) {
      return { message: "Não foi possível criar a disciplina." }
    }

    subjectId = subject.id
  }

  const { error: linkError } = await supabase
    .from("curriculum_subjects")
    .insert({ curriculum_id: curriculumId, subject_id: subjectId })

  if (linkError) {
    return { message: "Não foi possível adicionar a disciplina ao currículo." }
  }

  revalidatePath(`/students/${studentId}/curriculum`)
}

export async function removeSubjectFromCurriculum(
  studentId: string,
  curriculumId: string,
  subjectId: string
) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from("curriculum_subjects")
    .delete()
    .eq("curriculum_id", curriculumId)
    .eq("subject_id", subjectId)

  if (error) {
    throw new Error("Não foi possível remover a disciplina do currículo.")
  }

  revalidatePath(`/students/${studentId}/curriculum`)
}
