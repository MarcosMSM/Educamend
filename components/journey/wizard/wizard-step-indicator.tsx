import { AlertCircle, Check, Loader2 } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { WIZARD_STEP_COUNT, WIZARD_STEPS } from "@/components/journey/wizard/wizard-steps"
import type { AutosaveStatus } from "@/hooks/use-journey-autosave"

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export function WizardStepIndicator({
  currentStep,
  autosaveStatus,
  lastSavedAt,
}: {
  currentStep: number
  autosaveStatus?: AutosaveStatus
  lastSavedAt?: string | null
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Passo {currentStep} de {WIZARD_STEP_COUNT} · {WIZARD_STEPS[currentStep - 1]?.label}
        </span>

        {autosaveStatus && autosaveStatus !== "idle" && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              autosaveStatus === "error" ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {autosaveStatus === "saving" && (
              <>
                <Loader2 className="size-3 animate-spin" />
                Salvando...
              </>
            )}
            {autosaveStatus === "saved" && (
              <>
                <Check className="size-3" />
                Salvo automaticamente{lastSavedAt ? ` às ${formatTime(lastSavedAt)}` : ""}
              </>
            )}
            {autosaveStatus === "error" && (
              <>
                <AlertCircle className="size-3" />
                Não foi possível salvar
              </>
            )}
          </span>
        )}
      </div>

      <Progress value={(currentStep / WIZARD_STEP_COUNT) * 100} />

      <div className="hidden justify-between sm:flex">
        {WIZARD_STEPS.map((step) => (
          <span
            key={step.id}
            className={cn(
              "text-xs",
              step.id === currentStep
                ? "font-medium text-foreground"
                : step.id < currentStep
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
            )}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}
