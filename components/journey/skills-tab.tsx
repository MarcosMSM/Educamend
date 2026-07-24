import { EmptyState } from "@/components/journey/empty-state"
import { Progress } from "@/components/ui/progress"
import type { JourneyExperience } from "@/lib/data/journey"
import { JOURNEY_SKILL_LABELS, type JourneySkill } from "@/lib/validation/journey"

export function SkillsTab({ experiences }: { experiences: JourneyExperience[] }) {
  const counts = new Map<JourneySkill, number>()

  for (const experience of experiences) {
    for (const skill of experience.skills) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1)
    }
  }

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1])

  if (entries.length === 0) {
    return (
      <EmptyState
        title="Nenhuma competência registrada"
        description="As competências aparecem aqui conforme você associa habilidades às suas experiências no cadastro."
      />
    )
  }

  const max = entries[0][1]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map(([skill, count]) => (
        <div key={skill} className="grid gap-2 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{JOURNEY_SKILL_LABELS[skill]}</span>
            <span className="text-muted-foreground">
              {count} experiência{count > 1 ? "s" : ""}
            </span>
          </div>
          <Progress value={(count / max) * 100} />
        </div>
      ))}
    </div>
  )
}
