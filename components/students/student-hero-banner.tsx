import { cn, initials } from "@/lib/utils"
import { getDailyStudentQuote } from "@/lib/student-quotes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditStudentProfileForm } from "@/components/students/edit-student-profile-form"

const YEAR_STATUS_LABELS: Record<string, string> = {
  planning: "Planejamento",
  active: "Em andamento",
  completed: "Concluído",
}

type YearRoadmapItem = { id: string; name: string; status: string }

export function StudentHeroBanner({
  studentId,
  studentName,
  gradeLevel,
  avatarUrl,
  years,
}: {
  studentId: string
  studentName: string
  gradeLevel: string | null
  avatarUrl: string | null
  years: YearRoadmapItem[]
}) {
  const quote = getDailyStudentQuote()

  return (
    <div className="relative hidden overflow-hidden rounded-2xl bg-sidebar px-5 py-3.5 text-white md:block">
      <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 shrink-0 ring-1 ring-white/15">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={studentName} />}
            <AvatarFallback className="bg-white/10 font-heading text-base font-semibold text-white">
              {initials(studentName)}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-white">{studentName}</h1>
                <EditStudentProfileForm
                  studentId={studentId}
                  studentName={studentName}
                  gradeLevel={gradeLevel}
                  avatarUrl={avatarUrl}
                />
              </div>
              <p className="text-sm font-bold text-white italic">&quot;{quote}&quot;</p>
            </div>
            <p className="text-xs text-white/60">
              Estudante · {gradeLevel || "Série não informada"} · Jornada em construção · Educamend
            </p>
          </div>
        </div>

        {years.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pl-6">
            {years.map((year, index) => (
              <div key={year.id} className="flex items-center gap-3">
                <div className="grid shrink-0 gap-0.5 text-center">
                  <span
                    className={cn(
                      "font-heading text-xs",
                      year.status === "active" ? "font-semibold text-white" : "text-white/50"
                    )}
                  >
                    {year.name}
                  </span>
                  <span className="text-[0.625rem] text-white/50">
                    {YEAR_STATUS_LABELS[year.status] ?? year.status}
                  </span>
                </div>
                {index < years.length - 1 && (
                  <span className="relative h-px w-6 shrink-0 bg-white/20">
                    <span
                      className={cn(
                        "absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tree-fruit",
                        year.status === "completed" ? "bg-tree-fruit" : "bg-transparent"
                      )}
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
