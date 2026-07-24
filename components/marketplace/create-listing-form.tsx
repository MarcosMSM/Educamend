"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createListing } from "@/actions/marketplace"
import {
  PRICE_UNITS,
  SERVICE_CATEGORIES,
  SERVICE_MODALITIES,
} from "@/lib/validation/marketplace"
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

const CATEGORY_LABELS: Record<(typeof SERVICE_CATEGORIES)[number], string> = {
  aula: "Aula",
  tutoria: "Tutoria",
  mentoria: "Mentoria",
  outro: "Outro",
}

const MODALITY_LABELS: Record<(typeof SERVICE_MODALITIES)[number], string> = {
  online: "Online",
  presencial: "Presencial",
  hibrido: "Híbrido",
}

const PRICE_UNIT_LABELS: Record<(typeof PRICE_UNITS)[number], string> = {
  hora: "por hora",
  sessao: "por sessão",
  pacote: "por pacote",
}

type Subject = { id: string; name: string }

export function CreateListingForm({
  availableSubjects,
}: {
  availableSubjects: Subject[]
}) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createListing, undefined)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Oferecer serviço
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Oferecer aula ou tutoria</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="listing-title">Título</Label>
            <Input
              id="listing-title"
              name="title"
              placeholder="Ex.: Aulas de reforço em matemática"
              required
            />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="listing-description">Descrição</Label>
            <Textarea id="listing-description" name="description" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Disciplina (opcional)</Label>
              <Select
                name="subjectId"
                items={Object.fromEntries(
                  availableSubjects.map((subject) => [subject.id, subject.name])
                )}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select name="category" defaultValue="aula" items={CATEGORY_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Modalidade</Label>
              <Select name="modality" defaultValue="online" items={MODALITY_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_MODALITIES.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {MODALITY_LABELS[modality]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="listing-price">Preço (R$)</Label>
              <Input id="listing-price" name="price" type="number" step="0.01" />
            </div>
            <div className="grid gap-2">
              <Label>Unidade</Label>
              <Select name="priceUnit" defaultValue="hora" items={PRICE_UNIT_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {PRICE_UNIT_LABELS[unit]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Publicando..." : "Publicar anúncio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
