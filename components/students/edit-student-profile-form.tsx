"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Camera, PenLine } from "lucide-react"

import { updateStudentProfile } from "@/actions/students"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { initials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function EditStudentProfileForm({
  studentId,
  studentName,
  gradeLevel,
  avatarUrl,
}: {
  studentId: string
  studentName: string
  gradeLevel: string | null
  avatarUrl: string | null
}) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const boundAction = updateStudentProfile.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  useEffect(() => {
    if (!open) {
      setPreview(null)
      setRemoveAvatar(false)
    }
  }, [open])

  const displayUrl = preview ?? (removeAvatar ? null : avatarUrl)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setRemoveAvatar(false)
    }
  }

  function handleRemovePhoto() {
    setPreview(null)
    setRemoveAvatar(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PenLine />
        <span className="sr-only">Editar perfil do aluno</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Nome, foto e série/ano do estudante.</DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="removeAvatar" value={removeAvatar ? "true" : "false"} />

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-20 text-xl">
                {displayUrl && <AvatarImage src={displayUrl} alt={studentName} />}
                <AvatarFallback>{initials(studentName)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background"
              >
                <Camera className="size-3.5" />
                <span className="sr-only">Alterar foto</span>
              </button>
            </div>
            <div className="grid gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Escolher foto
              </Button>
              {displayUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-left text-xs text-muted-foreground hover:text-destructive"
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome</Label>
            <Input id="fullName" name="fullName" defaultValue={studentName} required />
            {state?.errors?.fullName && (
              <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>
            )}
          </div>

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
