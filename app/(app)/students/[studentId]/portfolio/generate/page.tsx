import Link from "next/link"
import { Award, Briefcase, GraduationCap, Plane, Share2, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { ShareJourneyButton } from "@/components/journey/share-journey-button"
import { Card, CardContent } from "@/components/ui/card"

const PORTFOLIO_OBJECTIVES = [
  { value: "universidade", label: "Universidade", icon: GraduationCap },
  { value: "primeiro_emprego", label: "Primeiro emprego", icon: Briefcase },
  { value: "bolsa", label: "Bolsa", icon: Award },
  { value: "intercambio", label: "Intercâmbio", icon: Plane },
  { value: "compartilhar", label: "Compartilhar", icon: Share2 },
  { value: "personalizado", label: "Personalizado", icon: Sparkles },
] as const

export default async function GeneratePortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { studentId } = await params
  const sp = await searchParams
  const objetivoParam = typeof sp.objetivo === "string" ? sp.objetivo : undefined
  const selected = PORTFOLIO_OBJECTIVES.find((objective) => objective.value === objetivoParam)

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Gerar portfólio</h1>
        <p className="text-sm text-muted-foreground">
          Para qual objetivo você deseja criar um portfólio?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PORTFOLIO_OBJECTIVES.map((objective) => {
          const Icon = objective.icon
          const isSelected = selected?.value === objective.value
          return (
            <Link
              key={objective.value}
              href={`?objetivo=${objective.value}`}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <span className="text-sm font-medium">{objective.label}</span>
            </Link>
          )
        })}
      </div>

      {selected && (
        <Card>
          <CardContent className="grid gap-3 py-6 text-center">
            {selected.value === "compartilhar" ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Copie o link público do portfólio para compartilhar com quem quiser.
                </p>
                <div className="mx-auto">
                  <ShareJourneyButton studentId={studentId} />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                A geração automática do portfólio para este objetivo está em construção. Em
                breve reunimos aqui as experiências e dados mais relevantes para{" "}
                {selected.label.toLowerCase()}.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
