"use client"

import Link from "next/link"
import { useActionState } from "react"

import { signup } from "@/actions/auth"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div>
      <StepIndicator current={1} total={3} label="Criar sua conta" />
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Vamos começar!</CardTitle>
          <CardDescription className="text-base">
            Primeiro, crie a sua conta de responsável pela família.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form action={action} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-base">
                Seu nome completo
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Ex.: Maria da Silva"
                className="h-12 text-base"
                required
              />
              {state?.errors?.fullName && (
                <p className="text-sm text-destructive">
                  {state.errors.fullName[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base">
                Seu e-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                className="h-12 text-base"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-base">
                Crie uma senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Pelo menos 8 caracteres"
                className="h-12 text-base"
                required
              />
              {state?.errors?.password && (
                <p className="text-sm text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <Button
              type="submit"
              disabled={pending}
              className="h-12 w-full text-base font-semibold"
            >
              {pending ? "Criando conta..." : "Continuar"}
            </Button>
          </form>
          <p className="mt-5 text-center text-base text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
