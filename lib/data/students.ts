import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getStudents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, birth_date, created_at")
    .order("full_name")

  if (error) {
    throw new Error(`Failed to load students: ${error.message}`)
  }

  return data
}

export async function getStudentById(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, birth_date, notes, grade_level, created_at")
    .eq("id", studentId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load student: ${error.message}`)
  }

  return data
}
