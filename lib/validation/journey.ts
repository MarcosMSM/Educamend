import { z } from "zod"

export const JOURNEY_CATEGORIES = [
  "projeto_pessoal",
  "hackathon",
  "feira_ciencias",
  "olimpiada",
  "robotica",
  "startup",
  "voluntariado",
  "trabalho",
  "estagio",
  "ministerio",
  "musica",
  "esporte",
  "intercambio",
  "curso",
  "certificacao",
  "empreendedorismo",
  "publicacao",
  "pesquisa",
  "podcast",
  "youtube",
  "outro",
] as const

export type JourneyCategory = (typeof JOURNEY_CATEGORIES)[number]

export const JOURNEY_CATEGORY_LABELS: Record<JourneyCategory, string> = {
  projeto_pessoal: "Projeto pessoal",
  hackathon: "Hackathon",
  feira_ciencias: "Feira de Ciências",
  olimpiada: "Olimpíada",
  robotica: "Robótica",
  startup: "Startup",
  voluntariado: "Trabalho voluntário",
  trabalho: "Trabalho",
  estagio: "Estágio",
  ministerio: "Ministério",
  musica: "Música",
  esporte: "Esporte",
  intercambio: "Intercâmbio",
  curso: "Curso relevante",
  certificacao: "Certificação",
  empreendedorismo: "Empreendedorismo",
  publicacao: "Publicação",
  pesquisa: "Pesquisa",
  podcast: "Podcast",
  youtube: "Canal no YouTube",
  outro: "Outro",
}

/** Thematic grouping used to color-code categories and to shape AI insights. */
export const JOURNEY_GROUPS = [
  "academico",
  "tecnologia",
  "social",
  "profissional",
  "pessoal",
] as const

export type JourneyGroup = (typeof JOURNEY_GROUPS)[number]

export const JOURNEY_GROUP_LABELS: Record<JourneyGroup, string> = {
  academico: "Acadêmico",
  tecnologia: "Tecnologia",
  social: "Social e Comunidade",
  profissional: "Profissional",
  pessoal: "Pessoal e Bem-estar",
}

export const JOURNEY_CATEGORY_GROUPS: Record<JourneyCategory, JourneyGroup> = {
  feira_ciencias: "academico",
  olimpiada: "academico",
  curso: "academico",
  certificacao: "academico",
  pesquisa: "academico",
  publicacao: "academico",
  hackathon: "tecnologia",
  robotica: "tecnologia",
  startup: "tecnologia",
  empreendedorismo: "tecnologia",
  podcast: "tecnologia",
  youtube: "tecnologia",
  voluntariado: "social",
  ministerio: "social",
  intercambio: "social",
  trabalho: "profissional",
  estagio: "profissional",
  projeto_pessoal: "profissional",
  musica: "pessoal",
  esporte: "pessoal",
  outro: "pessoal",
}

/** Status flow: Rascunho -> Autodeclarada -> Aguardando validação -> Validada, com Arquivada como estado terminal alternativo. */
export const JOURNEY_STATUSES = [
  "rascunho",
  "autodeclarada",
  "aguardando_validacao",
  "validada",
  "arquivada",
] as const

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number]

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  rascunho: "Rascunho",
  autodeclarada: "Autodeclarada",
  aguardando_validacao: "Aguardando validação",
  validada: "Validada",
  arquivada: "Arquivada",
}

export const JOURNEY_SKILLS = [
  "criatividade",
  "comunicacao",
  "programacao",
  "lideranca",
  "empatia",
  "organizacao",
  "pensamento_critico",
  "trabalho_em_equipe",
  "resolucao_de_problemas",
  "adaptabilidade",
  "iniciativa",
  "responsabilidade",
  "colaboracao",
  "resiliencia",
] as const

export type JourneySkill = (typeof JOURNEY_SKILLS)[number]

export const JOURNEY_SKILL_LABELS: Record<JourneySkill, string> = {
  criatividade: "Criatividade",
  comunicacao: "Comunicação",
  programacao: "Programação",
  lideranca: "Liderança",
  empatia: "Empatia",
  organizacao: "Organização",
  pensamento_critico: "Pensamento Crítico",
  trabalho_em_equipe: "Trabalho em equipe",
  resolucao_de_problemas: "Resolução de problemas",
  adaptabilidade: "Adaptabilidade",
  iniciativa: "Iniciativa",
  responsabilidade: "Responsabilidade",
  colaboracao: "Colaboração",
  resiliencia: "Resiliência",
}

export const JOURNEY_VISIBILITIES = ["private", "family", "public"] as const
export type JourneyVisibility = (typeof JOURNEY_VISIBILITIES)[number]

export const JOURNEY_VISIBILITY_LABELS: Record<JourneyVisibility, string> = {
  private: "Privada",
  family: "Família",
  public: "Pública",
}

export const JOURNEY_ATTACHMENT_KINDS = [
  "foto",
  "video",
  "arquivo",
  "link",
  "certificado",
] as const

export type JourneyAttachmentKind = (typeof JOURNEY_ATTACHMENT_KINDS)[number]

export const JOURNEY_ATTACHMENT_KIND_LABELS: Record<JourneyAttachmentKind, string> = {
  foto: "Foto",
  video: "Vídeo",
  arquivo: "Arquivo",
  link: "Link",
  certificado: "Certificado",
}

export const JourneyAttachmentSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(JOURNEY_ATTACHMENT_KINDS),
  label: z.string().trim().min(1, "Informe um nome para a evidência."),
  url: z.string().trim().min(1, "Informe um link ou arquivo."),
})

export type JourneyAttachmentInput = z.infer<typeof JourneyAttachmentSchema>

export const CreateJourneyDraftSchema = z.object({
  studentId: z.string().min(1),
  category: z.enum(JOURNEY_CATEGORIES),
})

export type CreateJourneyDraftState =
  | { message?: string; experienceId?: string }
  | undefined

export const AutosaveJourneyExperienceSchema = z.object({
  title: z.string().trim().max(160).optional(),
  organization: z.string().trim().max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  reflection: z.string().trim().max(4000).optional(),
  startDate: z.string().trim().max(10).optional(),
  endDate: z.string().trim().max(10).optional(),
  hours: z.coerce.number().min(0).max(10000).optional(),
  skills: z.array(z.enum(JOURNEY_SKILLS)).optional(),
  attachments: z.array(JourneyAttachmentSchema).optional(),
})

export type AutosaveJourneyExperienceInput = z.infer<
  typeof AutosaveJourneyExperienceSchema
>

export type AutosaveJourneyExperienceState =
  | { status: "ok"; savedAt: string }
  | { status: "error"; message: string }

export const SubmitJourneyExperienceSchema = z.object({
  experienceId: z.string().min(1),
  status: z.enum(["autodeclarada", "aguardando_validacao"]),
  visibility: z.enum(JOURNEY_VISIBILITIES),
})

export type SubmitJourneyExperienceState =
  | { message?: string }
  | undefined
