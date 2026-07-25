import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { ExperienceStatusBadge } from "@/components/journey/experience-status-badge"
import { formatJourneyPeriod } from "@/components/journey/format-period"
import { JOURNEY_CATEGORY_ICONS, JOURNEY_GROUP_STYLES } from "@/components/journey/journey-meta"
import { SkillChip } from "@/components/journey/skill-chip"
import type { JourneyExperience } from "@/lib/data/journey"
import { JOURNEY_CATEGORY_GROUPS, JOURNEY_CATEGORY_LABELS } from "@/lib/validation/journey"

const VISIBLE_SKILLS = 3

export function ExperienceCardV2({
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
    <div className="grid gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-foreground/10 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              groupStyle.bg,
              groupStyle.text
            )}
          >
            <Icon className="size-4.5" />
          </div>
          <div className="grid gap-0.5">
            <p className="font-sans leading-snug font-bold">{experience.title}</p>
            {experience.organization && (
              <p className="text-xs text-muted-foreground">{experience.organization}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {JOURNEY_CATEGORY_LABELS[experience.category]}
            </p>
          </div>
        </div>
        <ExperienceStatusBadge status={experience.status} />
      </div>

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

      <div className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="grid gap-0.5">
          <p className="text-xs text-muted-foreground">Período</p>
          <p className="text-sm font-medium">
            {formatJourneyPeriod(experience.start_date, experience.end_date)}
          </p>
        </div>

        {experience.hours != null && (
          <div className="grid gap-0.5 text-right">
            <p className="text-xs text-muted-foreground">Carga horária</p>
            <p className="text-sm font-medium">{experience.hours.toLocaleString("pt-BR")}h</p>
          </div>
        )}

        <Link
          href={viewHref}
          className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border transition-colors hover:bg-muted"
        >
          <ArrowUpRight className="size-4 text-muted-foreground" />
          <span className="sr-only">Visualizar</span>
        </Link>
      </div>
    </div>
  )
}
