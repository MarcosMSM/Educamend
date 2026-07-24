"use client"

import { useTransition } from "react"

import { updateListingStatus } from "@/actions/marketplace"
import { Button } from "@/components/ui/button"

export function ListingStatusActions({
  listingId,
  status,
}: {
  listingId: string
  status: string
}) {
  const [isPending, startTransition] = useTransition()

  function setStatus(next: string) {
    startTransition(() => updateListingStatus(listingId, next))
  }

  return (
    <div className="flex gap-2">
      {status !== "active" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setStatus("active")}
        >
          Ativar
        </Button>
      )}
      {status === "active" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setStatus("paused")}
        >
          Pausar
        </Button>
      )}
      {status !== "archived" && (
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() => setStatus("archived")}
        >
          Arquivar
        </Button>
      )}
    </div>
  )
}
