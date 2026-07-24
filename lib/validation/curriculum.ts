import { z } from "zod"

export const CreateCurriculumSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome para o currículo."),
})

export type CreateCurriculumState =
  | { errors?: { name?: string[] }; message?: string }
  | undefined

export const AddSubjectToCurriculumSchema = z.object({
  curriculumId: z.uuid(),
  existingSubjectId: z.string().optional().or(z.literal("")),
  newSubjectName: z.string().trim().optional().or(z.literal("")),
})

export type AddSubjectState =
  | { errors?: { newSubjectName?: string[] }; message?: string }
  | undefined
