"use client"

import { useActionState, useState } from "react"
import { Pencil } from "lucide-react"

import { updateAcademicYear } from "@/actions/planning"
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
  }
}) {
  const [open, setOpen] = useState(false)
  const boundAction = updateAcademicYear.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
