import type { JourneyExperience } from "@/lib/data/journey"

type SeedTemplate = Omit<
  JourneyExperience,
  "id" | "student_id" | "attachments" | "created_at" | "updated_at"
> & {
  slug: string
  attachments: Omit<JourneyExperience["attachments"][number], "id">[]
}

const SEED_TEMPLATES: SeedTemplate[] = [
  {
    slug: "hackathon-educacao",
    title: "Hackathon Nacional de Inovação Educacional",
    category: "hackathon",
    organization: "Hackathon Educação 4.0",
    description:
      "Equipe de 4 pessoas construiu, em 48 horas, um protótipo de app para ajudar professores a identificar em tempo real alunos com dificuldade de aprendizagem.",
    start_date: "2026-03-14",
    end_date: "2026-03-16",
    hours: 24,
    reflection:
      "Aprendi a trabalhar sob pressão de tempo e a validar ideias rapidamente com o feedback de mentores da área de educação.",
    skills: ["programacao", "trabalho_em_equipe", "criatividade"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2026-03-20",
    attachments: [
      { kind: "link", label: "Repositório do protótipo", url: "https://github.com/exemplo/hackathon-educacao" },
      { kind: "certificado", label: "Certificado de participação", url: "certificado-hackathon-educacao.pdf" },
    ],
  },
  {
    slug: "feira-ciencias-energia-solar",
    title: "Feira de Ciências Municipal — Painel Solar de Baixo Custo",
    category: "feira_ciencias",
    organization: "Feira de Ciências Municipal",
    description:
      "Desenvolvimento de um protótipo de painel solar de baixo custo voltado a comunidades rurais, apresentado a uma banca avaliadora.",
    start_date: "2025-09-10",
    end_date: "2025-09-10",
    hours: 40,
    reflection:
      "Entendi como comunicar um projeto técnico para um público não especialista, ajustando a linguagem para cada ouvinte.",
    skills: ["pensamento_critico", "organizacao", "comunicacao"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2025-09-15",
    attachments: [
      { kind: "foto", label: "Fotos do estande na feira", url: "feira-ciencias-estande.jpg" },
    ],
  },
  {
    slug: "olimpiada-matematica",
    title: "Olimpíada Brasileira de Matemática",
    category: "olimpiada",
    organization: "OBMEP",
    description:
      "Classificação para a segunda fase da olimpíada, com menção honrosa na fase final.",
    start_date: "2025-06-01",
    end_date: "2025-06-01",
    hours: 12,
    reflection:
      "Reforcei disciplina de estudo e a persistência diante de problemas difíceis, mesmo sem resposta imediata.",
    skills: ["pensamento_critico", "resolucao_de_problemas"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2025-06-10",
    attachments: [
      { kind: "certificado", label: "Certificado de menção honrosa", url: "certificado-obmep-2025.pdf" },
    ],
  },
  {
    slug: "clube-robotica",
    title: "Clube de Robótica — Equipe FTC",
    category: "robotica",
    organization: "Clube de Robótica Escolar",
    description:
      "Membro fundador do clube, responsável pela programação do robô e liderança do subgrupo técnico da equipe.",
    start_date: "2024-02-01",
    end_date: "2026-07-01",
    hours: 120,
    reflection:
      "Aprendi a dividir tarefas complexas em etapas gerenciáveis e a coordenar prazos junto com o restante do time.",
    skills: ["programacao", "trabalho_em_equipe", "lideranca", "resolucao_de_problemas"],
    status: "aguardando_validacao",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    attachments: [
      { kind: "video", label: "Vídeo de demonstração do robô", url: "https://youtu.be/exemplo-robotica" },
      { kind: "link", label: "Página da equipe", url: "https://exemplo.com/equipe-ftc" },
    ],
  },
  {
    slug: "voluntariado-abrigo",
    title: "Voluntariado no Abrigo Municipal de Animais",
    category: "voluntariado",
    organization: "Abrigo Municipal de Animais",
    description:
      "Cuidados diários com animais resgatados e apoio na organização de eventos de adoção aos finais de semana.",
    start_date: "2024-05-01",
    end_date: "2024-12-01",
    hours: 60,
    reflection:
      "Desenvolvi empatia e constância mesmo em tarefas repetitivas, entendendo o impacto do trabalho de cuidado.",
    skills: ["empatia", "responsabilidade", "organizacao"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2024-12-05",
    attachments: [
      { kind: "foto", label: "Fotos dos eventos de adoção", url: "voluntariado-adocao.jpg" },
    ],
  },
  {
    slug: "estagio-marketing",
    title: "Estágio em Marketing Digital",
    category: "estagio",
    organization: "Agência Criativa Estúdio Nova",
    description:
      "Apoio na criação de conteúdo para redes sociais e análise de métricas de campanhas de clientes da agência.",
    start_date: "2025-02-01",
    end_date: "2025-08-01",
    hours: 400,
    reflection:
      "Vi na prática como decisões de negócio se conectam com dados de desempenho de campanhas reais.",
    skills: ["comunicacao", "organizacao", "iniciativa"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2025-08-05",
    attachments: [
      { kind: "certificado", label: "Declaração de estágio", url: "declaracao-estagio-marketing.pdf" },
      { kind: "link", label: "Portfólio de campanhas", url: "https://exemplo.com/portfolio-marketing" },
    ],
  },
  {
    slug: "ministerio-louvor",
    title: "Ministério de Louvor",
    category: "ministerio",
    organization: "Igreja Comunidade Vida",
    description:
      "Integrante da equipe de música da igreja, participando de ensaios semanais e apresentações em cultos.",
    start_date: "2023-01-01",
    end_date: null,
    hours: 150,
    reflection:
      "Aprendi a servir em equipe e a lidar com compromisso de longo prazo, mesmo quando a rotina fica cansativa.",
    skills: ["colaboracao", "responsabilidade", "comunicacao"],
    status: "autodeclarada",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    attachments: [],
  },
  {
    slug: "aulas-violao",
    title: "Aulas de Violão e Apresentações",
    category: "musica",
    organization: "Escola de Música Harmonia",
    description:
      "Estudo formal de violão com apresentações em recitais semestrais da escola de música.",
    start_date: "2023-03-01",
    end_date: "2023-11-01",
    hours: 80,
    reflection:
      "A prática constante me ensinou sobre paciência e progresso incremental, mesmo quando o avanço parece lento.",
    skills: ["criatividade", "resiliencia"],
    status: "arquivada",
    visibility: "private",
    validated_by: "Responsável da família",
    validated_at: "2023-11-10",
    attachments: [
      { kind: "video", label: "Vídeo do recital semestral", url: "https://exemplo.com/recital-violao" },
    ],
  },
  {
    slug: "selecao-volei",
    title: "Seleção Municipal de Vôlei Sub-17",
    category: "esporte",
    organization: "Seleção Municipal de Vôlei",
    description:
      "Participação no campeonato regional, com treinos três vezes por semana ao longo da temporada.",
    start_date: "2024-08-01",
    end_date: "2024-11-01",
    hours: 90,
    reflection:
      "Entendi o valor da disciplina física e do apoio mútuo dentro de um time em momentos de pressão.",
    skills: ["trabalho_em_equipe", "resiliencia", "organizacao"],
    status: "validada",
    visibility: "family",
    validated_by: "Responsável da família",
    validated_at: "2024-11-08",
    attachments: [
      { kind: "foto", label: "Foto do time no campeonato", url: "selecao-volei-time.jpg" },
    ],
  },
  {
    slug: "intercambio-eua",
    title: "Intercâmbio Cultural — High School nos EUA",
    category: "intercambio",
    organization: "Programa de Intercâmbio Cultural",
    description:
      "Um semestre estudando em uma high school americana, vivendo com família anfitriã e participando de atividades locais.",
    start_date: "2025-01-10",
    end_date: "2025-06-20",
    hours: 500,
    reflection:
      "Essa experiência mudou minha forma de ver diferenças culturais e me tornou mais independente no dia a dia.",
    skills: ["adaptabilidade", "comunicacao", "resiliencia"],
    status: "validada",
    visibility: "public",
    validated_by: "Responsável da família",
    validated_at: "2025-07-01",
    attachments: [
      { kind: "certificado", label: "Certificado de conclusão do programa", url: "certificado-intercambio.pdf" },
      { kind: "foto", label: "Fotos do período de intercâmbio", url: "intercambio-fotos.jpg" },
    ],
  },
  {
    slug: "curso-python",
    title: "Curso de Programação Python",
    category: "curso",
    organization: "Plataforma de Cursos Online",
    description:
      "Curso completo de lógica de programação e Python aplicado à análise de dados, com projetos práticos.",
    start_date: "2026-01-15",
    end_date: "2026-04-15",
    hours: 60,
    reflection:
      "Ganhei confiança para começar meus próprios projetos de código depois de entender a lógica por trás da linguagem.",
    skills: ["programacao", "iniciativa"],
    status: "autodeclarada",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    attachments: [
      { kind: "certificado", label: "Certificado de conclusão", url: "certificado-curso-python.pdf" },
    ],
  },
  {
    slug: "certificacao-analytics",
    title: "Certificação Google Analytics",
    category: "certificacao",
    organization: "Google",
    description:
      "Certificação sobre análise de dados de tráfego e comportamento de usuários em sites e aplicativos.",
    start_date: "2026-05-20",
    end_date: "2026-05-20",
    hours: 20,
    reflection: "Aprendi a transformar dados brutos em decisões práticas de melhoria.",
    skills: ["organizacao", "pensamento_critico"],
    status: "aguardando_validacao",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    attachments: [
      { kind: "certificado", label: "Certificado Google Analytics", url: "certificado-google-analytics.pdf" },
    ],
  },
  {
    slug: "canal-youtube-tech",
    title: "Canal no YouTube sobre Tecnologia Educacional",
    category: "youtube",
    organization: "Canal próprio",
    description:
      "Produção de vídeos semanais sobre ferramentas de tecnologia úteis para estudantes do ensino médio.",
    start_date: "2024-04-01",
    end_date: null,
    hours: 200,
    reflection:
      "Aprendi a me expressar publicamente e a lidar com feedback de uma audiência que não conheço pessoalmente.",
    skills: ["criatividade", "comunicacao", "iniciativa"],
    status: "autodeclarada",
    visibility: "public",
    validated_by: null,
    validated_at: null,
    attachments: [
      { kind: "link", label: "Canal no YouTube", url: "https://youtube.com/@exemplo-tech" },
    ],
  },
  {
    slug: "app-organizacao-estudos",
    title: "App de Organização de Estudos",
    category: "projeto_pessoal",
    organization: null,
    description: "Ainda estou estruturando as ideias iniciais para este projeto.",
    start_date: "2026-07-01",
    end_date: null,
    hours: null,
    reflection: null,
    skills: [],
    status: "rascunho",
    visibility: "private",
    validated_by: null,
    validated_at: null,
    attachments: [],
  },
]

export function buildSeedExperiences(studentId: string): JourneyExperience[] {
  return SEED_TEMPLATES.map((template) => {
    const id = `${studentId}-${template.slug}`
    const createdAt = `${template.start_date ?? "2026-01-01"}T12:00:00.000Z`
    const updatedAt = template.validated_at
      ? `${template.validated_at}T12:00:00.000Z`
      : createdAt

    const { slug, attachments, ...rest } = template

    return {
      ...rest,
      id,
      student_id: studentId,
      attachments: attachments.map((attachment, index) => ({
        ...attachment,
        id: `${id}-att-${index + 1}`,
      })),
      created_at: createdAt,
      updated_at: updatedAt,
    }
  })
}
