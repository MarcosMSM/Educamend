import { z } from "zod"

export const CreateFamilySchema = z.object({
  name: z.string().trim().min(2, "Informe um nome para a família."),
})

export type CreateFamilyState =
  | {
      errors?: { name?: string[] }
      message?: string
    }
  | undefined

export const CreateStudentSchema = z.object({
  fullName: z.string().trim().min(2, "Informe o nome do aluno."),
  birthDate: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
})

export type CreateStudentState =
  | {
      errors?: {
        fullName?: string[]
        birthDate?: string[]
        notes?: string[]
      }
      message?: string
    }
  | undefined

export const UpdateStudentProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Informe o nome do aluno."),
  gradeLevel: z.string().trim().max(60).optional().or(z.literal("")),
})

export type UpdateStudentProfileState =
  | {
      errors?: { fullName?: string[]; gradeLevel?: string[] }
      message?: string
    }
  | undefined

export const UpdateFamilyCitySchema = z.object({
  city: z.string().trim().max(80).optional().or(z.literal("")),
})

export type UpdateFamilyCityState = { message?: string } | undefined
