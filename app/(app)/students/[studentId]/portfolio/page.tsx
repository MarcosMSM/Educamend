import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, Sparkles } from "lucide-react"

import { getHighlights, getPortfolioSettings } from "@/lib/data/portfolio"
import { PortfolioSettingsForm } from "@/components/portfolio/portfolio-settings-form"
import { CreateHighlightForm } from "@/components/portfolio/create-highlight-form"
import { HighlightRow } from "@/components/portfolio/highlight-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const settings = await getPortfolioSettings(studentId)

  if (!settings) {
    notFound()
  }

  const highlights = await getHighlights(studentId)

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/students/${studentId}/portfolio/generate`}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="font-heading font-medium">Gerar portfólio</p>
                <p className="text-sm text-muted-foreground">
                  Escolha um objetivo e monte uma versão do portfólio para ele.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/students/${studentId}/reports`}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-heading font-medium">Relatório acadêmico</p>
                <p className="text-sm text-muted-foreground">
                  Veja o relatório imprimível gerado a partir do planejamento.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurações do portfólio</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioSettingsForm
            studentId={studentId}
            headline={settings.headline}
            bio={settings.bio}
            portfolioPublic={settings.portfolio_public}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Destaques</h2>
        <CreateHighlightForm studentId={studentId} />
      </div>

      {highlights.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum destaque cadastrado ainda. Prêmios, certificados, cursos e
          atividades extracurriculares aparecem aqui.
        </p>
      ) : (
        <div className="grid gap-3">
          {highlights.map((highlight) => (
            <HighlightRow
              key={highlight.id}
              studentId={studentId}
              highlight={highlight}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Dica: os projetos do aluno também aparecem no portfólio público quando
        a visibilidade deles está marcada como &quot;público&quot; (ajuste em
        cada projeto, na aba Projetos).
      </p>
    </div>
  )
}
