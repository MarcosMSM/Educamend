"use client"

import { useActionState } from "react"

import { createMaterial } from "@/actions/materials"
import { MATERIAL_TYPES } from "@/lib/validation/materials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const MATERIAL_TYPE_LABELS: Record<(typeof MATERIAL_TYPES)[number], string> = {
  livro: "Livro",
  video: "Vídeo",
  apostila: "Apostila",
  link: "Link",
  outro: "Outro",
}

type Subject = { id: string; name: string }
type Term = { id: string; name: string }

export function CreateMaterialForm({
  studentId,
  availableSubjects,
  terms,
}: {
  studentId: string
  availableSubjects: Subject[]
  terms: Term[]
}) {
  const boundAction = createMaterial.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required />
        {state?.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
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
          <Label>Tipo</Label>
          <Select name="type" defaultValue="outro" items={MATERIAL_TYPE_LABELS}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {MATERIAL_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {terms.length > 0 && (
        <div className="grid gap-2">
          <Label>Período (opcional)</Label>
          <Select
            name="termId"
            items={Object.fromEntries(
              terms.map((term) => [term.id, term.name])
            )}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Nenhum período específico" />
            </SelectTrigger>
            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="url">Link (opcional)</Label>
        <Input id="url" name="url" type="url" placeholder="https://..." />
        {state?.errors?.url && (
          <p className="text-sm text-destructive">{state.errors.url[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">Arquivo (opcional)</Label>
        <Input id="file" name="file" type="file" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando..." : "Adicionar material"}
      </Button>
    </form>
  )
}
