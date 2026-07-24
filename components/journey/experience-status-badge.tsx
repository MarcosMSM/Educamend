import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { JOURNEY_STATUS_BADGE_CLASSES, JOURNEY_STATUS_ICONS } from "@/components/journey/journey-meta"
import { JOURNEY_STATUS_LABELS, type JourneyStatus } from "@/lib/validation/journey"

export function ExperienceStatusBadge({
  status,
  className,
}: {
  status: JourneyStatus
  className?: string
}) {
  const Icon = JOURNEY_STATUS_ICONS[status]

  return (
    <Badge
      variant="outline"
      className={cn("border-0", JOURNEY_STATUS_BADGE_CLASSES[status], className)}
    >
      <Icon data-icon="inline-start" />
      {JOURNEY_STATUS_LABELS[status]}
    </Badge>
  )
}
