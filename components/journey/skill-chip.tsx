import { Badge } from "@/components/ui/badge"
import { JOURNEY_SKILL_LABELS, type JourneySkill } from "@/lib/validation/journey"

export function SkillChip({ skill }: { skill: JourneySkill }) {
  return (
    <Badge variant="secondary" className="font-normal">
      {JOURNEY_SKILL_LABELS[skill]}
    </Badge>
  )
}
