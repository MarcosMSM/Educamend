import Link from "next/link"
import { notFound } from "next/navigation"
import { Citrus, GitBranch, Plus, Sparkles, Sprout, Trophy } from "lucide-react"

import { getStudentById } from "@/lib/data/students"
import { getPlanningOverview } from "@/lib/data/planning"
import { getJourneyExperiences, getJourneyStats } from "@/lib/data/journey"
import { getHighlights } from "@/lib/data/portfolio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteStudentButton } from "@/components/students/delete-student-button"
import { StudentHeroBanner } from "@/components/students/student-hero-banner"
import { JourneyOverviewCard, type JourneyStage } from "@/components/students/journey-overview-card"

export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const student = await getStudentById(studentId)

  if (!student) {
    notFound()
  }

  const [years, journeyStats, experiences, highlights] = await Promise.all([
    getPlanningOverview(studentId),
    getJourneyStats(studentId),
    getJourneyExperiences(studentId),
    getHighlights(studentId),
  ])

  const totalCourses = years.reduce((sum, year) => sum + year.courses.length, 0)
  const inProgressExperiences = experiences.filter(
    (experience) => experience.status === "rascunho" || experience.status === "aguardando_validacao"
  ).length
  const totalAttachments = experiences.reduce(
    (sum, experience) => sum + experience.attachments.length,
    0
  )

  const stages: JourneyStage[] = [
    {
      tone: "roots",
      icon: Sprout,
      step: "Etapa 01",
      title: "Aprendizagem",
      description: "Organize planejamentos, materiais, disciplinas e avaliações.",
      badges: [
        `${years.length} planejamento${years.length === 1 ? "" : "s"}`,
        `${totalCourses} disciplina${totalCourses === 1 ? "" : "s"}`,
      ],
      href: `/students/${studentId}/planning`,
    },
    {
      tone: "branches",
      icon: GitBranch,
      step: "Etapa 02",
      title: "Experiências",
      description: "Registre projetos, viagens, atividades, voluntariado e vivências práticas.",
      badges: [
        `${journeyStats.experiences} experiência${journeyStats.experiences === 1 ? "" : "s"}`,
        ...(inProgressExperiences > 0 ? [`${inProgressExperiences} em andamento`] : []),
      ],
      href: `/students/${studentId}/journey`,
    },
    {
      tone: "fruit",
      icon: Citrus,
      step: "Etapa 03",
      title: "Competências",
      description: "Identifique habilidades desenvolvidas ao longo da jornada.",
      badges: [
        `${journeyStats.skills} competência${journeyStats.skills === 1 ? "" : "s"}`,
        ...(journeyStats.skills > 0 ? ["Em evolução"] : []),
      ],
      href: `/students/${studentId}/journey/old?tab=skills`,
    },
    {
      tone: "harvest",
      icon: Trophy,
      step: "Etapa 04",
      title: "Portfólio",
      description: "Reúna trabalhos, certificados, produções e conquistas para compartilhar.",
      badges: [
        `${totalAttachments} evidência${totalAttachments === 1 ? "" : "s"}`,
        `${highlights.length} documento${highlights.length === 1 ? "" : "s"}`,
      ],
      href: `/students/${studentId}/portfolio/generate`,
    },
  ]

  return (
    <div className="grid gap-6">
      <StudentHeroBanner
        studentId={studentId}
        studentName={student.full_name}
        gradeLevel={student.grade_level}
        avatarUrl={student.avatar_url}
        years={years.map((year) => ({ id: year.id, name: year.name, status: year.status }))}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tree-fruit/15 text-tree-fruit">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="font-heading text-xl font-semibold">
              Jornada <span className="font-sans text-base font-normal text-muted-foreground">· Visão Geral</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Acompanhe os pilares que formam a trajetória acadêmica, pessoal e prática do
              estudante.
            </p>
          </div>
        </div>
        <Button render={<Link href={`/students/${studentId}/journey/new`} />} nativeButton={false} variant="outline">
          <Plus />
          Registrar nova etapa
        </Button>
      </div>

      <JourneyOverviewCard stages={stages} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {student.notes || "Nenhuma observação cadastrada."}
          </p>
        </CardContent>
      </Card>

      <div>
        <DeleteStudentButton studentId={student.id} studentName={student.full_name} />
      </div>
    </div>
  )
}
