"use client"

import { PenLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatJourneyPeriod } from "@/components/journey/format-period"
import { JOURNEY_ATTACHMENT_ICONS, JOURNEY_CATEGORY_ICONS } from "@/components/journey/journey-meta"
import { SkillChip } from "@/components/journey/skill-chip"
import type { JourneyDraftFields } from "@/components/journey/wizard/journey-wizard"
import {
  JOURNEY_ATTACHMENT_KIND_LABELS,
  JOURNEY_CATEGORY_LABELS,
  type JourneyCategory,
} from "@/lib/validation/journey"

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5 rounded-2xl bg-muted/40 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <PenLine className="size-3" />
          Editar
        </button>
      </div>
      {children}
    </div>
  )
}

export function Step6Review({
  category,
  fields,
  onEditStep,
  onBack,
  onNext,
}: {
  category: JourneyCategory
  fields: JourneyDraftFields
  onEditStep: (step: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const CategoryIcon = JOURNEY_CATEGORY_ICONS[category]

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Revisão</h2>
        <p className="text-sm text-muted-foreground">
          Confira tudo antes de concluir o cadastro. Você pode voltar a qualquer etapa.
        </p>
      </div>

      <div className="grid gap-3">
        <ReviewSection title="Tipo de experiência" onEdit={() => onEditStep(1)}>
          <div className="flex items-center gap-2 text-sm">
            <CategoryIcon className="size-4 text-primary" />
            {JOURNEY_CATEGORY_LABELS[category]}
          </div>
        </ReviewSection>

        <ReviewSection title="Informações principais" onEdit={() => onEditStep(2)}>
          <p className="text-sm font-medium">{fields.title || "Sem título"}</p>
          <p className="text-sm text-muted-foreground">
            {fields.organization || "Organização não informada"}
            {fields.startDate || fields.endDate
              ? ` · ${formatJourneyPeriod(fields.startDate || null, fields.endDate || null)}`
              : ""}
            {fields.hours ? ` · ${fields.hours}h` : ""}
          </p>
        </ReviewSection>

        <ReviewSection title="História e reflexão" onEdit={() => onEditStep(3)}>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {fields.description || "Nenhuma descrição informada."}
          </p>
        </ReviewSection>

        <ReviewSection title="Competências" onEdit={() => onEditStep(4)}>
          {fields.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {fields.skills.map((skill) => (
                <SkillChip key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma competência selecionada.</p>
          )}
        </ReviewSection>

        <ReviewSection title="Evidências" onEdit={() => onEditStep(5)}>
          {fields.attachments.length > 0 ? (
            <ul className="grid gap-1">
              {fields.attachments.map((attachment) => {
                const Icon = JOURNEY_ATTACHMENT_ICONS[attachment.kind]
                return (
                  <li key={attachment.id} className="flex items-center gap-2 text-sm">
                    <Icon className="size-3.5 text-muted-foreground" />
                    {attachment.label}
                    <span className="text-xs text-muted-foreground">
                      ({JOURNEY_ATTACHMENT_KIND_LABELS[attachment.kind]})
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma evidência anexada.</p>
          )}
        </ReviewSection>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>Continuar</Button>
      </div>
    </div>
  )
}
