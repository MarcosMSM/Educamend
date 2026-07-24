"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createTerm } from "@/actions/planning"
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

export function CreateTermForm({
  studentId,
  academicYearId,
}: {
  studentId: string
  academicYearId: string
}) {
  const [open, setOpen] = useState(false)
  const boundAction = createTerm.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus />
        Novo período
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo período</DialogTitle>
          <DialogDescription>
            Ex.: 1º semestre, 2º trimestre.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="academicYearId" value={academicYearId} />
          <div className="grid gap-2">
            <Label htmlFor="term-name">Nome</Label>
            <Input
              id="term-name"
              name="name"
              placeholder="Ex.: 1º semestre"
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
              <Label htmlFor="term-startDate">Início</Label>
              <Input
                id="term-startDate"
                name="startDate"
                type="date"
                required
              />
              {state?.errors?.startDate && (
                <p className="text-sm text-destructive">
                  {state.errors.startDate[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="term-endDate">Término</Label>
              <Input id="term-endDate" name="endDate" type="date" required />
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
              {pending ? "Criando..." : "Criar período"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
