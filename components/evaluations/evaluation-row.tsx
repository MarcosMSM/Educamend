"use client"

import { useActionState, useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteEvaluation, updateEvaluationScore } from "@/actions/evaluations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Evaluation = {
  id: string
  title: string
  type: string
  date: string
  max_score: number
  score: number | null
  feedback: string | null
  subjects: { id: string; name: string } | null
  terms: { id: string; name: string } | null
}

export function EvaluationRow({
  studentId,
  evaluation,
}: {
  studentId: string
  evaluation: Evaluation
}) {
  const boundAction = updateEvaluationScore.bind(null, studentId)
  const [, action, pending] = useActionState(boundAction, undefined)
  const [isDeleting, startDeleteTransition] = useTransition()

  return (
    <Card>
      <CardContent className="grid gap-3 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-medium">{evaluation.title}</p>
            <p className="text-sm text-muted-foreground">
              {evaluation.subjects?.name} · {evaluation.terms?.name}{" "}
              · {new Date(evaluation.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{evaluation.type}</Badge>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={isDeleting}
              onClick={() =>
                startDeleteTransition(() =>
                  deleteEvaluation(studentId, evaluation.id)
                )
              }
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        <form action={action} className="flex items-end gap-2">
          <input type="hidden" name="evaluationId" value={evaluation.id} />
          <div className="grid gap-1">
            <label className="text-xs text-muted-foreground">
              Nota (de {evaluation.max_score})
            </label>
            <Input
              name="score"
              type="number"
              step="0.1"
              defaultValue={evaluation.score ?? ""}
              className="w-24"
            />
          </div>
          <div className="grid flex-1 gap-1">
            <label className="text-xs text-muted-foreground">Feedback</label>
            <Input name="feedback" defaultValue={evaluation.feedback ?? ""} />
          </div>
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            {pending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
