import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getCurricula(familyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("curricula")
    .select("id, name, description, created_at")
    .eq("family_id", familyId)
    .order("created_at")

  if (error) {
    throw new Error(`Failed to load curricula: ${error.message}`)
  }

  return data
}

export async function getCurriculumSubjects(curriculumId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("curriculum_subjects")
    .select("subject_id, sequence, subjects(id, name)")
    .eq("curriculum_id", curriculumId)
    .order("sequence")

  if (error) {
    throw new Error(`Failed to load curriculum subjects: ${error.message}`)
  }

  return data
}

export async function getGlobalSubjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subjects")
    .select("id, name")
    .is("family_id", null)
    .order("name")

  if (error) {
    throw new Error(`Failed to load subjects: ${error.message}`)
  }

  return data
}

export async function getAvailableSubjects(familyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, family_id")
    .or(`family_id.is.null,family_id.eq.${familyId}`)
    .order("name")

  if (error) {
    throw new Error(`Failed to load subjects: ${error.message}`)
  }

  return data
}
