"use client"

import { useActionState } from "react"

import { createStudent } from "@/actions/students"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateStudentForm() {
  const [state, action, pending] = useActionState(createStudent, undefined)

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input id="fullName" name="fullName" required />
        {state?.errors?.fullName && (
          <p className="text-sm text-destructive">
            {state.errors.fullName[0]}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="birthDate">Data de nascimento</Label>
        <Input id="birthDate" name="birthDate" type="date" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>
      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando..." : "Cadastrar aluno"}
      </Button>
    </form>
  )
}
