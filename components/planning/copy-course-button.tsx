"use client"

import { useTransition } from "react"
import { Copy } from "lucide-react"

import { duplicateCourse } from "@/actions/courses"
import { Button } from "@/components/ui/button"

export function CopyCourseButton({
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
      onClick={() => startTransition(() => duplicateCourse(studentId, courseId))}
    >
      <Copy />
    </Button>
  )
}
