"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateHighlightSchema,
  UpdateHighlightVisibilitySchema,
  UpdatePortfolioSettingsSchema,
  type CreateHighlightState,
  type UpdateHighlightVisibilityState,
  type UpdatePortfolioSettingsState,
} from "@/lib/validation/portfolio"

export async function updatePortfolioSettings(
  studentId: string,
  _state: UpdatePortfolioSettingsState,
  formData: FormData
): Promise<UpdatePortfolioSettingsState> {
  const validatedFields = UpdatePortfolioSettingsSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    portfolioPublic: formData.get("portfolioPublic") === "on",
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()
  const { headline, bio, portfolioPublic } = validatedFields.data

  const { error } = await supabase
    .from("students")
    .update({
      headline: headline || null,
      bio: bio || null,
      portfolio_public: portfolioPublic,
    })
    .eq("id", studentId)

  if (error) {
    return { message: "Não foi possível salvar as configurações do portfólio." }
  }

  revalidatePath(`/students/${studentId}/portfolio`)
  revalidatePath(`/portfolio/${studentId}`)
}

export async function createHighlight(
  studentId: string,
  _state: CreateHighlightState,
  formData: FormData
): Promise<CreateHighlightState> {
  const validatedFields = CreateHighlightSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    date: formData.get("date"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { title, description, category, date, visibility } =
    validatedFields.data

  const { error } = await supabase.from("portfolio_highlights").insert({
    student_id: studentId,
    title,
    description: description || null,
    category,
    date: date || null,
    visibility,
  })

  if (error) {
    return { message: "Não foi possível adicionar o destaque." }
  }

  revalidatePath(`/students/${studentId}/portfolio`)
  revalidatePath(`/portfolio/${studentId}`)
}

export async function updateHighlightVisibility(
  studentId: string,
  _state: UpdateHighlightVisibilityState,
  formData: FormData
): Promise<UpdateHighlightVisibilityState> {
  const validatedFields = UpdateHighlightVisibilitySchema.safeParse({
    highlightId: formData.get("highlightId"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()
  const { highlightId, visibility } = validatedFields.data

  const { error } = await supabase
    .from("portfolio_highlights")
    .update({ visibility })
    .eq("id", highlightId)

  if (error) {
    return { message: "Não foi possível atualizar a visibilidade." }
  }

  revalidatePath(`/students/${studentId}/portfolio`)
  revalidatePath(`/portfolio/${studentId}`)
}

export async function deleteHighlight(studentId: string, highlightId: string) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from("portfolio_highlights")
    .delete()
    .eq("id", highlightId)

  if (error) {
    throw new Error("Não foi possível remover o destaque.")
  }

  revalidatePath(`/students/${studentId}/portfolio`)
  revalidatePath(`/portfolio/${studentId}`)
}
