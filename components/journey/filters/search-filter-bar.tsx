"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import {
  JOURNEY_CATEGORIES,
  JOURNEY_CATEGORY_LABELS,
  JOURNEY_SKILLS,
  JOURNEY_SKILL_LABELS,
  JOURNEY_STATUSES,
  JOURNEY_STATUS_LABELS,
  type JourneyCategory,
  type JourneySkill,
  type JourneyStatus,
} from "@/lib/validation/journey"

const ALL = "all"
const FILTER_KEYS = ["q", "category", "status", "skill", "period"]

export function SearchFilterBar({ availableYears }: { availableYears: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === ALL) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const debouncedSearch = useDebouncedCallback((value: string) => updateParam("q", value), 400)

  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.get(key))

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_KEYS.forEach((key) => params.delete(key))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(event) => debouncedSearch(event.target.value)}
          placeholder="Buscar experiências..."
          className="pl-8"
        />
      </div>

      <Select
        value={searchParams.get("category") ?? ALL}
        onValueChange={(value) => updateParam("category", value)}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Categoria">
            {(value: string) =>
              value && value !== ALL ? JOURNEY_CATEGORY_LABELS[value as JourneyCategory] : "Categoria"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as categorias</SelectItem>
          {JOURNEY_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {JOURNEY_CATEGORY_LABELS[category]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("status") ?? ALL}
        onValueChange={(value) => updateParam("status", value)}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Status">
            {(value: string) =>
              value && value !== ALL ? JOURNEY_STATUS_LABELS[value as JourneyStatus] : "Status"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os status</SelectItem>
          {JOURNEY_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {JOURNEY_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("skill") ?? ALL}
        onValueChange={(value) => updateParam("skill", value)}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Competência">
            {(value: string) =>
              value && value !== ALL ? JOURNEY_SKILL_LABELS[value as JourneySkill] : "Competência"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as competências</SelectItem>
          {JOURNEY_SKILLS.map((skill) => (
            <SelectItem key={skill} value={skill}>
              {JOURNEY_SKILL_LABELS[skill]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {availableYears.length > 1 && (
        <Select
          value={searchParams.get("period") ?? ALL}
          onValueChange={(value) => updateParam("period", value)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os anos</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
