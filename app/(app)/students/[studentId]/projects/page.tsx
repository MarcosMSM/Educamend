import Link from "next/link"
import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { getAvailableSubjects } from "@/lib/data/curriculum"
import { getProjectsByStudent } from "@/lib/data/projects"
import { CreateProjectForm } from "@/components/projects/create-project-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { relation } from "@/lib/utils"

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    redirect("/onboarding/family")
  }

  const [projects, availableSubjects] = await Promise.all([
    getProjectsByStudent(studentId),
    getAvailableSubjects(family.id),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projetos</h2>
        <CreateProjectForm
          studentId={studentId}
          availableSubjects={availableSubjects}
        />
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum projeto cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/students/${studentId}/projects/${project.id}`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{project.status}</Badge>
                  <Badge variant="outline">{project.visibility}</Badge>
                  {relation(project.subjects)?.name && (
                    <Badge variant="outline">
                      {relation(project.subjects)?.name}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
