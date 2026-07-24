import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getMaterialsByStudent(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("materials")
    .select(
      "id, title, type, url, storage_path, notes, created_at, subjects(id, name)"
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load materials: ${error.message}`)
  }

  return data
}

export async function getMaterialFileUrl(storagePath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("materials")
    .createSignedUrl(storagePath, 60 * 10)

  if (error) {
    return null
  }

  return data.signedUrl
}
