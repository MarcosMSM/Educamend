"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { JOURNEY_SKILLS, JOURNEY_SKILL_LABELS, type JourneySkill } from "@/lib/validation/journey"

export function Step4Skills({
  skills,
  onToggleSkill,
  onBack,
  onNext,
}: {
  skills: JourneySkill[]
  onToggleSkill: (skill: JourneySkill) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Competências desenvolvidas</h2>
        <p className="text-sm text-muted-foreground">
          Selecione as habilidades que essa experiência ajudou a desenvolver.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {JOURNEY_SKILLS.map((skill) => {
          const isSelected = skills.includes(skill)
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleSkill(skill)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted/50"
              )}
            >
              {JOURNEY_SKILL_LABELS[skill]}
            </button>
          )
        })}
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
