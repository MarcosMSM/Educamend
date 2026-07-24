import { notFound } from "next/navigation"
import { Award, FolderKanban } from "lucide-react"

import { getPublicPortfolio } from "@/lib/data/portfolio"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const portfolio = await getPublicPortfolio(studentId)

  if (!portfolio) {
    notFound()
  }

  const { student, timeline } = portfolio

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-semibold">{student.full_name}</h1>
        {student.headline && (
          <p className="mt-1 text-muted-foreground">{student.headline}</p>
        )}
        {student.bio && (
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            {student.bio}
          </p>
        )}
      </header>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Trajetória
      </h2>

      {timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum item público neste portfólio ainda.
        </p>
      ) : (
        <div className="grid gap-3">
          {timeline.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-start gap-3 py-4">
                <div className="mt-0.5 text-muted-foreground">
                  {item.kind === "project" ? (
                    <FolderKanban className="size-4" />
                  ) : (
                    <Award className="size-4" />
                  )}
                </div>
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    {item.tag && <Badge variant="secondary">{item.tag}</Badge>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Portfólio gerado pelo Educamend Portal
      </footer>
    </div>
  )
}
