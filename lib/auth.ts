import "server-only"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function getUserFamilies() {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("families")
    .select("id, name, city, family_members!inner(profile_id, is_admin)")
    .eq("family_members.profile_id", user.id)

  if (error) {
    throw new Error(`Failed to load families: ${error.message}`)
  }

  return data
}
