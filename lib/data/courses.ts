import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getCoursesByAcademicYear(academicYearId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, resource, special_course, grade, credits, notes, term_id, subject_id, subjects(id, name), terms(id, name)"
    )
    .eq("academic_year_id", academicYearId)
    .order("created_at")

  if (error) {
    throw new Error(`Failed to load courses: ${error.message}`)
  }

  return data
}

export async function getCourseById(courseId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, student_id, academic_year_id, term_id, subject_id, title, resource, special_course, grade, credits, notes"
    )
    .eq("id", courseId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load course: ${error.message}`)
  }

  return data
}
