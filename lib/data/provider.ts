import "server-only"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function getMyProviderProfile() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("provider_profiles")
    .select("profile_id, headline, bio, formation, experience_years")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load provider profile: ${error.message}`)
  }

  return data
}
