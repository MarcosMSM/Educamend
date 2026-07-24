"use client"

import Link from "next/link"
import { ChevronsUpDown, Home } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initials } from "@/lib/utils"

type StudentOption = { id: string; full_name: string }

export function StudentSwitcherMenu({
  students,
  activeStudentId,
}: {
  students: StudentOption[]
  activeStudentId: string
}) {
  const active = students.find((student) => student.id === activeStudentId)
  const siblings = students.filter((student) => student.id !== activeStudentId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
            {initials(active?.full_name ?? "?")}
          </AvatarFallback>
        </Avatar>
        <span className="flex-1 truncate text-sm font-medium">
          {active?.full_name ?? "Aluno"}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {siblings.map((student) => (
          <DropdownMenuItem key={student.id} render={<Link href={`/students/${student.id}`} />}>
            <Avatar size="sm">
              <AvatarFallback>{initials(student.full_name)}</AvatarFallback>
            </Avatar>
            {student.full_name}
          </DropdownMenuItem>
        ))}
        {siblings.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <Home />
          Voltar para a família
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
