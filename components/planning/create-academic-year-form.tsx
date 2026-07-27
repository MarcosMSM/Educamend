"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createAcademicYear } from "@/actions/planning"
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
  DialogDescription,
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

export function CreateAcademicYearForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const [curriculumBase, setCurriculumBase] = useState("")
  const boundAction = createAcademicYear.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setCurriculumBase("")
        }
      }}
    >
      <DialogTrigger render={<Button className="h-9 px-4" />}>
        <Plus />
        Novo ano letivo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo ano letivo</DialogTitle>
          <DialogDescription>
            Defina o período geral. Você poderá dividir em semestres ou
            trimestres em seguida.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Ex.: 2026" required />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Início</Label>
              <Input id="startDate" name="startDate" type="date" required />
              {state?.errors?.startDate && (
                <p className="text-sm text-destructive">
                  {state.errors.startDate[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Término</Label>
              <Input id="endDate" name="endDate" type="date" required />
              {state?.errors?.endDate && (
                <p className="text-sm text-destructive">
                  {state.errors.endDate[0]}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Ano Escolar</Label>
            <Select
              name="gradeLevel"
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
              <Label htmlFor="curriculumBaseOther">Qual currículo?</Label>
              <Input
                id="curriculumBaseOther"
                name="curriculumBaseOther"
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
                name="ccLevel"
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
              {pending ? "Criando..." : "Criar ano letivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
