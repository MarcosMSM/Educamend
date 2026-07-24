"use client"

import { useActionState } from "react"

import { updateProject } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UpdateProjectStatusForm({
  studentId,
  projectId,
  status,
  visibility,
}: {
  studentId: string
  projectId: string
  status: string
  visibility: string
}) {
  const boundAction = updateProject.bind(null, studentId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid gap-1">
        <label className="text-xs text-muted-foreground">Status</label>
        <Select
          name="status"
          defaultValue={status}
          items={{
            planejado: "Planejado",
            em_andamento: "Em andamento",
            concluido: "Concluído",
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planejado">Planejado</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-muted-foreground">Visibilidade</label>
        <Select
          name="visibility"
          defaultValue={visibility}
          items={{ private: "Privado", family: "Família", public: "Público" }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Privado</SelectItem>
            <SelectItem value="family">Família</SelectItem>
            <SelectItem value="public">Público</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>
      {state?.message && (
        <p className="w-full text-sm text-destructive">{state.message}</p>
      )}
    </form>
  )
}
