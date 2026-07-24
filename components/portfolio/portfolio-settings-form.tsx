"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { updatePortfolioSettings } from "@/actions/portfolio"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function PortfolioSettingsForm({
  studentId,
  headline,
  bio,
  portfolioPublic,
}: {
  studentId: string
  headline: string | null
  bio: string | null
  portfolioPublic: boolean
}) {
  const boundAction = updatePortfolioSettings.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="headline">Título (headline)</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="Ex.: Estudante apaixonado por ciências e robótica"
          defaultValue={headline ?? ""}
          maxLength={120}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Sobre</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Um resumo sobre o aluno, interesses e objetivos."
          defaultValue={bio ?? ""}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Portfólio público</p>
          <p className="text-sm text-muted-foreground">
            Quando ativado, qualquer pessoa com o link pode ver os projetos e
            destaques marcados como &quot;público&quot;.
          </p>
        </div>
        <Switch name="portfolioPublic" defaultChecked={portfolioPublic} />
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
        {portfolioPublic && (
          <Button
            variant="outline"
            render={<Link href={`/portfolio/${studentId}`} target="_blank" />}
            nativeButton={false}
          >
            <ExternalLink />
            Ver portfólio público
          </Button>
        )}
      </div>
    </form>
  )
}
