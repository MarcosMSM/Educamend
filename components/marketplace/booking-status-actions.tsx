"use client"

import { useTransition } from "react"

import { updateBookingStatus } from "@/actions/marketplace"
import { Button } from "@/components/ui/button"

export function BookingStatusActions({
  bookingId,
  status,
  role,
}: {
  bookingId: string
  status: string
  role: "requester" | "provider"
}) {
  const [isPending, startTransition] = useTransition()

  function setStatus(next: string) {
    startTransition(() => updateBookingStatus(bookingId, next))
  }

  if (role === "provider" && status === "pending") {
    return (
      <div className="flex gap-2">
        <Button size="sm" disabled={isPending} onClick={() => setStatus("accepted")}>
          Aceitar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setStatus("declined")}
        >
          Recusar
        </Button>
      </div>
    )
  }

  if (role === "provider" && status === "accepted") {
    return (
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => setStatus("completed")}>
        Marcar como concluída
      </Button>
    )
  }

  if (role === "requester" && (status === "pending" || status === "accepted")) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => setStatus("cancelled")}
      >
        Cancelar
      </Button>
    )
  }

  return null
}
