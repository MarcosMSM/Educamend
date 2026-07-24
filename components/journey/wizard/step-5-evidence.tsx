"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JOURNEY_ATTACHMENT_ICONS } from "@/components/journey/journey-meta"
import {
  JOURNEY_ATTACHMENT_KINDS,
  JOURNEY_ATTACHMENT_KIND_LABELS,
  type JourneyAttachmentInput,
  type JourneyAttachmentKind,
} from "@/lib/validation/journey"

export function Step5Evidence({
  attachments,
  onAdd,
  onRemove,
  onBack,
  onNext,
}: {
  attachments: JourneyAttachmentInput[]
  onAdd: (attachment: JourneyAttachmentInput) => void
  onRemove: (id: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const [kind, setKind] = useState<JourneyAttachmentKind>("link")
  const [label, setLabel] = useState("")
  const [url, setUrl] = useState("")

  function handleAdd() {
    if (!label.trim() || !url.trim()) return
    onAdd({ id: crypto.randomUUID(), kind, label: label.trim(), url: url.trim() })
    setLabel("")
    setUrl("")
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-heading text-lg font-medium">Evidências</h2>
        <p className="text-sm text-muted-foreground">
          Adicione fotos, vídeos, arquivos, links ou certificados que comprovem essa experiência.
        </p>
      </div>

      {attachments.length > 0 && (
        <ul className="grid gap-1.5">
          {attachments.map((attachment) => {
            const Icon = JOURNEY_ATTACHMENT_ICONS[attachment.kind]
            return (
              <li
                key={attachment.id}
                className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{attachment.label}</span>
                <span className="text-xs text-muted-foreground">
                  {JOURNEY_ATTACHMENT_KIND_LABELS[attachment.kind]}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remover evidência"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="grid gap-3 rounded-2xl bg-muted/40 p-3">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <Select value={kind} onValueChange={(value) => setKind(value as JourneyAttachmentKind)}>
              <SelectTrigger size="sm" className="w-full sm:w-36">
                <SelectValue>
                  {(value: JourneyAttachmentKind) => JOURNEY_ATTACHMENT_KIND_LABELS[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {JOURNEY_ATTACHMENT_KINDS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {JOURNEY_ATTACHMENT_KIND_LABELS[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="evidence-label">Nome</Label>
            <Input
              id="evidence-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Ex: Certificado de conclusão"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="evidence-url">Link ou nome do arquivo</Label>
          <div className="flex gap-2">
            <Input
              id="evidence-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://... ou nome-do-arquivo.pdf"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              disabled={!label.trim() || !url.trim()}
            >
              <Plus />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>Próximo</Button>
      </div>
    </div>
  )
}
