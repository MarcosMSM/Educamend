import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getProjectsByStudent(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, start_date, end_date, status, visibility, subjects(id, name)"
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`)
  }

  return data
}

export async function getProjectById(projectId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, student_id, title, description, start_date, end_date, status, visibility, subjects(id, name)"
    )
    .eq("id", projectId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load project: ${error.message}`)
  }

  return data
}

export async function getProjectAttachments(projectId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_attachments")
    .select("id, storage_path, file_name, mime_type, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load attachments: ${error.message}`)
  }

  return data
}

export async function getAttachmentUrl(storagePath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("project-attachments")
    .createSignedUrl(storagePath, 60 * 10)

  if (error) {
    return null
  }

  return data.signedUrl
}
