import { z } from "zod"

export const MATERIAL_TYPES = [
  "livro",
  "video",
  "apostila",
  "link",
  "outro",
] as const

export const CreateMaterialSchema = z.object({
  subjectId: z.uuid("Selecione uma disciplina."),
  termId: z.string().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Informe um título."),
  type: z.enum(MATERIAL_TYPES),
  url: z.url("Informe uma URL válida.").optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
})

export type CreateMaterialState =
  | {
      errors?: {
        subjectId?: string[]
        title?: string[]
        url?: string[]
      }
      message?: string
    }
  | undefined
