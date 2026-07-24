import { z } from "zod"

export const CreateAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1, "Informe um nome para o ano letivo."),
    startDate: z.string().min(1, "Informe a data de início."),
    endDate: z.string().min(1, "Informe a data de término."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "A data de término deve ser depois da data de início.",
    path: ["endDate"],
  })

export type CreateAcademicYearState =
  | {
      errors?: { name?: string[]; startDate?: string[]; endDate?: string[] }
      message?: string
    }
  | undefined

export const UpdateAcademicYearSchema = z
  .object({
    academicYearId: z.uuid(),
    name: z.string().trim().min(1, "Informe um nome para o ano letivo."),
    startDate: z.string().min(1, "Informe a data de início."),
    endDate: z.string().min(1, "Informe a data de término."),
    status: z.enum(["planning", "active", "completed"]),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "A data de término deve ser depois da data de início.",
    path: ["endDate"],
  })

export type UpdateAcademicYearState =
  | {
      errors?: { name?: string[]; startDate?: string[]; endDate?: string[] }
      message?: string
    }
  | undefined

export const CreateTermSchema = z
  .object({
    academicYearId: z.uuid(),
    name: z.string().trim().min(1, "Informe um nome para o período."),
    startDate: z.string().min(1, "Informe a data de início."),
    endDate: z.string().min(1, "Informe a data de término."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "A data de término deve ser depois da data de início.",
    path: ["endDate"],
  })

export type CreateTermState =
  | {
      errors?: { name?: string[]; startDate?: string[]; endDate?: string[] }
      message?: string
    }
  | undefined
