"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateFamilySchema,
  UpdateFamilyCitySchema,
  type CreateFamilyState,
  type UpdateFamilyCityState,
} from "@/lib/validation/families"

export async function createFamily(
  _state: CreateFamilyState,
  formData: FormData
): Promise<CreateFamilyState> {
  const validatedFields = CreateFamilySchema.safeParse({
    name: formData.get("name"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const user = await requireUser()
  const supabase = await createClient()

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({ name: validatedFields.data.name, created_by: user.id })
    .select("id")
    .single()

  if (familyError || !family) {
    return { message: "Não foi possível criar a família. Tente novamente." }
  }

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: family.id,
    profile_id: user.id,
    relationship: "parent",
    is_admin: true,
  })

  if (memberError) {
    return { message: "Não foi possível vincular você à família." }
  }

  redirect("/onboarding/student")
}

export async function updateFamilyCity(
  familyId: string,
  _state: UpdateFamilyCityState,
  formData: FormData
): Promise<UpdateFamilyCityState> {
  const validatedFields = UpdateFamilyCitySchema.safeParse({
    city: formData.get("city"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from("families")
    .update({ city: validatedFields.data.city || null })
    .eq("id", familyId)

  if (error) {
    return { message: "Não foi possível salvar a cidade." }
  }

  revalidatePath("/settings/family")
  revalidatePath("/dashboard")
}
