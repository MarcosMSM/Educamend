"use client"

import { useActionState, useState } from "react"
import { PenLine } from "lucide-react"

import { updateStudentGradeLevel } from "@/actions/students"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EditGradeLevelForm({
  studentId,
  gradeLevel,
}: {
  studentId: string
  gradeLevel: string | null
}) {
  const [open, setOpen] = useState(false)
  const boundAction = updateStudentGradeLevel.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!state?.message, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PenLine />
        <span className="sr-only">Editar série/ano</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Série/ano</DialogTitle>
          <DialogDescription>Ex: 2º Ano Ensino Médio</DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gradeLevel">Série/ano</Label>
            <Input
              id="gradeLevel"
              name="gradeLevel"
              defaultValue={gradeLevel ?? ""}
              placeholder="Ex: 2º Ano Ensino Médio"
            />
          </div>
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
