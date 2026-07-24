"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteCourse } from "@/actions/courses"
import { Button } from "@/components/ui/button"

export function DeleteCourseButton({
  studentId,
  courseId,
}: {
  studentId: string
  courseId: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => startTransition(() => deleteCourse(studentId, courseId))}
    >
      <Trash2 />
    </Button>
  )
}
