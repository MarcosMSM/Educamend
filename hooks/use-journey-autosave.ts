"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"

import { autosaveJourneyExperience } from "@/actions/journey"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import type { AutosaveJourneyExperienceInput } from "@/lib/validation/journey"

export type AutosaveStatus = "idle" | "saving" | "saved" | "error"

/**
 * Debounced (1500ms) + blur-safe autosave for the journey wizard. Every
 * field change across steps 2-5 flows through here so the draft is always
 * durably persisted before the review step, and refreshing mid-wizard
 * never loses data.
 */
export function useJourneyAutosave(experienceId: string) {
  const [status, setStatus] = useState<AutosaveStatus>("idle")
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const revertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (revertTimeoutRef.current) {
        clearTimeout(revertTimeoutRef.current)
      }
    }
  }, [])

  const save = useCallback(
    (fields: AutosaveJourneyExperienceInput) => {
      setStatus("saving")
      startTransition(async () => {
        const result = await autosaveJourneyExperience(experienceId, fields)

        if (result.status === "ok") {
          setStatus("saved")
          setLastSavedAt(result.savedAt)
          if (revertTimeoutRef.current) {
            clearTimeout(revertTimeoutRef.current)
          }
          revertTimeoutRef.current = setTimeout(() => setStatus("idle"), 2500)
        } else {
          setStatus("error")
        }
      })
    },
    [experienceId]
  )

  const debouncedSave = useDebouncedCallback(save, 1500)

  return { status, lastSavedAt, save, debouncedSave }
}
