"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createHighlight } from "@/actions/portfolio"
import { HIGHLIGHT_CATEGORIES } from "@/lib/validation/portfolio"
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
import { Textarea } from "@/components/ui/textarea"

const CATEGORY_LABELS: Record<(typeof HIGHLIGHT_CATEGORIES)[number], string> = {
  premio: "Prêmio",
  certificado: "Certificado",
  atividade: "Atividade extracurricular",
  voluntariado: "Voluntariado",
  curso: "Curso",
  outro: "Outro",
}

export function CreateHighlightForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const boundAction = createHighlight.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Novo destaque
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo destaque do portfólio</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hl-title">Título</Label>
            <Input id="hl-title" name="title" placeholder="Ex.: Medalha de ouro na olimpíada de matemática" required />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hl-description">Descrição</Label>
            <Textarea id="hl-description" name="description" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select name="category" defaultValue="outro" items={CATEGORY_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HIGHLIGHT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hl-date">Data</Label>
              <Input id="hl-date" name="date" type="date" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Visibilidade</Label>
            <Select
              name="visibility"
              defaultValue="private"
              items={{ private: "Privado", family: "Família", public: "Público" }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privado</SelectItem>
                <SelectItem value="family">Família</SelectItem>
                <SelectItem value="public">Público</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Adicionar destaque"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
