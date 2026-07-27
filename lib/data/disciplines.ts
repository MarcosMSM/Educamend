import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function getDisciplines() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("disciplines")
    .select("id, name, area_id")
    .order("sort_order")

  if (error) {
    throw new Error(`Failed to load disciplines: ${error.message}`)
  }

  return data
}
