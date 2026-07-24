"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteJourneyExperience } from "@/actions/journey"
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

export function DeleteExperienceButton({
  studentId,
  experienceId,
  experienceTitle,
}: {
  studentId: string
  experienceId: string
  experienceTitle: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 />
        Excluir
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir &quot;{experienceTitle}&quot;?</DialogTitle>
          <DialogDescription>
            Essa experiência, junto com suas evidências e competências registradas, será
            removida permanentemente da sua jornada. Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              startTransition(() => deleteJourneyExperience(studentId, experienceId))
            }
          >
            {isPending ? "Removendo..." : "Excluir definitivamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
