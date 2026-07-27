"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createCourse, updateCourse } from "@/actions/courses"
import {
  GRADE_LABELS,
  GRADE_OPTIONS,
  NEW_DISCIPLINE_VALUE,
  SPECIAL_COURSE_LABELS,
  SPECIAL_COURSE_OPTIONS,
} from "@/lib/validation/courses"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"

type Option = { id: string; name: string }
type DisciplineOption = Option & { area_id: string }

type Course = {
  id: string
  term_id: string
  area_id: string
  discipline_id: string
  title: string
  resource: string | null
  special_course: string | null
  grade: string | null
  credits: number | null
  notes: string | null
}

export function CourseForm({
  studentId,
  academicYearId,
  terms,
  availableAreas,
  availableDisciplines,
  course,
  triggerClassName,
  triggerSize,
}: {
  studentId: string
  academicYearId: string
  terms: Option[]
  availableAreas: Option[]
  availableDisciplines: DisciplineOption[]
  course?: Course
  triggerClassName?: string
  triggerSize?: "default" | "sm"
}) {
  const [open, setOpen] = useState(false)
  const [areaId, setAreaId] = useState(course?.area_id ?? "")
  const [disciplineId, setDisciplineId] = useState(course?.discipline_id ?? "")
  const isEditing = !!course

  const boundAction = isEditing
    ? updateCourse.bind(null, studentId)
    : createCourse.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setAreaId(course?.area_id ?? "")
      setDisciplineId(course?.discipline_id ?? "")
    }
  }

  function handleAreaChange(value: string | null) {
    setAreaId(value ?? "")
    setDisciplineId("")
  }

  function handleDisciplineChange(value: string | null) {
    setDisciplineId(value ?? "")
  }

  const termItems = Object.fromEntries(terms.map((t) => [t.id, t.name]))
  const areaItems = Object.fromEntries(
    availableAreas.map((a) => [a.id, a.name])
  )
  const disciplinesForArea = availableDisciplines.filter(
    (d) => d.area_id === areaId
  )
  const disciplineItems = Object.fromEntries([
    ...disciplinesForArea.map((d) => [d.id, d.name]),
    [NEW_DISCIPLINE_VALUE, "Outro (nova disciplina)"],
  ])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size={triggerSize ?? (isEditing ? "sm" : "default")}
            variant={isEditing ? "outline" : "default"}
            className={cn(triggerClassName)}
          />
        }
      >
        {isEditing ? (
          "Editar"
        ) : (
          <>
            <Plus />
            Adicionar curso
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar curso" : "Novo curso"}</DialogTitle>
        </DialogHeader>
        <form key={course?.id ?? "new"} action={action} className="grid gap-4">
          {isEditing && (
            <input type="hidden" name="courseId" value={course.id} />
          )}
          <input type="hidden" name="academicYearId" value={academicYearId} />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Área</Label>
              <Select
                name="areaId"
                value={areaId}
                onValueChange={handleAreaChange}
                items={areaItems}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {availableAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.areaId && (
                <p className="text-sm text-destructive">
                  {state.errors.areaId[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Disciplina</Label>
              <Select
                name="disciplineId"
                value={disciplineId}
                onValueChange={handleDisciplineChange}
                items={disciplineItems}
                disabled={!areaId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={areaId ? "Selecione" : "Escolha a área primeiro"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {disciplinesForArea.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_DISCIPLINE_VALUE}>
                    Outro (nova disciplina)
                  </SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.disciplineId && (
                <p className="text-sm text-destructive">
                  {state.errors.disciplineId[0]}
                </p>
              )}
              {disciplineId === NEW_DISCIPLINE_VALUE && (
                <div className="grid gap-1">
                  <Input
                    name="newDisciplineName"
                    placeholder="Nome da nova disciplina"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Será adicionada à área escolhida e ficará disponível para
                    os próximos cursos.
                  </p>
                  {state?.errors?.newDisciplineName && (
                    <p className="text-sm text-destructive">
                      {state.errors.newDisciplineName[0]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-title">Nome do curso</Label>
            <Input
              id="course-title"
              name="title"
              placeholder="Ex.: Inglês 11"
              defaultValue={course?.title}
              required
            />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-resource">Material / recurso didático</Label>
            <Textarea
              id="course-resource"
              name="resource"
              rows={2}
              placeholder="Ex.: Apostila Apologia Science"
              defaultValue={course?.resource ?? ""}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Período</Label>
              <Select
                key={course?.term_id ?? "new"}
                name="termId"
                defaultValue={course?.term_id}
                items={termItems}
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

            <div className="grid gap-2">
              <Label>Nota</Label>
              <Select
                key={course?.grade ?? "new"}
                name="grade"
                defaultValue={course?.grade ?? undefined}
                items={GRADE_LABELS}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {GRADE_LABELS[grade]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course-credits">Créditos</Label>
              <Input
                id="course-credits"
                name="credits"
                type="number"
                step="0.25"
                min="0"
                placeholder="0.50"
                defaultValue={course?.credits ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Curso especial</Label>
            <Select
              key={course?.special_course ?? "nenhum"}
              name="specialCourse"
              defaultValue={course?.special_course ?? "nenhum"}
              items={SPECIAL_COURSE_LABELS}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPECIAL_COURSE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {SPECIAL_COURSE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-notes">Observações</Label>
            <Textarea
              id="course-notes"
              name="notes"
              rows={2}
              defaultValue={course?.notes ?? ""}
            />
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Adicionar curso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
