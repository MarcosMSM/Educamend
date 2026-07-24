"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getCourseById } from "@/lib/data/courses"
import {
  CreateCourseSchema,
  UpdateCourseSchema,
  type CreateCourseState,
  type UpdateCourseState,
} from "@/lib/validation/courses"

export async function createCourse(
  studentId: string,
  _state: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const validatedFields = CreateCourseSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    termId: formData.get("termId"),
    subjectId: formData.get("subjectId"),
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
    subjectId,
    title,
    resource,
    specialCourse,
    grade,
    credits,
    notes,
  } = validatedFields.data

  const { error } = await supabase.from("courses").insert({
    student_id: studentId,
    academic_year_id: academicYearId,
    term_id: termId,
    subject_id: subjectId,
    title,
    resource: resource || null,
    special_course: specialCourse || null,
    grade: grade || null,
    credits: credits === "" || credits === undefined ? null : credits,
    notes: notes || null,
  })

  if (error) {
    return { message: "Não foi possível salvar o curso." }
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
    subjectId: formData.get("subjectId"),
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
    subjectId,
    title,
    resource,
    specialCourse,
    grade,
    credits,
    notes,
  } = validatedFields.data

  const { error } = await supabase
    .from("courses")
    .update({
      term_id: termId,
      subject_id: subjectId,
      title,
      resource: resource || null,
      special_course: specialCourse || null,
      grade: grade || null,
      credits: credits === "" || credits === undefined ? null : credits,
      notes: notes || null,
    })
    .eq("id", courseId)

  if (error) {
    return { message: "Não foi possível atualizar o curso." }
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
    subject_id: course.subject_id,
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
