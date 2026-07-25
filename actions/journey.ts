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
import { EXPERIENCE_TYPE_DEFAULT_CATEGORY } from "@/lib/journey-types"
import {
  AutosaveJourneyExperienceSchema,
  CreateJourneyDraftSchema,
  QuickCreateJourneyExperienceSchema,
  SubmitJourneyExperienceSchema,
  JOURNEY_CATEGORY_LABELS,
  type AutosaveJourneyExperienceInput,
  type AutosaveJourneyExperienceState,
  type CreateJourneyDraftState,
  type JourneyAttachmentInput,
  type QuickCreateJourneyExperienceState,
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

  const experience = await _insertExperience({
    student_id: validatedFields.data.studentId,
    title: JOURNEY_CATEGORY_LABELS[validatedFields.data.category],
    category: validatedFields.data.category,
  })

  revalidatePath(`/students/${experience.student_id}/journey`)
  revalidatePath(`/students/${experience.student_id}/journey/old`)

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

  const updated = await _updateExperience(experienceId, patch)

  if (!updated) {
    return { status: "error", message: "Experiência não encontrada." }
  }

  revalidatePath(`/students/${updated.student_id}/journey`)
  revalidatePath(`/students/${updated.student_id}/journey/old`)

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

  const updated = await _updateExperience(experienceId, { status, visibility })

  if (!updated) {
    return { message: "Não foi possível concluir o cadastro." }
  }

  revalidatePath(`/students/${studentId}/journey`)
  revalidatePath(`/students/${studentId}/journey/old`)
  redirect(`/students/${studentId}/journey`)
}

export async function createJourneyExperienceQuick(
  studentId: string,
  _state: QuickCreateJourneyExperienceState,
  formData: FormData
): Promise<QuickCreateJourneyExperienceState> {
  let attachments: JourneyAttachmentInput[] = []
  try {
    const raw = formData.get("attachments")
    attachments = raw ? JSON.parse(raw as string) : []
  } catch {
    attachments = []
  }

  const hoursRaw = formData.get("hours")

  const validatedFields = QuickCreateJourneyExperienceSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    organization: formData.get("organization"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    hours: hoursRaw ? hoursRaw : undefined,
    status: formData.get("status"),
    description: formData.get("description"),
    skills: formData.getAll("skills"),
    attachments,
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()

  const {
    title,
    type,
    organization,
    startDate,
    endDate,
    hours,
    status,
    description,
    skills,
  } = validatedFields.data

  const experience = await _insertExperience({
    student_id: studentId,
    title,
    category: EXPERIENCE_TYPE_DEFAULT_CATEGORY[type],
  })

  await _updateExperience(experience.id, {
    organization: organization || null,
    start_date: startDate || null,
    end_date: endDate || null,
    hours: hours ?? null,
    status,
    description: description || null,
    skills: skills ?? [],
    attachments: validatedFields.data.attachments ?? [],
  })

  revalidatePath(`/students/${studentId}/journey`)
  revalidatePath(`/students/${studentId}/journey/old`)
}

export async function deleteJourneyExperience(studentId: string, experienceId: string) {
  await requireUser()

  const deleted = await _deleteExperience(experienceId)

  if (!deleted) {
    throw new Error("Não foi possível remover a experiência.")
  }

  revalidatePath(`/students/${studentId}/journey`)
  revalidatePath(`/students/${studentId}/journey/old`)
  redirect(`/students/${studentId}/journey`)
}
