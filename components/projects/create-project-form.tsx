"use client"

import { useActionState, useState } from "react"
import { Plus } from "lucide-react"

import { createProject } from "@/actions/projects"
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

type Subject = { id: string; name: string }

export function CreateProjectForm({
  studentId,
  availableSubjects,
}: {
  studentId: string
  availableSubjects: Subject[]
}) {
  const [open, setOpen] = useState(false)
  const boundAction = createProject.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Novo projeto
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">Título</Label>
            <Input id="project-title" name="title" required />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Descrição</Label>
            <Textarea id="project-description" name="description" rows={3} />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project-startDate">Início</Label>
              <Input id="project-startDate" name="startDate" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-endDate">Término</Label>
              <Input id="project-endDate" name="endDate" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                name="status"
                defaultValue="planejado"
                items={{
                  planejado: "Planejado",
                  em_andamento: "Em andamento",
                  concluido: "Concluído",
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejado">Planejado</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Criando..." : "Criar projeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
