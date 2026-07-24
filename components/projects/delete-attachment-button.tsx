"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteProjectAttachment } from "@/actions/projects"
import { Button } from "@/components/ui/button"

export function DeleteAttachmentButton({
  studentId,
  projectId,
  attachmentId,
  storagePath,
}: {
  studentId: string
  projectId: string
  attachmentId: string
  storagePath: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      disabled={isPending}
      onClick={() =>
        startTransition(() =>
          deleteProjectAttachment(
            studentId,
            projectId,
            attachmentId,
            storagePath
          )
        )
      }
    >
      <Trash2 />
    </Button>
  )
}
