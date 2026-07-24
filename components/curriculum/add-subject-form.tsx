"use client"

import { useActionState } from "react"

import { addSubjectToCurriculum } from "@/actions/curriculum"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Subject = { id: string; name: string }

export function AddSubjectForm({
  studentId,
  curriculumId,
  availableSubjects,
}: {
  studentId: string
  curriculumId: string
  availableSubjects: Subject[]
}) {
  const boundAction = addSubjectToCurriculum.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="curriculumId" value={curriculumId} />
      <div className="grid gap-1">
        <Select
          name="existingSubjectId"
          items={Object.fromEntries(
            availableSubjects.map((subject) => [subject.id, subject.name])
          )}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Disciplina do catálogo" />
          </SelectTrigger>
          <SelectContent>
            {availableSubjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span className="text-sm text-muted-foreground">ou</span>
      <div className="grid gap-1">
        <Input name="newSubjectName" placeholder="Nova disciplina" />
        {state?.errors?.newSubjectName && (
          <p className="text-sm text-destructive">
            {state.errors.newSubjectName[0]}
          </p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Adicionando..." : "Adicionar"}
      </Button>
      {state?.message && (
        <p className="w-full text-sm text-destructive">{state.message}</p>
      )}
    </form>
  )
}
