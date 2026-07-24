import "server-only"

import { createClient } from "@/lib/supabase/server"
import { relation } from "@/lib/utils"

export async function getPortfolioSettings(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, headline, bio, portfolio_public")
    .eq("id", studentId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load portfolio settings: ${error.message}`)
  }

  return data
}

export async function getHighlights(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_highlights")
    .select("id, title, description, category, date, visibility, created_at")
    .eq("student_id", studentId)
    .order("date", { ascending: false, nullsFirst: false })

  if (error) {
    throw new Error(`Failed to load highlights: ${error.message}`)
  }

  return data
}

export async function getPublicPortfolio(studentId: string) {
  const supabase = await createClient()

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, full_name, headline, bio, portfolio_public")
    .eq("id", studentId)
    .eq("portfolio_public", true)
    .maybeSingle()

  if (studentError) {
    throw new Error(`Failed to load portfolio: ${studentError.message}`)
  }

  if (!student) {
    return null
  }

  const [projectsResult, highlightsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, description, start_date, end_date, status, subjects(id, name)")
      .eq("student_id", studentId)
      .eq("visibility", "public"),
    supabase
      .from("portfolio_highlights")
      .select("id, title, description, category, date")
      .eq("student_id", studentId)
      .eq("visibility", "public"),
  ])

  const timeline = [
    ...(projectsResult.data ?? []).map((project) => ({
      id: `project-${project.id}`,
      kind: "project" as const,
      title: project.title,
      description: project.description,
      date: project.end_date ?? project.start_date,
      tag: relation(project.subjects)?.name ?? project.status,
    })),
    ...(highlightsResult.data ?? []).map((highlight) => ({
      id: `highlight-${highlight.id}`,
      kind: "highlight" as const,
      title: highlight.title,
      description: highlight.description,
      date: highlight.date,
      tag: highlight.category,
    })),
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))

  return { student, timeline }
}
