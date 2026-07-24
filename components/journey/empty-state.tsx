import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState({
  icon: Icon = Compass,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: LucideIcon
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
        <div className="grid gap-1">
          <p className="font-heading text-base font-medium">{title}</p>
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        {actionHref && actionLabel && (
          <Button render={<Link href={actionHref} />} nativeButton={false} size="sm" className="mt-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
