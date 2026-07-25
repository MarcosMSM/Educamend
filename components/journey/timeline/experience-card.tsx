import Link from "next/link"
import { ArrowRight, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ExperienceStatusBadge } from "@/components/journey/experience-status-badge"
import { formatJourneyPeriod } from "@/components/journey/format-period"
import { JOURNEY_CATEGORY_ICONS, JOURNEY_GROUP_STYLES } from "@/components/journey/journey-meta"
import { SkillChip } from "@/components/journey/skill-chip"
import type { JourneyExperience } from "@/lib/data/journey"
import { JOURNEY_CATEGORY_GROUPS, JOURNEY_CATEGORY_LABELS } from "@/lib/validation/journey"

const VISIBLE_SKILLS = 4

export function ExperienceCard({
  experience,
  viewHref,
}: {
  experience: JourneyExperience
  viewHref: string
}) {
  const Icon = JOURNEY_CATEGORY_ICONS[experience.category]
  const group = JOURNEY_CATEGORY_GROUPS[experience.category]
  const groupStyle = JOURNEY_GROUP_STYLES[group]
  const visibleSkills = experience.skills.slice(0, VISIBLE_SKILLS)
  const hiddenSkillCount = experience.skills.length - visibleSkills.length

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="grid gap-3 sm:grid-cols-[auto_1fr]">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full ring-1",
            groupStyle.bg,
            groupStyle.text,
            groupStyle.ring
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-heading leading-snug font-medium">{experience.title}</p>
              <p className="text-xs text-muted-foreground">
                {JOURNEY_CATEGORY_LABELS[experience.category]} ·{" "}
                {formatJourneyPeriod(experience.start_date, experience.end_date)}
              </p>
            </div>
            <ExperienceStatusBadge status={experience.status} />
          </div>

          {experience.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{experience.description}</p>
          )}

          {experience.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleSkills.map((skill) => (
                <SkillChip key={skill} skill={skill} />
              ))}
              {hiddenSkillCount > 0 && (
                <span className="self-center text-xs text-muted-foreground">
                  +{hiddenSkillCount}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="size-3.5" />
              {experience.attachments.length > 0
                ? `${experience.attachments.length} evidência${experience.attachments.length > 1 ? "s" : ""}`
                : "Sem evidências"}
            </div>
            <Button render={<Link href={viewHref} />} nativeButton={false} variant="ghost">
              Visualizar
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
