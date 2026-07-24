import { z } from "zod"

export const EVALUATION_TYPES = [
  "prova",
  "trabalho",
  "projeto",
  "participacao",
  "outro",
] as const

export const CreateEvaluationSchema = z.object({
  subjectId: z.uuid("Selecione uma disciplina."),
  termId: z.uuid("Selecione um período."),
  title: z.string().trim().min(2, "Informe um título."),
  type: z.enum(EVALUATION_TYPES),
  date: z.string().min(1, "Informe a data."),
  maxScore: z.coerce.number().positive("Informe um valor válido."),
  score: z.coerce.number().min(0).optional().or(z.literal("")),
  feedback: z.string().trim().optional().or(z.literal("")),
})

export type CreateEvaluationState =
  | {
      errors?: {
        subjectId?: string[]
        termId?: string[]
        title?: string[]
        maxScore?: string[]
        score?: string[]
      }
      message?: string
    }
  | undefined

export const UpdateEvaluationScoreSchema = z.object({
  evaluationId: z.uuid(),
  score: z.coerce.number().min(0).optional().or(z.literal("")),
  feedback: z.string().trim().optional().or(z.literal("")),
})

export type UpdateEvaluationScoreState =
  | { errors?: { score?: string[] }; message?: string }
  | undefined
