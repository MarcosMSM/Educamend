const STUDENT_QUOTES = [
  "Toda grande história é construída um dia de cada vez.",
  "Cada experiência é um tijolo na construção de quem você é.",
  "O progresso de hoje é a base da conquista de amanhã.",
  "Aprender é a única coisa que ninguém pode tirar de você.",
  "Sua jornada é única — continue registrando cada passo dela.",
  "Pequenos avanços constantes constroem grandes histórias.",
  "Curiosidade hoje, conquista amanhã.",
  "O caminho importa tanto quanto o destino.",
] as const

/** Deterministic pick by day of year, so it's stable across server/client render. */
export function getDailyStudentQuote(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000)

  return STUDENT_QUOTES[dayOfYear % STUDENT_QUOTES.length]
}
