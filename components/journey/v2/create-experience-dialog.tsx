"use client"

import { useActionState, useState } from "react"
import { Plus, X } from "lucide-react"

import { createJourneyExperienceQuick } from "@/actions/journey"
import { useCloseDialogOnSuccess } from "@/hooks/use-close-dialog-on-success"
import { cn } from "@/lib/utils"
import { EXPERIENCE_TYPES, EXPERIENCE_TYPE_LABELS } from "@/lib/journey-types"
import { JOURNEY_SKILLS, JOURNEY_SKILL_LABELS, JOURNEY_STATUSES, JOURNEY_STATUS_LABELS } from "@/lib/validation/journey"
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

type EvidenceRow = { id: string; label: string; url: string }

export function CreateExperienceDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [evidences, setEvidences] = useState<EvidenceRow[]>([])

  const boundAction = createJourneyExperienceQuick.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  useCloseDialogOnSuccess(pending, !!(state?.errors || state?.message), setOpen)

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    )
  }

  function addEvidence() {
    setEvidences((current) => [...current, { id: crypto.randomUUID(), label: "", url: "" }])
  }

  function updateEvidence(id: string, patch: Partial<EvidenceRow>) {
    setEvidences((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  function removeEvidence(id: string) {
    setEvidences((current) => current.filter((row) => row.id !== id))
  }

  const attachmentsPayload = JSON.stringify(
    evidences
      .filter((row) => row.label.trim() && row.url.trim())
      .map((row) => ({ id: row.id, kind: "link", label: row.label.trim(), url: row.url.trim() }))
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSelectedSkills([])
          setEvidences([])
        }
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus />
        Registrar experiência
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-sans">Registrar experiência</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid max-h-[70vh] gap-4 overflow-y-auto px-1 py-1">
          <input type="hidden" name="attachments" value={attachmentsPayload} />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exp-title">Título</Label>
              <Input id="exp-title" name="title" placeholder="Ex.: Estágio em marketing" required />
              {state?.errors?.title && (
                <p className="text-sm text-destructive">{state.errors.title[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select name="type" defaultValue="projeto" items={EXPERIENCE_TYPE_LABELS}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: string) => EXPERIENCE_TYPE_LABELS[value as keyof typeof EXPERIENCE_TYPE_LABELS]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EXPERIENCE_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exp-organization">Organização (opcional)</Label>
            <Input
              id="exp-organization"
              name="organization"
              placeholder="Ex.: Empresa, ONG, escola parceira"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exp-start">Início</Label>
              <Input id="exp-start" name="startDate" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-end">Término</Label>
              <Input id="exp-end" name="endDate" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-hours">Carga horária</Label>
              <Input id="exp-hours" name="hours" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select name="status" defaultValue="autodeclarada" items={JOURNEY_STATUS_LABELS}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) => JOURNEY_STATUS_LABELS[value as keyof typeof JOURNEY_STATUS_LABELS]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {JOURNEY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {JOURNEY_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exp-description">Descrição</Label>
            <Textarea
              id="exp-description"
              name="description"
              rows={3}
              placeholder="O que foi feito, quais responsabilidades ou aprendizados."
            />
          </div>

          <div className="grid gap-2">
            <Label>Competências desenvolvidas</Label>
            <div className="flex flex-wrap gap-1.5">
              {JOURNEY_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors",
                      active
                        ? "bg-primary text-primary-foreground ring-primary"
                        : "text-muted-foreground ring-border hover:text-foreground"
                    )}
                  >
                    {JOURNEY_SKILL_LABELS[skill]}
                  </button>
                )
              })}
            </div>
            {selectedSkills.map((skill) => (
              <input key={skill} type="hidden" name="skills" value={skill} />
            ))}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Evidências (opcional)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addEvidence}>
                <Plus />
                Adicionar
              </Button>
            </div>
            {evidences.length > 0 && (
              <div className="grid gap-2">
                {evidences.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <Input
                      value={row.label}
                      onChange={(event) => updateEvidence(row.id, { label: event.target.value })}
                      placeholder="Nome da evidência"
                      className="flex-1"
                    />
                    <Input
                      value={row.url}
                      onChange={(event) => updateEvidence(row.id, { url: event.target.value })}
                      placeholder="Link"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeEvidence(row.id)}
                    >
                      <X />
                      <span className="sr-only">Remover evidência</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Registrar experiência"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
