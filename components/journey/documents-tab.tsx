import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { EmptyState } from "@/components/journey/empty-state"
import { JOURNEY_ATTACHMENT_ICONS } from "@/components/journey/journey-meta"
import { Card, CardContent } from "@/components/ui/card"
import type { JourneyExperience } from "@/lib/data/journey"
import { JOURNEY_ATTACHMENT_KIND_LABELS } from "@/lib/validation/journey"

export function DocumentsTab({
  experiences,
  viewHrefFor,
}: {
  experiences: JourneyExperience[]
  viewHrefFor: (experienceId: string) => string
}) {
  const documents = experiences.flatMap((experience) =>
    experience.attachments.map((attachment) => ({ attachment, experience }))
  )

  if (documents.length === 0) {
    return (
      <EmptyState
        title="Nenhum documento anexado"
        description="Fotos, vídeos, arquivos, links e certificados que você anexar às experiências aparecem aqui."
      />
    )
  }

  return (
    <Card>
      <CardContent className="grid gap-1.5">
        {documents.map(({ attachment, experience }) => {
          const Icon = JOURNEY_ATTACHMENT_ICONS[attachment.kind]
          const isLink = /^https?:\/\//.test(attachment.url)

          return (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted/50"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{attachment.label}</p>
                <Link
                  href={viewHrefFor(experience.id)}
                  className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  {experience.title}
                </Link>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {JOURNEY_ATTACHMENT_KIND_LABELS[attachment.kind]}
              </span>
              {isLink && (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
