import { z } from "zod"

export const SignUpSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.email("Informe um e-mail válido.").trim(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})

export const LoginSchema = z.object({
  email: z.email("Informe um e-mail válido.").trim(),
  password: z.string().min(1, "Informe sua senha."),
})

export type SignUpState =
  | {
      errors?: {
        fullName?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type LoginState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
