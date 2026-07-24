import { cn } from "@/lib/utils"

export function StepIndicator({
  current,
  total,
  label,
}: {
  current: number
  total: number
  label: string
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          Passo {current} de {total}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2.5 flex-1 rounded-full transition-colors",
              index < current ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}
