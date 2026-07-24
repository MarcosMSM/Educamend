import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Handshake,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Acompanhamento completo",
    description:
      "Currículo, avaliações e planejamento por ano letivo, organizados em um só lugar.",
  },
  {
    icon: Users,
    title: "Família & comunidade",
    description:
      "Conecte-se com outras famílias e acompanhe a caminhada de cada aluno lado a lado.",
  },
  {
    icon: Handshake,
    title: "Rede de parceiros",
    description:
      "Encontre mentores e prestadores de serviço confiáveis no marketplace da plataforma.",
  },
] as const

const JOURNEY = [
  {
    icon: BookOpen,
    title: "Currículo",
    description: "Organize matérias e a grade curricular de cada ano letivo.",
  },
  {
    icon: Sparkles,
    title: "Avaliações",
    description: "Registre e acompanhe o progresso de cada aluno.",
  },
  {
    icon: FolderKanban,
    title: "Projetos",
    description: "Acompanhe projetos práticos do início ao fim.",
  },
  {
    icon: ShieldCheck,
    title: "Portfólio",
    description: "Reúna conquistas e destaques da jornada escolar.",
  },
  {
    icon: Store,
    title: "Marketplace",
    description: "Encontre mentores e parceiros para cada etapa.",
  },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-sidebar-primary" />
            <span className="font-heading text-lg font-semibold">
              Educamend Portal
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#recursos" className="hover:text-sidebar-primary">
              Recursos
            </a>
            <a href="#jornada" className="hover:text-sidebar-primary">
              Jornada
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Entrar
            </Button>
            <Button variant="accent" render={<Link href="/signup" />} nativeButton={false}>
              Criar conta
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl leading-tight font-semibold text-balance md:text-5xl">
                Educação que forma caráter,{" "}
                <span className="text-primary">desenvolve talentos</span> e
                abre caminhos.
              </h1>
              <p className="mt-5 max-w-md font-[family-name:var(--font-subheading)] text-lg text-muted-foreground">
                Da educação em casa à vida adulta, acompanhe a jornada da sua
                família em um só lugar, com currículo, portfólio e comunidade.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  variant="accent"
                  render={<Link href="/signup" />}
                  nativeButton={false}
                >
                  Criar conta
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/login" />}
                  nativeButton={false}
                >
                  Já tenho conta
                </Button>
              </div>
            </div>

            <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-primary/25">
              <div className="flex size-2/3 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                <GraduationCap className="size-24" strokeWidth={1.25} />
              </div>
            </div>
          </div>
        </section>

        <section
          id="recursos"
          className="border-y border-border bg-card py-14"
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="jornada" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-3xl font-semibold">
            Sua jornada, do início ao propósito
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Uma trilha completa, flexível e organizada para cada fase da
            educação da sua família.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="flex flex-col gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                  <Button
                    variant="link"
                    className="h-auto justify-start p-0 text-accent"
                    render={<Link href="/login" />}
                    nativeButton={false}
                  >
                    Saiba mais
                    <ArrowRight className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center md:px-6">
            <h2 className="text-3xl font-semibold">Pronto para começar?</h2>
            <p className="max-w-xl text-primary-foreground/85">
              Crie sua conta e organize a educação da sua família em poucos
              minutos.
            </p>
            <Button
              size="lg"
              variant="accent"
              className="mt-2"
              render={<Link href="/signup" />}
              nativeButton={false}
            >
              Criar conta
              <ArrowRight />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-6 text-sidebar-primary" />
              <span className="font-heading text-lg font-semibold">
                Educamend Portal
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-sidebar-foreground/75">
              Plataforma de gestão educacional para famílias.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-sidebar-primary">
              Navegação
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sidebar-foreground/80">
              <li>
                <a href="#recursos" className="hover:text-sidebar-foreground">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#jornada" className="hover:text-sidebar-foreground">
                  Jornada
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-sidebar-foreground">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-sidebar-primary">
              Suporte
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sidebar-foreground/80">
              <li>
                <Link href="/signup" className="hover:text-sidebar-foreground">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border/60 px-4 py-4 text-center text-xs text-sidebar-foreground/70 md:px-6">
          © {new Date().getFullYear()} Educamend Portal. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  )
}
