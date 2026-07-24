import { useEffect, useRef } from "react"

/**
 * Closes a Dialog after a useActionState submission completes without
 * errors. Server actions here return `undefined` both before the first
 * submit and after a successful one, so success is inferred from the
 * pending->idle transition rather than from the state value itself.
 */
export function useCloseDialogOnSuccess(
  pending: boolean,
  hasError: boolean,
  setOpen: (open: boolean) => void
) {
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && !hasError) {
      setOpen(false)
    }
    wasPending.current = pending
  }, [pending, hasError, setOpen])
}
