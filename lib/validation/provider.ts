import { z } from "zod"

export const UpsertProviderProfileSchema = z.object({
  headline: z.string().trim().min(2, "Informe um título."),
  bio: z.string().trim().optional().or(z.literal("")),
  formation: z.string().trim().optional().or(z.literal("")),
  experienceYears: z.coerce.number().int().min(0).optional().or(z.literal("")),
})

export type UpsertProviderProfileState =
  | { errors?: { headline?: string[] }; message?: string }
  | undefined
