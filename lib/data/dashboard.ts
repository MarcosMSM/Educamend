import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getStudentDashboardSummary(studentId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const [termsResult, evaluationsResult, projectsResult] = await Promise.all([
    supabase
      .from("terms")
      .select("id, name, start_date, end_date")
      .eq("student_id", studentId)
      .order("start_date", { ascending: false }),
    supabase
      .from("evaluations")
      .select("score, max_score")
      .eq("student_id", studentId)
      .not("score", "is", null),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .neq("status", "concluido"),
  ])

  const terms = termsResult.data ?? []
  const currentTerm =
    terms.find((term) => term.start_date <= today && today <= term.end_date) ??
    terms[0] ??
    null

  const evaluations = evaluationsResult.data ?? []
  const averageScore =
    evaluations.length > 0
      ? evaluations.reduce(
          (sum, evaluation) =>
            sum + (Number(evaluation.score) / Number(evaluation.max_score)) * 10,
          0
        ) / evaluations.length
      : null

  return {
    currentTerm,
    averageScore,
    activeProjectsCount: projectsResult.count ?? 0,
  }
}
