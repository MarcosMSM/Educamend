import {
  Archive,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  Briefcase,
  Building2,
  Church,
  Clock,
  Code2,
  Dumbbell,
  FileText,
  FlaskConical,
  HeartHandshake,
  ImageIcon,
  Lightbulb,
  Link2,
  Medal,
  Mic,
  Microscope,
  Music2,
  PenLine,
  Plane,
  Rocket,
  Sparkles,
  SquarePlay,
  TrendingUp,
  UserCheck,
  Video,
  type LucideIcon,
} from "lucide-react"

import type {
  JourneyAttachmentKind,
  JourneyCategory,
  JourneyGroup,
  JourneyStatus,
} from "@/lib/validation/journey"

/**
 * Presentation-only metadata for the journey module: icons, colors, badge
 * styles. Keeps `lib/validation/journey.ts` free of UI concerns so the
 * enums/labels there stay reusable outside the client.
 */

export const JOURNEY_CATEGORY_ICONS: Record<JourneyCategory, LucideIcon> = {
  projeto_pessoal: Lightbulb,
  hackathon: Code2,
  feira_ciencias: FlaskConical,
  olimpiada: Medal,
  robotica: Bot,
  startup: Rocket,
  voluntariado: HeartHandshake,
  trabalho: Briefcase,
  estagio: Building2,
  ministerio: Church,
  musica: Music2,
  esporte: Dumbbell,
  intercambio: Plane,
  curso: BookOpen,
  certificacao: Award,
  empreendedorismo: TrendingUp,
  publicacao: FileText,
  pesquisa: Microscope,
  podcast: Mic,
  youtube: SquarePlay,
  outro: Sparkles,
}

export const JOURNEY_GROUP_STYLES: Record<
  JourneyGroup,
  { bg: string; text: string; ring: string; dot: string }
> = {
  academico: {
    bg: "bg-[color-mix(in_oklch,var(--chart-1),transparent_85%)]",
    text: "text-[var(--chart-1)]",
    ring: "ring-[color-mix(in_oklch,var(--chart-1),transparent_70%)]",
    dot: "bg-[var(--chart-1)]",
  },
  tecnologia: {
    bg: "bg-[color-mix(in_oklch,var(--chart-2),transparent_85%)]",
    text: "text-[var(--chart-2)]",
    ring: "ring-[color-mix(in_oklch,var(--chart-2),transparent_70%)]",
    dot: "bg-[var(--chart-2)]",
  },
  social: {
    bg: "bg-[color-mix(in_oklch,var(--chart-3),transparent_85%)]",
    text: "text-[var(--chart-3)]",
    ring: "ring-[color-mix(in_oklch,var(--chart-3),transparent_70%)]",
    dot: "bg-[var(--chart-3)]",
  },
  profissional: {
    bg: "bg-[color-mix(in_oklch,var(--chart-4),transparent_85%)]",
    text: "text-[var(--chart-4)]",
    ring: "ring-[color-mix(in_oklch,var(--chart-4),transparent_70%)]",
    dot: "bg-[var(--chart-4)]",
  },
  pessoal: {
    bg: "bg-[color-mix(in_oklch,var(--chart-5),transparent_85%)]",
    text: "text-[var(--chart-5)]",
    ring: "ring-[color-mix(in_oklch,var(--chart-5),transparent_70%)]",
    dot: "bg-[var(--chart-5)]",
  },
}

export const JOURNEY_STATUS_ICONS: Record<JourneyStatus, LucideIcon> = {
  rascunho: PenLine,
  autodeclarada: UserCheck,
  aguardando_validacao: Clock,
  validada: BadgeCheck,
  arquivada: Archive,
}

export const JOURNEY_ATTACHMENT_ICONS: Record<JourneyAttachmentKind, LucideIcon> = {
  foto: ImageIcon,
  video: Video,
  arquivo: FileText,
  link: Link2,
  certificado: Award,
}

export const JOURNEY_STATUS_BADGE_CLASSES: Record<JourneyStatus, string> = {
  rascunho: "border border-dashed border-border bg-transparent text-muted-foreground",
  autodeclarada: "bg-secondary text-secondary-foreground",
  aguardando_validacao:
    "bg-[color-mix(in_oklch,var(--accent),transparent_85%)] text-[var(--accent)]",
  validada: "bg-[color-mix(in_oklch,var(--primary),transparent_85%)] text-primary",
  arquivada: "bg-muted text-muted-foreground/70",
}
