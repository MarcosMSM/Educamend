import "server-only"

import { createClient } from "@/lib/supabase/server"
import { getCoursesByAcademicYear } from "@/lib/data/courses"

export async function getAcademicYears(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("academic_years")
    .select("id, name, start_date, end_date, status")
    .eq("student_id", studentId)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(`Failed to load academic years: ${error.message}`)
  }

  return data
}

export async function getTermsByAcademicYear(academicYearId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("terms")
    .select("id, name, start_date, end_date, sequence")
    .eq("academic_year_id", academicYearId)
    .order("sequence")

  if (error) {
    throw new Error(`Failed to load terms: ${error.message}`)
  }

  return data
}

export async function getTermsForStudent(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("terms")
    .select("id, name, start_date")
    .eq("student_id", studentId)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(`Failed to load terms: ${error.message}`)
  }

  return data
}

export async function getTermById(termId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("terms")
    .select("id, name, start_date, end_date, student_id, academic_year_id")
    .eq("id", termId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load term: ${error.message}`)
  }

  return data
}

export async function getAcademicYearById(academicYearId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("academic_years")
    .select("id, name, start_date, end_date, status, student_id")
    .eq("id", academicYearId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load academic year: ${error.message}`)
  }

  return data
}

export async function getPlanningOverview(studentId: string) {
  const academicYears = await getAcademicYears(studentId)

  return Promise.all(
    academicYears.map(async (year) => {
      const [terms, courses] = await Promise.all([
        getTermsByAcademicYear(year.id),
        getCoursesByAcademicYear(year.id),
      ])

      const creditsCompleted = courses
        .filter((course) => course.grade && course.grade !== "em_andamento")
        .reduce((sum, course) => sum + Number(course.credits ?? 0), 0)

      const creditsInProgress = courses
        .filter((course) => !course.grade || course.grade === "em_andamento")
        .reduce((sum, course) => sum + Number(course.credits ?? 0), 0)

      return { ...year, terms, courses, creditsCompleted, creditsInProgress }
    })
  )
}
