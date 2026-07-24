import { z } from "zod"

export const SERVICE_CATEGORIES = ["aula", "tutoria", "mentoria", "outro"] as const
export const SERVICE_MODALITIES = ["online", "presencial", "hibrido"] as const
export const PRICE_UNITS = ["hora", "sessao", "pacote"] as const
export const LISTING_STATUSES = ["active", "paused", "archived"] as const
export const BOOKING_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
  "completed",
] as const

export const CreateListingSchema = z.object({
  title: z.string().trim().min(2, "Informe um título."),
  description: z.string().trim().optional().or(z.literal("")),
  subjectId: z.string().optional().or(z.literal("")),
  category: z.enum(SERVICE_CATEGORIES),
  modality: z.enum(SERVICE_MODALITIES),
  price: z.coerce.number().min(0).optional().or(z.literal("")),
  priceUnit: z.enum(PRICE_UNITS),
})

export type CreateListingState =
  | { errors?: { title?: string[] }; message?: string }
  | undefined

export const UpdateListingStatusSchema = z.object({
  listingId: z.uuid(),
  status: z.enum(LISTING_STATUSES),
})

export const CreateBookingSchema = z.object({
  listingId: z.uuid(),
  studentId: z.string().optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
})

export type CreateBookingState =
  | { errors?: { message?: string[] }; message?: string }
  | undefined

export const UpdateBookingStatusSchema = z.object({
  bookingId: z.uuid(),
  status: z.enum(BOOKING_STATUSES),
})
