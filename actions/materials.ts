"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateMaterialSchema,
  type CreateMaterialState,
} from "@/lib/validation/materials"

export async function createMaterial(
  studentId: string,
  _state: CreateMaterialState,
  formData: FormData
): Promise<CreateMaterialState> {
  const validatedFields = CreateMaterialSchema.safeParse({
    subjectId: formData.get("subjectId"),
    termId: formData.get("termId"),
    title: formData.get("title"),
    type: formData.get("type"),
    url: formData.get("url"),
    notes: formData.get("notes"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { subjectId, termId, title, type, url, notes } = validatedFields.data

  let storagePath: string | null = null
  const file = formData.get("file")

  if (file instanceof File && file.size > 0) {
    const path = `${studentId}/${crypto.randomUUID()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("materials")
      .upload(path, file)

    if (uploadError) {
      return { message: "Não foi possível enviar o arquivo." }
    }

    storagePath = path
  }

  const { error } = await supabase.from("materials").insert({
    student_id: studentId,
    subject_id: subjectId,
    term_id: termId || null,
    title,
    type,
    url: url || null,
    storage_path: storagePath,
    notes: notes || null,
  })

  if (error) {
    return { message: "Não foi possível salvar o material." }
  }

  revalidatePath(`/students/${studentId}/materials`)
}

export async function deleteMaterial(
  studentId: string,
  materialId: string,
  storagePath: string | null
) {
  await requireUser()
  const supabase = await createClient()

  if (storagePath) {
    await supabase.storage.from("materials").remove([storagePath])
  }

  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", materialId)

  if (error) {
    throw new Error("Não foi possível remover o material.")
  }

  revalidatePath(`/students/${studentId}/materials`)
}
