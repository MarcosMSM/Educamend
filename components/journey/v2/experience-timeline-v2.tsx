import { journeyExperienceYear } from "@/components/journey/format-period"
import { ExperienceCardV2 } from "@/components/journey/v2/experience-card-v2"
import type { JourneyExperience } from "@/lib/data/journey"

export function ExperienceTimelineV2({
  experiences,
  viewHrefFor,
}: {
  experiences: JourneyExperience[]
  viewHrefFor: (experienceId: string) => string
}) {
  const years = [...new Set(experiences.map(journeyExperienceYear))].sort((a, b) =>
    b.localeCompare(a)
  )

  return (
    <div className="grid gap-8">
      {years.map((year) => {
        const yearExperiences = experiences.filter(
          (experience) => journeyExperienceYear(experience) === year
        )
        return (
          <section key={year} className="grid gap-4">
            <div className="flex items-baseline gap-2 rounded-full bg-tree-branches/10 px-4 py-2 text-tree-branches">
              <span className="font-sans text-base font-semibold">{year}</span>
              <span className="text-xs">
                {yearExperiences.length} experiência{yearExperiences.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {yearExperiences.map((experience) => (
                <ExperienceCardV2
                  key={experience.id}
                  experience={experience}
                  viewHref={viewHrefFor(experience.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
