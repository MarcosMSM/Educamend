import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Unwrap<T> = T extends readonly (infer U)[] ? U : T

/**
 * Normalizes a Supabase embedded to-one relation. Without generated
 * `Database` types, the client's inferred type for embedded resources is
 * always an array, but PostgREST actually returns a single object for
 * many-to-one foreign keys. This adapts to whichever shape shows up at
 * runtime and gives call sites a plain object to work with.
 */
export function relation<T>(value: T): Unwrap<T> | null {
  if (Array.isArray(value)) {
    return (value[0] ?? null) as Unwrap<T> | null
  }
  return (value ?? null) as Unwrap<T> | null
}

export function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""}`.toUpperCase()
}
