import { z } from "zod"

export const GRADE_LEVEL_OPTIONS = [
  "Educação Infantil",
  "Pré-escola",
  "1º Ano EF",
  "2º Ano EF",
  "3º Ano EF",
  "4º Ano EF",
  "5º Ano EF",
  "6º Ano EF",
  "7º Ano EF",
  "8º Ano EF",
  "9º Ano EF",
  "1º Ano EM",
  "2º Ano EM",
  "3º Ano EM",
  "Pós-Ensino Médio",
] as const

export const CURRICULUM_BASE_OPTIONS = ["cc", "regular", "outro"] as const

export const CURRICULUM_BASE_LABELS: Record<
  (typeof CURRICULUM_BASE_OPTIONS)[number],
  string
> = {
  cc: "CC",
  regular: "Regular",
  outro: "Outro",
}

export const CC_LEVEL_OPTIONS = [
  "Foundations",
  "Essentials",
  "Challenge A",
  "Challenge B",
  "Challenge I",
  "Challenge II",
  "Challenge III",
  "Challenge IV",
] as const

export const CreateAcademicYearSchema = z
  .object({
    name: z.string().trim().min(1, "Informe um nome para o ano letivo."),
    startDate: z.string().min(1, "Informe a data de início."),
    endDate: z.string().min(1, "Informe a data de término."),
    gradeLevel: z.enum(GRADE_LEVEL_OPTIONS).optional().or(z.literal("")),
    curriculumBase: z
      .enum(CURRICULUM_BASE_OPTIONS)
      .optional()
      .or(z.literal("")),
    curriculumBaseOther: z.string().trim().optional().or(z.literal("")),
    ccLevel: z.enum(CC_LEVEL_OPTIONS).optional().or(z.literal("")),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "A data de término deve ser depois da data de início.",
    path: ["endDate"],
  })

export type CreateAcademicYearState =
  | {
      errors?: {
        name?: string[]
        startDate?: string[]
        endDate?: string[]
        curriculumBaseOther?: string[]
        ccLevel?: string[]
      }
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
    gradeLevel: z.enum(GRADE_LEVEL_OPTIONS).optional().or(z.literal("")),
    curriculumBase: z
      .enum(CURRICULUM_BASE_OPTIONS)
      .optional()
      .or(z.literal("")),
    curriculumBaseOther: z.string().trim().optional().or(z.literal("")),
    ccLevel: z.enum(CC_LEVEL_OPTIONS).optional().or(z.literal("")),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "A data de término deve ser depois da data de início.",
    path: ["endDate"],
  })

export type UpdateAcademicYearState =
  | {
      errors?: {
        name?: string[]
        startDate?: string[]
        endDate?: string[]
        curriculumBaseOther?: string[]
        ccLevel?: string[]
      }
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
