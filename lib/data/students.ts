import "server-only"

import { createClient } from "@/lib/supabase/server"

function withAvatarUrl<T extends { avatar_path: string | null }>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  student: T
) {
  const avatar_url = student.avatar_path
    ? supabase.storage.from("student-avatars").getPublicUrl(student.avatar_path).data.publicUrl
    : null

  return { ...student, avatar_url }
}

export async function getStudents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, birth_date, avatar_path, created_at")
    .order("full_name")

  if (error) {
    throw new Error(`Failed to load students: ${error.message}`)
  }

  return data.map((student) => withAvatarUrl(supabase, student))
}

export async function getStudentById(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, birth_date, notes, grade_level, avatar_path, created_at")
    .eq("id", studentId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load student: ${error.message}`)
  }

  return data ? withAvatarUrl(supabase, data) : null
}
