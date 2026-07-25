import { cn } from "@/lib/utils"
import { GRADE_LABELS, GRADE_OPTIONS } from "@/lib/validation/courses"

type Grade = (typeof GRADE_OPTIONS)[number]
type Tone = "progress" | "warning" | "danger" | "done"

const TONE_CLASSES: Record<Tone, { pill: string; dot: string }> = {
  progress: { pill: "bg-tree-fruit/15 text-tree-fruit", dot: "bg-tree-fruit" },
  warning: { pill: "bg-amber-500/15 text-amber-600", dot: "bg-amber-500" },
  danger: { pill: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  done: { pill: "bg-tree-branches/15 text-tree-branches", dot: "bg-tree-branches" },
}

function getCourseStatus(grade: string | null): { label: string; tone: Tone } {
  if (!grade || grade === "em_andamento") {
    return { label: "Em andamento", tone: "progress" }
  }
  if (grade === "incompleto") {
    return { label: "Incompleto", tone: "warning" }
  }
  if (grade === "f") {
    return { label: "Reprovado", tone: "danger" }
  }
  const label = GRADE_LABELS[grade as Grade]
  return { label: label ? `Concluído · ${label}` : "Concluído", tone: "done" }
}

export function CourseStatusPill({ grade }: { grade: string | null }) {
  const status = getCourseStatus(grade)
  const tone = TONE_CLASSES[status.tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone.pill
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} />
      {status.label}
    </span>
  )
}
