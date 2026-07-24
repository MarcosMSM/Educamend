"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { JOURNEY_CATEGORY_ICONS, JOURNEY_GROUP_STYLES } from "@/components/journey/journey-meta"
import {
  JOURNEY_CATEGORIES,
  JOURNEY_CATEGORY_GROUPS,
  JOURNEY_CATEGORY_LABELS,
  type JourneyCategory,
} from "@/lib/validation/journey"

export function Step1Category({
  category,
  onSelect,
  onNext,
  isSubmitting,
  error,
  readOnly,
}: {
  category: JourneyCategory | null
  onSelect: (category: JourneyCategory) => void
  onNext: () => void
  isSubmitting: boolean
  error: string | null
  readOnly: boolean
}) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Que tipo de experiência foi essa?</h2>
        <p className="text-sm text-muted-foreground">
          Escolha a categoria que melhor descreve o que você viveu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {JOURNEY_CATEGORIES.map((item) => {
          const Icon = JOURNEY_CATEGORY_ICONS[item]
          const groupStyle = JOURNEY_GROUP_STYLES[JOURNEY_CATEGORY_GROUPS[item]]
          const isSelected = category === item

          return (
            <button
              key={item}
              type="button"
              disabled={readOnly}
              onClick={() => onSelect(item)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50",
                readOnly && "cursor-not-allowed opacity-70"
              )}
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  groupStyle.bg,
                  groupStyle.text
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-xs font-medium">{JOURNEY_CATEGORY_LABELS[item]}</span>
            </button>
          )
        })}
      </div>

      {readOnly && (
        <p className="text-xs text-muted-foreground">
          A categoria não pode ser alterada depois que a experiência é criada.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!category || isSubmitting}>
          {isSubmitting ? "Criando rascunho..." : "Próximo"}
        </Button>
      </div>
    </div>
  )
}
