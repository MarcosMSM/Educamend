"use client"

import { useActionState, useTransition } from "react"
import { Trash2 } from "lucide-react"

import { deleteHighlight, updateHighlightVisibility } from "@/actions/portfolio"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Highlight = {
  id: string
  title: string
  description: string | null
  category: string
  date: string | null
  visibility: "private" | "family" | "public"
}

export function HighlightRow({
  studentId,
  highlight,
}: {
  studentId: string
  highlight: Highlight
}) {
  const boundAction = updateHighlightVisibility.bind(null, studentId)
  const [, action] = useActionState(boundAction, undefined)
  const [isDeleting, startDeleteTransition] = useTransition()

  return (
    <Card>
      <CardContent className="grid gap-2 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-medium">{highlight.title}</p>
            <p className="text-sm text-muted-foreground">
              {highlight.category}
              {highlight.date &&
                ` · ${new Date(highlight.date).toLocaleDateString("pt-BR")}`}
            </p>
            {highlight.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {highlight.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={isDeleting}
            onClick={() =>
              startDeleteTransition(() =>
                deleteHighlight(studentId, highlight.id)
              )
            }
          >
            <Trash2 />
          </Button>
        </div>

        <form action={action} className="flex items-center gap-2">
          <input type="hidden" name="highlightId" value={highlight.id} />
          <Badge variant="outline">visibilidade</Badge>
          <Select
            name="visibility"
            defaultValue={highlight.visibility}
            items={{ private: "Privado", family: "Família", public: "Público" }}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Privado</SelectItem>
              <SelectItem value="family">Família</SelectItem>
              <SelectItem value="public">Público</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="sm" variant="outline">
            Salvar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
