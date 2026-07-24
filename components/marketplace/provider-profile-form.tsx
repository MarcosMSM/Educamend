"use client"

import { useActionState } from "react"

import { upsertProviderProfile } from "@/actions/provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ProviderProfileForm({
  headline,
  bio,
  formation,
  experienceYears,
}: {
  headline: string | null
  bio: string | null
  formation: string | null
  experienceYears: number | null
}) {
  const [state, action, pending] = useActionState(
    upsertProviderProfile,
    undefined
  )

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="headline">Título</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="Ex.: Professora de matemática com 8 anos de experiência"
          defaultValue={headline ?? ""}
          required
        />
        {state?.errors?.headline && (
          <p className="text-sm text-destructive">
            {state.errors.headline[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Sobre você</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={bio ?? ""}
          placeholder="Conte sobre sua abordagem, especialidades, com quem gosta de trabalhar."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="formation">Formação</Label>
          <Input
            id="formation"
            name="formation"
            placeholder="Ex.: Licenciatura em Matemática — USP"
            defaultValue={formation ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="experienceYears">Anos de experiência</Label>
          <Input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min={0}
            defaultValue={experienceYears ?? ""}
          />
        </div>
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar perfil de prestador"}
      </Button>
    </form>
  )
}
