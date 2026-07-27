import { z } from "zod"

export const NEW_DISCIPLINE_VALUE = "new"

export const SPECIAL_COURSE_OPTIONS = [
  "nenhum",
  "honras",
  "avancado",
  "dupla_matricula",
  "outro",
] as const

export const SPECIAL_COURSE_LABELS: Record<
  (typeof SPECIAL_COURSE_OPTIONS)[number],
  string
> = {
  nenhum: "Nenhum",
  honras: "Honras",
  avancado: "Avançado (AP)",
  dupla_matricula: "Dupla matrícula",
  outro: "Outro",
}

export const GRADE_OPTIONS = [
  "a_mais",
  "a",
  "a_menos",
  "b_mais",
  "b",
  "b_menos",
  "c_mais",
  "c",
  "c_menos",
  "d_mais",
  "d",
  "d_menos",
  "f",
  "em_andamento",
  "aprovado",
  "incompleto",
] as const

export const GRADE_LABELS: Record<(typeof GRADE_OPTIONS)[number], string> = {
  a_mais: "A+",
  a: "A",
  a_menos: "A-",
  b_mais: "B+",
  b: "B",
  b_menos: "B-",
  c_mais: "C+",
  c: "C",
  c_menos: "C-",
  d_mais: "D+",
  d: "D",
  d_menos: "D-",
  f: "F",
  em_andamento: "Em andamento",
  aprovado: "Aprovado",
  incompleto: "Incompleto",
}

export const CreateCourseSchema = z.object({
  academicYearId: z.uuid(),
  termId: z.uuid("Selecione um período."),
  areaId: z.uuid("Selecione uma área."),
  disciplineId: z.string().min(1, "Selecione uma disciplina."),
  newDisciplineName: z.string().trim().optional().or(z.literal("")),
  title: z.string().trim().min(1, "Informe o nome do curso."),
  resource: z.string().trim().optional().or(z.literal("")),
  specialCourse: z.enum(SPECIAL_COURSE_OPTIONS).optional(),
  grade: z.enum(GRADE_OPTIONS).optional().or(z.literal("")),
  credits: z.coerce.number().min(0).optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
})

export type CreateCourseState =
  | {
      errors?: {
        termId?: string[]
        areaId?: string[]
        disciplineId?: string[]
        newDisciplineName?: string[]
        title?: string[]
      }
      message?: string
    }
  | undefined

export const UpdateCourseSchema = CreateCourseSchema.extend({
  courseId: z.uuid(),
})

export type UpdateCourseState = CreateCourseState
