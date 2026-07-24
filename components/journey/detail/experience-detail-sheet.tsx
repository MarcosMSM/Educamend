"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ExternalLink, PenLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DeleteExperienceButton } from "@/components/journey/delete-experience-button"
import { ExperienceStatusBadge } from "@/components/journey/experience-status-badge"
import { formatJourneyPeriod } from "@/components/journey/format-period"
import { JOURNEY_ATTACHMENT_ICONS, JOURNEY_CATEGORY_ICONS } from "@/components/journey/journey-meta"
import { SkillChip } from "@/components/journey/skill-chip"
import type { JourneyExperience } from "@/lib/data/journey"
import { JOURNEY_ATTACHMENT_KIND_LABELS, JOURNEY_CATEGORY_LABELS } from "@/lib/validation/journey"

export function ExperienceDetailSheet({
  experience,
  studentId,
}: {
  experience: JourneyExperience | null
  studentId: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleOpenChange(open: boolean) {
    if (open) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete("experience")
    router.push(`${pathname}?${params.toString()}`)
  }

  const Icon = experience ? JOURNEY_CATEGORY_ICONS[experience.category] : null

  return (
    <Sheet open={!!experience} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto">
        {experience && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                {Icon && (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                )}
                <ExperienceStatusBadge status={experience.status} />
              </div>
              <SheetTitle>{experience.title}</SheetTitle>
              <SheetDescription>
                {JOURNEY_CATEGORY_LABELS[experience.category]} ·{" "}
                {formatJourneyPeriod(experience.start_date, experience.end_date)}
                {experience.organization ? ` · ${experience.organization}` : ""}
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 gap-5 overflow-y-auto">
              {experience.hours != null && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Horas dedicadas</p>
                  <p className="text-sm">{experience.hours}h</p>
                </div>
              )}

              {experience.description && (
                <div className="grid gap-1">
                  <p className="text-xs font-medium text-muted-foreground">Descrição</p>
                  <p className="text-sm whitespace-pre-wrap">{experience.description}</p>
                </div>
              )}

              {experience.reflection && (
                <div className="grid gap-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    História e reflexão
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{experience.reflection}</p>
                </div>
              )}

              {experience.skills.length > 0 && (
                <div className="grid gap-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Competências</p>
                  <div className="flex flex-wrap gap-1">
                    {experience.skills.map((skill) => (
                      <SkillChip key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Evidências</p>
                {experience.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma evidência anexada ainda.
                  </p>
                ) : (
                  <ul className="grid gap-1.5">
                    {experience.attachments.map((attachment) => {
                      const AttachmentIcon = JOURNEY_ATTACHMENT_ICONS[attachment.kind]
                      const isLink = /^https?:\/\//.test(attachment.url)
                      return (
                        <li
                          key={attachment.id}
                          className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm"
                        >
                          <AttachmentIcon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1 truncate">{attachment.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {JOURNEY_ATTACHMENT_KIND_LABELS[attachment.kind]}
                          </span>
                          {isLink && (
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {experience.validated_by && (
                <p className="text-xs text-muted-foreground">
                  Validado por {experience.validated_by}
                  {experience.validated_at &&
                    ` em ${new Date(`${experience.validated_at}T00:00:00`).toLocaleDateString("pt-BR")}`}
                  .
                </p>
              )}
            </div>

            <SheetFooter>
              <DeleteExperienceButton
                studentId={studentId}
                experienceId={experience.id}
                experienceTitle={experience.title}
              />
              <Button
                render={<Link href={`/students/${studentId}/journey/${experience.id}/edit?step=2`} />}
                nativeButton={false}
                size="sm"
              >
                <PenLine />
                Editar
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
