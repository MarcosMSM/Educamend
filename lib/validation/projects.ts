import { z } from "zod"

export const PROJECT_STATUSES = [
  "planejado",
  "em_andamento",
  "concluido",
] as const

export const PROJECT_VISIBILITIES = ["private", "family", "public"] as const

export const CreateProjectSchema = z.object({
  subjectId: z.string().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Informe um título."),
  description: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(PROJECT_STATUSES),
  visibility: z.enum(PROJECT_VISIBILITIES),
})

export type CreateProjectState =
  | {
      errors?: { title?: string[] }
      message?: string
    }
  | undefined

export const UpdateProjectSchema = z.object({
  projectId: z.uuid(),
  status: z.enum(PROJECT_STATUSES),
  visibility: z.enum(PROJECT_VISIBILITIES),
})

export type UpdateProjectState = { message?: string } | undefined
