/**
 * Extracts the active studentId from a pathname like `/students/{id}/...`.
 * Returns null for `/students`, `/students/new`, or any non-student route,
 * so the sidebar knows when to fall back to the global nav.
 */
export function getActiveStudentId(pathname: string): string | null {
  const match = pathname.match(/^\/students\/([^/]+)/)
  if (!match) {
    return null
  }
  const id = match[1]
  return id === "new" ? null : id
}
