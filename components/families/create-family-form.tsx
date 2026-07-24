"use client"

import { useActionState } from "react"

import { createFamily } from "@/actions/families"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateFamilyForm() {
  const [state, action, pending] = useActionState(createFamily, undefined)

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-base">
          Nome da família
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Família Silva"
          className="h-12 text-base"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
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
        {pending ? "Criando..." : "Continuar"}
      </Button>
    </form>
  )
}
