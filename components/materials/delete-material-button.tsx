"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteMaterial } from "@/actions/materials"
import { Button } from "@/components/ui/button"

export function DeleteMaterialButton({
  studentId,
  materialId,
  storagePath,
}: {
  studentId: string
  materialId: string
  storagePath: string | null
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      disabled={isPending}
      onClick={() =>
        startTransition(() =>
          deleteMaterial(studentId, materialId, storagePath)
        )
      }
    >
      <Trash2 />
    </Button>
  )
}
