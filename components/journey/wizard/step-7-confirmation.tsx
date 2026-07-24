"use client"

import { useActionState } from "react"

import { submitJourneyExperience } from "@/actions/journey"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  JOURNEY_STATUS_LABELS,
  JOURNEY_VISIBILITIES,
  JOURNEY_VISIBILITY_LABELS,
  type JourneyStatus,
  type JourneyVisibility,
} from "@/lib/validation/journey"

export function Step7Confirmation({
  studentId,
  experienceId,
  onBack,
}: {
  studentId: string
  experienceId: string
  onBack: () => void
}) {
  const [state, action, pending] = useActionState(
    submitJourneyExperience.bind(null, studentId),
    undefined
  )

  return (
    <form action={action} className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Confirmação</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como essa experiência deve entrar na sua jornada.
        </p>
      </div>

      <input type="hidden" name="experienceId" value={experienceId} />

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue="autodeclarada">
            <SelectTrigger id="status">
              <SelectValue>
                {(value: JourneyStatus) => JOURNEY_STATUS_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="autodeclarada">
                Autodeclarada — só eu confirmo que aconteceu
              </SelectItem>
              <SelectItem value="aguardando_validacao">
                Aguardando validação — pedir confirmação de um responsável
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visibility">Visibilidade</Label>
          <Select name="visibility" defaultValue="family">
            <SelectTrigger id="visibility">
              <SelectValue>
                {(value: JourneyVisibility) => JOURNEY_VISIBILITY_LABELS[value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {JOURNEY_VISIBILITIES.map((visibility) => (
                <SelectItem key={visibility} value={visibility}>
                  {JOURNEY_VISIBILITY_LABELS[visibility]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={pending}>
          Voltar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Concluindo..." : "Concluir cadastro"}
        </Button>
      </div>
    </form>
  )
}
