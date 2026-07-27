"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateAcademicYearSchema,
  CreateTermSchema,
  UpdateAcademicYearSchema,
  type CreateAcademicYearState,
  type CreateTermState,
  type UpdateAcademicYearState,
} from "@/lib/validation/planning"

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function buildDefaultTerms(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  const midMs = start.getTime() + (end.getTime() - start.getTime()) / 2
  const mid = new Date(midMs)
  const secondHalfStart = new Date(mid.getTime() + 24 * 60 * 60 * 1000)

  return [
    { name: "Semestre 1", start_date: toIsoDate(start), end_date: toIsoDate(mid) },
    {
      name: "Semestre 2",
      start_date: toIsoDate(secondHalfStart),
      end_date: toIsoDate(end),
    },
    { name: "Ano Completo", start_date: startDate, end_date: endDate },
  ]
}

export async function createAcademicYear(
  studentId: string,
  _state: CreateAcademicYearState,
  formData: FormData
): Promise<CreateAcademicYearState> {
  const validatedFields = CreateAcademicYearSchema.safeParse({
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { name, startDate, endDate } = validatedFields.data

  const { data: year, error } = await supabase
    .from("academic_years")
    .insert({
      student_id: studentId,
      name,
      start_date: startDate,
      end_date: endDate,
    })
    .select("id")
    .single()

  if (error || !year) {
    return { message: "Não foi possível criar o ano letivo." }
  }

  // Cria automaticamente os períodos padrão (2 semestres + Ano Completo)
  // para que o responsável já possa adicionar cursos sem precisar
  // configurar períodos manualmente antes.
  const defaultTerms = buildDefaultTerms(startDate, endDate)
  await supabase.from("terms").insert(
    defaultTerms.map((term, index) => ({
      academic_year_id: year.id,
      student_id: studentId,
      sequence: index,
      ...term,
    }))
  )

  revalidatePath(`/students/${studentId}/planning`)
}

export async function updateAcademicYear(
  studentId: string,
  _state: UpdateAcademicYearState,
  formData: FormData
): Promise<UpdateAcademicYearState> {
  const validatedFields = UpdateAcademicYearSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    gradeLevel: formData.get("gradeLevel") ?? "",
    curriculumBase: formData.get("curriculumBase") ?? "",
    curriculumBaseOther: formData.get("curriculumBaseOther") ?? "",
    ccLevel: formData.get("ccLevel") ?? "",
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const {
    academicYearId,
    name,
    startDate,
    endDate,
    status,
    gradeLevel,
    curriculumBase,
    curriculumBaseOther,
    ccLevel,
  } = validatedFields.data

  const { error } = await supabase
    .from("academic_years")
    .update({
      name,
      start_date: startDate,
      end_date: endDate,
      status,
      grade_level: gradeLevel || null,
      curriculum_base: curriculumBase || null,
      curriculum_base_other:
        curriculumBase === "outro" ? curriculumBaseOther || null : null,
      cc_level: curriculumBase === "cc" ? ccLevel || null : null,
    })
    .eq("id", academicYearId)

  if (error) {
    return { message: "Não foi possível atualizar o ano letivo." }
  }

  revalidatePath(`/students/${studentId}/planning`)
}

export async function createTerm(
  studentId: string,
  _state: CreateTermState,
  formData: FormData
): Promise<CreateTermState> {
  const validatedFields = CreateTermSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { academicYearId, name, startDate, endDate } = validatedFields.data

  const { error } = await supabase.from("terms").insert({
    academic_year_id: academicYearId,
    student_id: studentId,
    name,
    start_date: startDate,
    end_date: endDate,
  })

  if (error) {
    return { message: "Não foi possível criar o período." }
  }

  revalidatePath(`/students/${studentId}/planning`)
}
