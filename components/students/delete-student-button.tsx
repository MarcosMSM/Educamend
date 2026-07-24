"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteStudent } from "@/actions/students"
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

export function DeleteStudentButton({
  studentId,
  studentName,
}: {
  studentId: string
  studentName: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 />
        Remover aluno
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover {studentName}?</DialogTitle>
          <DialogDescription>
            Isso apaga permanentemente o cadastro do aluno e todos os dados
            acadêmicos vinculados (currículo, planejamento, materiais,
            avaliações e projetos). Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => deleteStudent(studentId))}
          >
            {isPending ? "Removendo..." : "Remover definitivamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
