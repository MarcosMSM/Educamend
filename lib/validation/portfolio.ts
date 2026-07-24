import { z } from "zod"

export const HIGHLIGHT_CATEGORIES = [
  "premio",
  "certificado",
  "atividade",
  "voluntariado",
  "curso",
  "outro",
] as const

export const VISIBILITIES = ["private", "family", "public"] as const

export const UpdatePortfolioSettingsSchema = z.object({
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  portfolioPublic: z.coerce.boolean(),
})

export type UpdatePortfolioSettingsState = { message?: string } | undefined

export const CreateHighlightSchema = z.object({
  title: z.string().trim().min(2, "Informe um título."),
  description: z.string().trim().optional().or(z.literal("")),
  category: z.enum(HIGHLIGHT_CATEGORIES),
  date: z.string().optional().or(z.literal("")),
  visibility: z.enum(VISIBILITIES),
})

export type CreateHighlightState =
  | { errors?: { title?: string[] }; message?: string }
  | undefined

export const UpdateHighlightVisibilitySchema = z.object({
  highlightId: z.uuid(),
  visibility: z.enum(VISIBILITIES),
})

export type UpdateHighlightVisibilityState = { message?: string } | undefined
