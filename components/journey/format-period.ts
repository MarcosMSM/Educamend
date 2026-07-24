function formatJourneyDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  })
}

export function formatJourneyPeriod(start: string | null, end: string | null): string {
  if (!start && !end) {
    return "Data não informada"
  }
  if (start && end && start !== end) {
    return `${formatJourneyDate(start)} – ${formatJourneyDate(end)}`
  }
  if (start && !end) {
    return `Desde ${formatJourneyDate(start)}`
  }
  return formatJourneyDate((start ?? end)!)
}

export function journeyExperienceYear(experience: {
  start_date: string | null
  end_date: string | null
  created_at: string
}): string {
  return (experience.start_date ?? experience.end_date ?? experience.created_at).slice(0, 4)
}
