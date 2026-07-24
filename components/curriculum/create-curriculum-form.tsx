"use client"

import { useActionState } from "react"

import { createCurriculum } from "@/actions/curriculum"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateCurriculumForm({ studentId }: { studentId: string }) {
  const boundAction = createCurriculum.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="flex items-end gap-2">
      <div className="grid gap-2">
        <Label htmlFor="name">Novo currículo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Currículo 2026"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar"}
      </Button>
      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </form>
  )
}
