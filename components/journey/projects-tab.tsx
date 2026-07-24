import { EmptyState } from "@/components/journey/empty-state"
import { JourneyTimeline } from "@/components/journey/timeline/journey-timeline"
import { PROJECT_LIKE_CATEGORIES, type JourneyExperience } from "@/lib/data/journey"

export function ProjectsTab({
  experiences,
  viewHrefFor,
}: {
  experiences: JourneyExperience[]
  viewHrefFor: (experienceId: string) => string
}) {
  const projects = experiences.filter((experience) =>
    PROJECT_LIKE_CATEGORIES.includes(experience.category)
  )

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        description="Hackathons, projetos pessoais, robótica, feiras de ciências e iniciativas de empreendedorismo aparecem aqui."
      />
    )
  }

  return <JourneyTimeline experiences={projects} viewHrefFor={viewHrefFor} />
}
