"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import {
  CreateBookingSchema,
  CreateListingSchema,
  UpdateBookingStatusSchema,
  UpdateListingStatusSchema,
  type CreateBookingState,
  type CreateListingState,
} from "@/lib/validation/marketplace"

export async function createListing(
  _state: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const validatedFields = CreateListingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    category: formData.get("category"),
    modality: formData.get("modality"),
    price: formData.get("price"),
    priceUnit: formData.get("priceUnit"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const user = await requireUser()
  const supabase = await createClient()
  const { title, description, subjectId, category, modality, price, priceUnit } =
    validatedFields.data

  const { data: listing, error } = await supabase
    .from("service_listings")
    .insert({
      provider_profile_id: user.id,
      title,
      description: description || null,
      subject_id: subjectId || null,
      category,
      modality,
      price: price === "" || price === undefined ? null : price,
      price_unit: priceUnit,
    })
    .select("id")
    .single()

  if (error || !listing) {
    return { message: "Não foi possível criar o anúncio." }
  }

  revalidatePath("/marketplace")
  redirect(`/marketplace/${listing.id}`)
}

export async function updateListingStatus(listingId: string, status: string) {
  await requireUser()
  const supabase = await createClient()

  const validated = UpdateListingStatusSchema.safeParse({ listingId, status })
  if (!validated.success) {
    throw new Error("Status inválido.")
  }

  const { error } = await supabase
    .from("service_listings")
    .update({ status: validated.data.status })
    .eq("id", listingId)

  if (error) {
    throw new Error("Não foi possível atualizar o anúncio.")
  }

  revalidatePath("/marketplace")
  revalidatePath("/marketplace/manage")
  revalidatePath(`/marketplace/${listingId}`)
}

export async function createBooking(
  listingId: string,
  _state: CreateBookingState,
  formData: FormData
): Promise<CreateBookingState> {
  const validatedFields = CreateBookingSchema.safeParse({
    listingId,
    studentId: formData.get("studentId"),
    message: formData.get("message"),
    preferredDate: formData.get("preferredDate"),
  })

  if (!validatedFields.success) {
    return { message: "Dados inválidos." }
  }

  const user = await requireUser()
  const supabase = await createClient()
  const { studentId, message, preferredDate } = validatedFields.data

  const { error } = await supabase.from("service_bookings").insert({
    listing_id: listingId,
    requested_by_profile_id: user.id,
    student_id: studentId || null,
    message: message || null,
    preferred_date: preferredDate || null,
  })

  if (error) {
    return { message: "Não foi possível enviar a solicitação." }
  }

  revalidatePath("/marketplace/manage")
  revalidatePath(`/marketplace/${listingId}`)
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireUser()
  const supabase = await createClient()

  const validated = UpdateBookingStatusSchema.safeParse({ bookingId, status })
  if (!validated.success) {
    throw new Error("Status inválido.")
  }

  const { error } = await supabase
    .from("service_bookings")
    .update({ status: validated.data.status })
    .eq("id", bookingId)

  if (error) {
    throw new Error("Não foi possível atualizar a solicitação.")
  }

  revalidatePath("/marketplace/manage")
}
