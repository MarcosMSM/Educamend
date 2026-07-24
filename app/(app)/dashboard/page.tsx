import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronRight, Plus } from "lucide-react"

import { getUserFamilies, requireUser } from "@/lib/auth"
import { getFamilyMembers } from "@/lib/data/families"
import { getStudents } from "@/lib/data/students"
import { createClient } from "@/lib/supabase/server"
import { calculateAge } from "@/lib/date"
import { initials, relation } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const user = await requireUser()
  const families = await getUserFamilies()

  if (families.length === 0) {
    redirect("/onboarding/family")
  }

  const family = families[0]

  const supabase = await createClient()
  const [{ data: profile }, members, students] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    getFamilyMembers(family.id),
    getStudents(),
  ])

  const firstName = (profile?.full_name ?? user.email ?? "Você").split(" ")[0]
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Bem-vindo, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">Hoje é {today}.</p>
        <p className="text-sm text-muted-foreground">Acompanhe a evolução da sua família.</p>
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Família {family.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          {members.map((member) => (
            <div
              key={member.profile_id}
              className="flex items-center gap-3 rounded-lg px-2 py-2"
            >
              <Avatar>
                <AvatarFallback>
                  {initials(relation(member.profiles)?.full_name ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {relation(member.profiles)?.full_name ?? "Sem nome"}
                </p>
                <p className="text-xs text-muted-foreground">Responsável</p>
              </div>
            </div>
          ))}

          {students.map((student) => {
            const age = calculateAge(student.birth_date)
            return (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <Avatar>
                  <AvatarFallback>{initials(student.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{student.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {age != null ? `${age} anos` : "Idade não informada"}
                  </p>
                </div>
                <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </Link>
            )
          })}

          {students.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              Nenhum filho cadastrado ainda.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            render={<Link href="/students/new" />}
            nativeButton={false}
            size="sm"
            className="w-full"
          >
            <Plus />
            Adicionar filho
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
