import "server-only"

import { createClient } from "@/lib/supabase/server"

type EvaluationRow = {
  id: string
  title: string
  type: string
  date: string
  max_score: number
  score: number | null
  feedback: string | null
  subjects: { id: string; name: string } | null
  terms: { id: string; name: string } | null
}

export async function getEvaluationsByStudent(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("evaluations")
    .select(
      "id, title, type, date, max_score, score, feedback, subjects(id, name), terms(id, name)"
    )
    .eq("student_id", studentId)
    .order("date", { ascending: false })
    .returns<EvaluationRow[]>()

  if (error) {
    throw new Error(`Failed to load evaluations: ${error.message}`)
  }

  return data
}
