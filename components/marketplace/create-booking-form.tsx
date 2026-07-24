"use client"

import { useActionState } from "react"

import { createBooking } from "@/actions/marketplace"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Student = { id: string; full_name: string }

export function CreateBookingForm({
  listingId,
  students,
}: {
  listingId: string
  students: Student[]
}) {
  const boundAction = createBooking.bind(null, listingId)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <form action={action} className="grid gap-4">
      {students.length > 0 && (
        <div className="grid gap-2">
          <Label>Para qual aluno?</Label>
          <Select
            name="studentId"
            items={Object.fromEntries(
              students.map((student) => [student.id, student.full_name])
            )}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="booking-date">Data preferida (opcional)</Label>
        <Input id="booking-date" name="preferredDate" type="date" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="booking-message">Mensagem</Label>
        <Textarea
          id="booking-message"
          name="message"
          rows={3}
          placeholder="Conte um pouco sobre o que você precisa."
        />
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Solicitar"}
      </Button>
    </form>
  )
}
