"use client"

import { useTransition } from "react"
import { X } from "lucide-react"

import { removeSubjectFromCurriculum } from "@/actions/curriculum"
import { Button } from "@/components/ui/button"

export function RemoveSubjectButton({
  studentId,
  curriculumId,
  subjectId,
}: {
  studentId: string
  curriculumId: string
  subjectId: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      disabled={isPending}
      onClick={() =>
        startTransition(() =>
          removeSubjectFromCurriculum(studentId, curriculumId, subjectId)
        )
      }
    >
      <X />
    </Button>
  )
}
