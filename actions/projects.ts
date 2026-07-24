"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  type CreateProjectState,
  type UpdateProjectState,
} from "@/lib/validation/projects"

export async function createProject(
  studentId: string,
  _state: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const validatedFields = CreateProjectSchema.safeParse({
    subjectId: formData.get("subjectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const {
    subjectId,
    title,
    description,
    startDate,
    endDate,
    status,
    visibility,
  } = validatedFields.data

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      student_id: studentId,
      subject_id: subjectId || null,
      title,
      description: description || null,
      start_date: startDate || null,
      end_date: endDate || null,
      status,
      visibility,
    })
    .select("id")
    .single()

  if (error || !project) {
    return { message: "Não foi possível criar o projeto." }
  }

  redirect(`/students/${studentId}/projects/${project.id}`)
}

export async function updateProject(
  studentId: string,
  _state: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {
  const validatedFields = UpdateProjectSchema.safeParse({
    projectId: formData.get("projectId"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()
  const { projectId, status, visibility } = validatedFields.data

  const { error } = await supabase
    .from("projects")
    .update({ status, visibility })
    .eq("id", projectId)

  if (error) {
    return { message: "Não foi possível atualizar o projeto." }
  }

  revalidatePath(`/students/${studentId}/projects/${projectId}`)
}

export async function deleteProject(studentId: string, projectId: string) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) {
    throw new Error("Não foi possível remover o projeto.")
  }

  revalidatePath(`/students/${studentId}/projects`)
  redirect(`/students/${studentId}/projects`)
}

export async function addProjectAttachment(
  studentId: string,
  projectId: string,
  formData: FormData
) {
  await requireUser()
  const supabase = await createClient()

  const file = formData.get("file")

  if (!(file instanceof File) || file.size === 0) {
    return
  }

  const path = `${studentId}/${crypto.randomUUID()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from("project-attachments")
    .upload(path, file)

  if (uploadError) {
    throw new Error("Não foi possível enviar o arquivo.")
  }

  const { error } = await supabase.from("project_attachments").insert({
    project_id: projectId,
    storage_path: path,
    file_name: file.name,
    mime_type: file.type || null,
  })

  if (error) {
    throw new Error("Não foi possível salvar o anexo.")
  }

  revalidatePath(`/students/${studentId}/projects/${projectId}`)
}

export async function deleteProjectAttachment(
  studentId: string,
  projectId: string,
  attachmentId: string,
  storagePath: string
) {
  await requireUser()
  const supabase = await createClient()

  await supabase.storage.from("project-attachments").remove([storagePath])

  const { error } = await supabase
    .from("project_attachments")
    .delete()
    .eq("id", attachmentId)

  if (error) {
    throw new Error("Não foi possível remover o anexo.")
  }

  revalidatePath(`/students/${studentId}/projects/${projectId}`)
}
