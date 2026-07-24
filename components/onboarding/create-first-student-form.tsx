"use client"

import { useActionState } from "react"

import { createFirstStudent } from "@/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateFirstStudentForm() {
  const [state, action, pending] = useActionState(createFirstStudent, undefined)

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="fullName" className="text-base">
          Nome completo do seu filho(a)
        </Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Ex.: João da Silva"
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
        <Label htmlFor="birthDate" className="text-base">
          Data de nascimento
          <span className="ml-1 font-normal text-muted-foreground">
            (opcional)
          </span>
        </Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          className="h-12 text-base"
        />
      </div>
      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full text-base font-semibold"
      >
        {pending ? "Cadastrando..." : "Concluir cadastro"}
      </Button>
    </form>
  )
}
