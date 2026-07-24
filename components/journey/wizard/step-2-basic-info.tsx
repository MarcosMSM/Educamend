"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TextField = "title" | "organization" | "startDate" | "endDate" | "hours"

export function Step2BasicInfo({
  title,
  organization,
  startDate,
  endDate,
  hours,
  onChange,
  onBlurField,
  onBack,
  onNext,
}: {
  title: string
  organization: string
  startDate: string
  endDate: string
  hours: string
  onChange: (field: TextField, value: string) => void
  onBlurField: (field: TextField) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Informações principais</h2>
        <p className="text-sm text-muted-foreground">
          Conte o essencial: o que foi, onde aconteceu e quando.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => onChange("title", event.target.value)}
            onBlur={() => onBlurField("title")}
            placeholder="Ex: Hackathon de Inovação Educacional"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="organization">Instituição ou organização</Label>
          <Input
            id="organization"
            value={organization}
            onChange={(event) => onChange("organization", event.target.value)}
            onBlur={() => onBlurField("organization")}
            placeholder="Ex: Escola, empresa, ONG..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Data de início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => onChange("startDate", event.target.value)}
              onBlur={() => onBlurField("startDate")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">Data de término</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => onChange("endDate", event.target.value)}
              onBlur={() => onBlurField("endDate")}
            />
            <p className="text-xs text-muted-foreground">Deixe em branco se ainda estiver em andamento.</p>
          </div>
        </div>

        <div className="grid gap-2 sm:max-w-40">
          <Label htmlFor="hours">Horas dedicadas</Label>
          <Input
            id="hours"
            type="number"
            min={0}
            value={hours}
            onChange={(event) => onChange("hours", event.target.value)}
            onBlur={() => onBlurField("hours")}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={!title.trim()}>
          Próximo
        </Button>
      </div>
    </div>
  )
}
