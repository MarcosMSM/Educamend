import { ExperienceCard } from "@/components/journey/timeline/experience-card"
import type { JourneyExperience } from "@/lib/data/journey"

export function TimelineYearGroup({
  year,
  experiences,
  viewHrefFor,
}: {
  year: string
  experiences: JourneyExperience[]
  viewHrefFor: (experienceId: string) => string
}) {
  return (
    <section className="grid gap-4">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/85 py-1 backdrop-blur-sm">
        <span className="font-heading text-lg font-semibold">{year}</span>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {experiences.length} experiência{experiences.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative grid gap-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-tree-branches/40">
        {experiences.map((experience) => (
          <div key={experience.id} className="relative">
            <span className="absolute top-5 -left-6 size-4 rounded-full bg-tree-branches ring-4 ring-background" />
            <ExperienceCard experience={experience} viewHref={viewHrefFor(experience.id)} />
          </div>
        ))}
      </div>
    </section>
  )
}
