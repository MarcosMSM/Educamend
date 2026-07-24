import "server-only"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function getActiveListings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("service_listings")
    .select(
      "id, title, description, category, modality, price, price_unit, created_at, subjects(id, name), profiles(full_name)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load listings: ${error.message}`)
  }

  return data
}

export async function getListingById(listingId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("service_listings")
    .select(
      "id, provider_profile_id, title, description, category, modality, price, price_unit, status, subjects(id, name), profiles(full_name)"
    )
    .eq("id", listingId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load listing: ${error.message}`)
  }

  return data
}

export async function getMyListings() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("service_listings")
    .select("id, title, category, status, price, price_unit, created_at")
    .eq("provider_profile_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load your listings: ${error.message}`)
  }

  return data
}

export async function getBookingsSent() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("service_bookings")
    .select(
      "id, message, preferred_date, status, created_at, students(full_name), service_listings(id, title)"
    )
    .eq("requested_by_profile_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load your bookings: ${error.message}`)
  }

  return data
}

export async function getBookingsReceived() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("service_bookings")
    .select(
      "id, message, preferred_date, status, created_at, students(full_name), profiles(full_name), service_listings!inner(id, title, provider_profile_id)"
    )
    .eq("service_listings.provider_profile_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to load received bookings: ${error.message}`)
  }

  return data
}
