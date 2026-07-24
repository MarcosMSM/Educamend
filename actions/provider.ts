"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  UpsertProviderProfileSchema,
  type UpsertProviderProfileState,
} from "@/lib/validation/provider"

export async function upsertProviderProfile(
  _state: UpsertProviderProfileState,
  formData: FormData
): Promise<UpsertProviderProfileState> {
  const validatedFields = UpsertProviderProfileSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    formation: formData.get("formation"),
    experienceYears: formData.get("experienceYears"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const user = await requireUser()
  const supabase = await createClient()
  const { headline, bio, formation, experienceYears } = validatedFields.data

  const { error } = await supabase.from("provider_profiles").upsert({
    profile_id: user.id,
    headline,
    bio: bio || null,
    formation: formation || null,
    experience_years:
      experienceYears === "" || experienceYears === undefined
        ? null
        : experienceYears,
  })

  if (error) {
    return { message: "Não foi possível salvar o perfil de prestador." }
  }

  revalidatePath("/marketplace")
  revalidatePath("/marketplace/provider-profile")
  redirect("/marketplace")
}
