"use client"

import { addProjectAttachment } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AttachmentUploadForm({
  studentId,
  projectId,
}: {
  studentId: string
  projectId: string
}) {
  const boundAction = addProjectAttachment.bind(null, studentId, projectId)

  return (
    <form action={boundAction} className="flex gap-2">
      <Input name="file" type="file" required />
      <Button type="submit" size="sm" variant="outline">
        Enviar
      </Button>
    </form>
  )
}
