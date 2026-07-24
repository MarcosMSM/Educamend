"use client"

import { useActionState, useState } from "react"
import { PenLine } from "lucide-react"

import { updateFamilyCity } from "@/actions/families"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EditFamilyCityForm({
  familyId,
  city,
}: {
  familyId: string
  city: string | null
}) {
  const [open, setOpen] = useState(false)
  const boundAction = updateFamilyCity.bind(null, familyId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!state?.message, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PenLine />
        <span className="sr-only">Editar cidade</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cidade da família</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" name="city" defaultValue={city ?? ""} placeholder="Ex: São Paulo" />
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
