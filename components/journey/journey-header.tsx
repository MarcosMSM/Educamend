import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ShareJourneyButton } from "@/components/journey/share-journey-button"

export function JourneyHeader({ studentId }: { studentId: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Minha Jornada</h1>
        <p className="text-sm text-muted-foreground">
          As experiências que construíram quem você é.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          render={<Link href={`/students/${studentId}/journey/new`} />}
          nativeButton={false}
          size="sm"
        >
          <Plus />
          Registrar experiência
        </Button>
        <Button
          render={<Link href={`/students/${studentId}/portfolio/generate`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
        >
          Gerar portfólio
        </Button>
        <ShareJourneyButton studentId={studentId} />
      </div>
    </div>
  )
}
