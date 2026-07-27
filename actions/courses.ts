"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getCourseById } from "@/lib/data/courses"
import {
  CreateCourseSchema,
  NEW_DISCIPLINE_VALUE,
  UpdateCourseSchema,
  type CreateCourseState,
  type UpdateCourseState,
} from "@/lib/validation/courses"

type Supabase = Awaited<ReturnType<typeof createClient>>

async function resolveDisciplineId(
  supabase: Supabase,
  areaId: string,
  disciplineId: string,
  newDisciplineName: string | undefined
): Promise<{ disciplineId: string } | { error: CreateCourseState }> {
  if (disciplineId !== NEW_DISCIPLINE_VALUE) {
    return { disciplineId }
  }

  const name = newDisciplineName?.trim()
  if (!name) {
    return {
      error: {
        errors: { newDisciplineName: ["Informe o nome da nova disciplina."] },
      },
    }
  }

  const { error: insertError } = await supabase
    .from("disciplines")
    .upsert(
      { area_id: areaId, name },
      { onConflict: "area_id,name", ignoreDuplicates: true }
    )

  if (insertError) {
    console.error("resolveDisciplineId upsert error", insertError)
    return {
      error: {
        message: `Não foi possível criar a disciplina. (${insertError.message})`,
      },
    }
  }

  const { data, error: selectError } = await supabase
    .from("disciplines")
    .select("id")
    .eq("area_id", areaId)
    .eq("name", name)
    .single()

  if (selectError || !data) {
    console.error("resolveDisciplineId select error", selectError)
    return {
      error: {
        message: `Não foi possível criar a disciplina. (${selectError?.message})`,
      },
    }
  }

  return { disciplineId: data.id }
}

export async function createCourse(
  studentId: string,
  _state: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const validatedFields = CreateCourseSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    termId: formData.get("termId"),
    areaId: formData.get("areaId"),
    disciplineId: formData.get("disciplineId"),
    newDisciplineName: formData.get("newDisciplineName") ?? "",
    title: formData.get("title"),
    resource: formData.get("resource"),
    specialCourse: formData.get("specialCourse"),
    grade: formData.get("grade"),
    credits: formData.get("credits"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const {
    academicYearId,
    termId,
    areaId,
    disciplineId,
    newDisciplineName,
    title,
    resource,
    specialCourse,
    grade,
    credits,
    notes,
  } = validatedFields.data

  const resolved = await resolveDisciplineId(
    supabase,
    areaId,
    disciplineId,
    newDisciplineName
  )
  if ("error" in resolved) {
    return resolved.error
  }

  const { error } = await supabase.from("courses").insert({
    student_id: studentId,
    academic_year_id: academicYearId,
    term_id: termId,
    area_id: areaId,
    discipline_id: resolved.disciplineId,
    title,
    resource: resource || null,
    special_course: specialCourse || null,
    grade: grade || null,
    credits: credits === "" || credits === undefined ? null : credits,
    notes: notes || null,
  })

  if (error) {
    console.error("createCourse insert error", error)
    return { message: `Não foi possível salvar o curso. (${error.message})` }
  }

  revalidatePath(`/students/${studentId}/planning`)
}

export async function updateCourse(
  studentId: string,
  _state: UpdateCourseState,
  formData: FormData
): Promise<UpdateCourseState> {
  const validatedFields = UpdateCourseSchema.safeParse({
    courseId: formData.get("courseId"),
    academicYearId: formData.get("academicYearId"),
    termId: formData.get("termId"),
    areaId: formData.get("areaId"),
    disciplineId: formData.get("disciplineId"),
    newDisciplineName: formData.get("newDisciplineName") ?? "",
    title: formData.get("title"),
    resource: formData.get("resource"),
    specialCourse: formData.get("specialCourse"),
    grade: formData.get("grade"),
    credits: formData.get("credits"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const {
    courseId,
    termId,
    areaId,
    disciplineId,
    newDisciplineName,
    title,
    resource,
    specialCourse,
    grade,
    credits,
    notes,
  } = validatedFields.data

  const resolved = await resolveDisciplineId(
    supabase,
    areaId,
    disciplineId,
    newDisciplineName
  )
  if ("error" in resolved) {
    return resolved.error
  }

  const { error } = await supabase
    .from("courses")
    .update({
      term_id: termId,
      area_id: areaId,
      discipline_id: resolved.disciplineId,
      title,
      resource: resource || null,
      special_course: specialCourse || null,
      grade: grade || null,
      credits: credits === "" || credits === undefined ? null : credits,
      notes: notes || null,
    })
    .eq("id", courseId)

  if (error) {
    console.error("updateCourse update error", error)
    return {
      message: `Não foi possível atualizar o curso. (${error.message})`,
    }
  }

  revalidatePath(`/students/${studentId}/planning`)
}

export async function duplicateCourse(studentId: string, courseId: string) {
  await requireUser()
  const supabase = await createClient()

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error("Curso não encontrado.")
  }

  const { error } = await supabase.from("courses").insert({
    student_id: course.student_id,
    academic_year_id: course.academic_year_id,
    term_id: course.term_id,
    area_id: course.area_id,
    discipline_id: course.discipline_id,
    title: course.title,
    resource: course.resource,
    special_course: course.special_course,
    grade: course.grade,
    credits: course.credits,
    notes: course.notes,
  })

  if (error) {
    throw new Error("Não foi possível copiar o curso.")
  }

  revalidatePath(`/students/${studentId}/planning`)
}

export async function deleteCourse(studentId: string, courseId: string) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase.from("courses").delete().eq("id", courseId)

  if (error) {
    throw new Error("Não foi possível remover o curso.")
  }

  revalidatePath(`/students/${studentId}/planning`)
}
