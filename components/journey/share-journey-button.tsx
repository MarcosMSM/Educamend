"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function ShareJourneyButton({ studentId }: { studentId: string }) {
  async function handleShare() {
    const url = `${window.location.origin}/portfolio/${studentId}`

    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link do portfólio copiado.")
    } catch {
      toast.error("Não foi possível copiar o link. Copie manualmente: " + url)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 />
      Compartilhar
    </Button>
  )
}
