"use client"

import { useTransition } from "react"
import { Copy, MoreHorizontal, Trash2 } from "lucide-react"

import { deleteCourse, duplicateCourse } from "@/actions/courses"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CourseActionsMenu({
  studentId,
  courseId,
}: {
  studentId: string
  courseId: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" disabled={isPending} />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            startTransition(() => duplicateCourse(studentId, courseId))
          }
        >
          <Copy />
          Copiar
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => startTransition(() => deleteCourse(studentId, courseId))}
        >
          <Trash2 />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
