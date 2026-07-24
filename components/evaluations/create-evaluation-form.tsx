"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createEvaluation } from "@/actions/evaluations"
import { EVALUATION_TYPES } from "@/lib/validation/evaluations"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EVALUATION_TYPE_LABELS: Record<(typeof EVALUATION_TYPES)[number], string> = {
  prova: "Prova",
  trabalho: "Trabalho",
  projeto: "Projeto",
  participacao: "Participação",
  outro: "Outro",
}

type Subject = { id: string; name: string }
type Term = { id: string; name: string }

export function CreateEvaluationForm({
  studentId,
  availableSubjects,
  terms,
}: {
  studentId: string
  availableSubjects: Subject[]
  terms: Term[]
}) {
  const [open, setOpen] = useState(false)
  const boundAction = createEvaluation.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  if (terms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Crie um período no planejamento antes de lançar avaliações.
      </p>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Nova avaliação
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova avaliação</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="eval-title">Título</Label>
            <Input id="eval-title" name="title" required />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Disciplina</Label>
              <Select
                name="subjectId"
                items={Object.fromEntries(
                  availableSubjects.map((subject) => [subject.id, subject.name])
                )}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.subjectId && (
                <p className="text-sm text-destructive">
                  {state.errors.subjectId[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Período</Label>
              <Select
                name="termId"
                items={Object.fromEntries(
                  terms.map((term) => [term.id, term.name])
                )}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.termId && (
                <p className="text-sm text-destructive">
                  {state.errors.termId[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select name="type" defaultValue="prova" items={EVALUATION_TYPE_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVALUATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EVALUATION_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eval-date">Data</Label>
              <Input
                id="eval-date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="eval-maxScore">Nota máxima</Label>
              <Input
                id="eval-maxScore"
                name="maxScore"
                type="number"
                step="0.1"
                defaultValue="10"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eval-score">Nota (opcional)</Label>
              <Input id="eval-score" name="score" type="number" step="0.1" />
            </div>
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar avaliação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
