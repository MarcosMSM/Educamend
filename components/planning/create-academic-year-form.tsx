"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createAcademicYear } from "@/actions/planning"
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

export function CreateAcademicYearForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const boundAction = createAcademicYear.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
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
