import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getFamilyMembers(familyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("family_members")
    .select("profile_id, relationship, is_admin, profiles(full_name)")
    .eq("family_id", familyId)

  if (error) {
    throw new Error(`Failed to load family members: ${error.message}`)
  }

  return data
}
