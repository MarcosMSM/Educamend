"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import {
  _deleteExperience,
  _insertExperience,
  _updateExperience,
  type JourneyExperience,
} from "@/lib/data/journey"
import {
  AutosaveJourneyExperienceSchema,
  CreateJourneyDraftSchema,
  SubmitJourneyExperienceSchema,
  JOURNEY_CATEGORY_LABELS,
  type AutosaveJourneyExperienceInput,
  type AutosaveJourneyExperienceState,
  type CreateJourneyDraftState,
  type SubmitJourneyExperienceState,
} from "@/lib/validation/journey"

export async function createJourneyDraft(
  studentId: string,
  category: string
): Promise<CreateJourneyDraftState> {
  const validatedFields = CreateJourneyDraftSchema.safeParse({ studentId, category })

  if (!validatedFields.success) {
    return { message: "Categoria inválida." }
  }

  await requireUser()

  const experience = _insertExperience({
    student_id: validatedFields.data.studentId,
    title: JOURNEY_CATEGORY_LABELS[validatedFields.data.category],
    category: validatedFields.data.category,
  })

  revalidatePath(`/students/${experience.student_id}/journey`)

  return { experienceId: experience.id }
}

export async function autosaveJourneyExperience(
  experienceId: string,
  fields: AutosaveJourneyExperienceInput
): Promise<AutosaveJourneyExperienceState> {
  const validatedFields = AutosaveJourneyExperienceSchema.safeParse(fields)

  if (!validatedFields.success) {
    return { status: "error", message: "Não foi possível salvar as alterações." }
  }

  await requireUser()

  const {
    title,
    organization,
    description,
    reflection,
    startDate,
    endDate,
    hours,
    skills,
    attachments,
  } = validatedFields.data

  const patch: Partial<Omit<JourneyExperience, "id" | "student_id" | "created_at">> = {}
  if (title !== undefined) patch.title = title
  if (organization !== undefined) patch.organization = organization || null
  if (description !== undefined) patch.description = description || null
  if (reflection !== undefined) patch.reflection = reflection || null
  if (startDate !== undefined) patch.start_date = startDate || null
  if (endDate !== undefined) patch.end_date = endDate || null
  if (hours !== undefined) patch.hours = hours
  if (skills !== undefined) patch.skills = skills
  if (attachments !== undefined) patch.attachments = attachments

  const updated = _updateExperience(experienceId, patch)

  if (!updated) {
    return { status: "error", message: "Experiência não encontrada." }
  }

  revalidatePath(`/students/${updated.student_id}/journey`)

  return { status: "ok", savedAt: updated.updated_at }
}

export async function submitJourneyExperience(
  studentId: string,
  _state: SubmitJourneyExperienceState,
  formData: FormData
): Promise<SubmitJourneyExperienceState> {
  const validatedFields = SubmitJourneyExperienceSchema.safeParse({
    experienceId: formData.get("experienceId"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return { message: "Selecione um status válido para concluir." }
  }

  await requireUser()

  const { experienceId, status, visibility } = validatedFields.data

  const updated = _updateExperience(experienceId, { status, visibility })

  if (!updated) {
    return { message: "Não foi possível concluir o cadastro." }
  }

  revalidatePath(`/students/${studentId}/journey`)
  redirect(`/students/${studentId}/journey?tab=timeline`)
}

export async function deleteJourneyExperience(studentId: string, experienceId: string) {
  await requireUser()

  const deleted = _deleteExperience(experienceId)

  if (!deleted) {
    throw new Error("Não foi possível remover a experiência.")
  }

  revalidatePath(`/students/${studentId}/journey`)
  redirect(`/students/${studentId}/journey?tab=timeline`)
}
