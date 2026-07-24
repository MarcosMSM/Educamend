"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TextField = "description" | "reflection"

export function Step3StoryReflection({
  description,
  reflection,
  onChange,
  onBlurField,
  onBack,
  onNext,
}: {
  description: string
  reflection: string
  onChange: (field: TextField, value: string) => void
  onBlurField: (field: TextField) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">História e reflexão</h2>
        <p className="text-sm text-muted-foreground">
          Descreva o que você fez e o que essa experiência significou para você.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="description">O que você fez</Label>
          <Textarea
            id="description"
            rows={4}
            value={description}
            onChange={(event) => onChange("description", event.target.value)}
            onBlur={() => onBlurField("description")}
            placeholder="Descreva a experiência: contexto, atividades, resultados..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reflection">O que você aprendeu</Label>
          <Textarea
            id="reflection"
            rows={4}
            value={reflection}
            onChange={(event) => onChange("reflection", event.target.value)}
            onBlur={() => onBlurField("reflection")}
            placeholder="O que essa experiência mudou em você? Que lição ficou?"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>Próximo</Button>
      </div>
    </div>
  )
}
