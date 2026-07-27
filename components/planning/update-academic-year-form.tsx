"use client"

import { useActionState, useState } from "react"
import { Pencil } from "lucide-react"

import { updateAcademicYear } from "@/actions/planning"
import {
  CC_LEVEL_OPTIONS,
  CURRICULUM_BASE_LABELS,
  CURRICULUM_BASE_OPTIONS,
  GRADE_LEVEL_OPTIONS,
} from "@/lib/validation/planning"
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

const STATUS_LABELS = {
  planning: "Planejamento",
  active: "Em andamento",
  completed: "Concluído",
}

export function UpdateAcademicYearForm({
  studentId,
  academicYear,
}: {
  studentId: string
  academicYear: {
    id: string
    name: string
    start_date: string
    end_date: string
    status: string
    grade_level: string | null
    curriculum_base: string | null
    curriculum_base_other: string | null
    cc_level: string | null
  }
}) {
  const [open, setOpen] = useState(false)
  const [curriculumBase, setCurriculumBase] = useState(
    academicYear.curriculum_base ?? ""
  )
  const boundAction = updateAcademicYear.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setCurriculumBase(academicYear.curriculum_base ?? "")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button size="sm" variant="outline" className="text-foreground" />}
      >
        <Pencil />
        Editar ano
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar ano letivo</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="academicYearId" value={academicYear.id} />
          <div className="grid gap-2">
            <Label htmlFor="year-name">Nome</Label>
            <Input
              id="year-name"
              name="name"
              defaultValue={academicYear.name}
              required
            />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year-startDate">Início</Label>
              <Input
                id="year-startDate"
                name="startDate"
                type="date"
                defaultValue={academicYear.start_date}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year-endDate">Término</Label>
              <Input
                id="year-endDate"
                name="endDate"
                type="date"
                defaultValue={academicYear.end_date}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              name="status"
              defaultValue={academicYear.status}
              items={STATUS_LABELS}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planejamento</SelectItem>
                <SelectItem value="active">Em andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Ano Escolar</Label>
            <Select
              key={academicYear.grade_level ?? "new"}
              name="gradeLevel"
              defaultValue={academicYear.grade_level ?? undefined}
              items={Object.fromEntries(GRADE_LEVEL_OPTIONS.map((g) => [g, g]))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_LEVEL_OPTIONS.map((gradeLevel) => (
                  <SelectItem key={gradeLevel} value={gradeLevel}>
                    {gradeLevel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Currículo Base</Label>
            <Select
              name="curriculumBase"
              value={curriculumBase}
              onValueChange={(value) => setCurriculumBase(value ?? "")}
              items={CURRICULUM_BASE_LABELS}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {CURRICULUM_BASE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {CURRICULUM_BASE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {curriculumBase === "outro" && (
            <div className="grid gap-2">
              <Label htmlFor="year-curriculumBaseOther">Qual currículo?</Label>
              <Input
                key={curriculumBase}
                id="year-curriculumBaseOther"
                name="curriculumBaseOther"
                defaultValue={academicYear.curriculum_base_other ?? ""}
                placeholder="Nome do currículo"
              />
              {state?.errors?.curriculumBaseOther && (
                <p className="text-sm text-destructive">
                  {state.errors.curriculumBaseOther[0]}
                </p>
              )}
            </div>
          )}
          {curriculumBase === "cc" && (
            <div className="grid gap-2">
              <Label>Nível (Classical Conversations)</Label>
              <Select
                key={curriculumBase}
                name="ccLevel"
                defaultValue={academicYear.cc_level ?? undefined}
                items={Object.fromEntries(CC_LEVEL_OPTIONS.map((c) => [c, c]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CC_LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.ccLevel && (
                <p className="text-sm text-destructive">
                  {state.errors.ccLevel[0]}
                </p>
              )}
            </div>
          )}
          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
