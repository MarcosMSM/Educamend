import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getAreas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("areas")
    .select("id, name")
    .order("sort_order")

  if (error) {
    throw new Error(`Failed to load areas: ${error.message}`)
  }

  return data
}
