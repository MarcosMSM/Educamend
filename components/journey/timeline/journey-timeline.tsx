import { journeyExperienceYear } from "@/components/journey/format-period"
import { TimelineYearGroup } from "@/components/journey/timeline/timeline-year-group"
import type { JourneyExperience } from "@/lib/data/journey"

export function JourneyTimeline({
  experiences,
  viewHrefFor,
}: {
  experiences: JourneyExperience[]
  viewHrefFor: (experienceId: string) => string
}) {
  const groups = new Map<string, JourneyExperience[]>()

  for (const experience of experiences) {
    const year = journeyExperienceYear(experience)
    const group = groups.get(year) ?? []
    group.push(experience)
    groups.set(year, group)
  }

  const years = [...groups.keys()].sort((a, b) => b.localeCompare(a))

  return (
    <div className="grid gap-8">
      {years.map((year) => (
        <TimelineYearGroup
          key={year}
          year={year}
          experiences={groups.get(year)!}
          viewHrefFor={viewHrefFor}
        />
      ))}
    </div>
  )
}
