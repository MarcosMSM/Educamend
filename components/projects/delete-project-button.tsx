"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteProject } from "@/actions/projects"
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

export function DeleteProjectButton({
  studentId,
  projectId,
  projectTitle,
}: {
  studentId: string
  projectId: string
  projectTitle: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 />
        Remover projeto
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover {projectTitle}?</DialogTitle>
          <DialogDescription>
            Isso apaga o projeto e todos os anexos. Essa ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              startTransition(() => deleteProject(studentId, projectId))
            }
          >
            {isPending ? "Removendo..." : "Remover definitivamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
