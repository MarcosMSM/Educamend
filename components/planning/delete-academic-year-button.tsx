"use client"

import { useTransition } from "react"
import { X } from "lucide-react"

import { deleteAcademicYear } from "@/actions/planning"
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

export function DeleteAcademicYearButton({
  studentId,
  academicYearId,
  academicYearName,
  triggerClassName,
}: {
  studentId: string
  academicYearId: string
  academicYearName: string
  triggerClassName?: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={triggerClassName}
            aria-label="Remover ano letivo"
          />
        }
      >
        <X />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover o ano {academicYearName}?</DialogTitle>
          <DialogDescription>
            Isso apaga permanentemente esse ano letivo e tudo o que está
            nele — períodos, cursos e créditos cadastrados. Essa ação não
            pode ser desfeita.
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
              startTransition(() => deleteAcademicYear(studentId, academicYearId))
            }
          >
            {isPending ? "Removendo..." : "Remover definitivamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
