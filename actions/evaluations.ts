"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateEvaluationSchema,
  UpdateEvaluationScoreSchema,
  type CreateEvaluationState,
  type UpdateEvaluationScoreState,
} from "@/lib/validation/evaluations"

export async function createEvaluation(
  studentId: string,
  _state: CreateEvaluationState,
  formData: FormData
): Promise<CreateEvaluationState> {
  const validatedFields = CreateEvaluationSchema.safeParse({
    subjectId: formData.get("subjectId"),
    termId: formData.get("termId"),
    title: formData.get("title"),
    type: formData.get("type"),
    date: formData.get("date"),
    maxScore: formData.get("maxScore"),
    score: formData.get("score"),
    feedback: formData.get("feedback"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await requireUser()
  const supabase = await createClient()
  const { subjectId, termId, title, type, date, maxScore, score, feedback } =
    validatedFields.data

  const { error } = await supabase.from("evaluations").insert({
    student_id: studentId,
    subject_id: subjectId,
    term_id: termId,
    title,
    type,
    date,
    max_score: maxScore,
    score: score === "" || score === undefined ? null : score,
    feedback: feedback || null,
  })

  if (error) {
    return { message: "Não foi possível criar a avaliação." }
  }

  revalidatePath(`/students/${studentId}/evaluations`)
}

export async function updateEvaluationScore(
  studentId: string,
  _state: UpdateEvaluationScoreState,
  formData: FormData
): Promise<UpdateEvaluationScoreState> {
  const validatedFields = UpdateEvaluationScoreSchema.safeParse({
    evaluationId: formData.get("evaluationId"),
    score: formData.get("score"),
    feedback: formData.get("feedback"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  await requireUser()
  const supabase = await createClient()
  const { evaluationId, score, feedback } = validatedFields.data

  const { error } = await supabase
    .from("evaluations")
    .update({
      score: score === "" || score === undefined ? null : score,
      feedback: feedback || null,
    })
    .eq("id", evaluationId)

  if (error) {
    return { message: "Não foi possível salvar a nota." }
  }

  revalidatePath(`/students/${studentId}/evaluations`)
}

export async function deleteEvaluation(studentId: string, evaluationId: string) {
  await requireUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from("evaluations")
    .delete()
    .eq("id", evaluationId)

  if (error) {
    throw new Error("Não foi possível remover a avaliação.")
  }

  revalidatePath(`/students/${studentId}/evaluations`)
}
